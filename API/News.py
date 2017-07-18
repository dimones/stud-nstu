from flask import *
from . import api
from .Auther import *
import json,sys,uuid,datetime,os
from .DB import *
from email.mime.text import MIMEText
from werkzeug.utils import secure_filename
from os import listdir
from os.path import isfile, join

ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

class DateEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.date):
            return obj.strftime("%d.%m.%y")
        if isinstance(obj, map):
            return list(obj)
        return json.JSONEncoder.default(self, obj)

@api.route('/api/admin/news/get',methods=['GET'])
def admin_news_get():
    return json.dumps(DB().selectFromDB("""SELECT * FROM "NEWS" ORDER BY "date" desc"""),ensure_ascii=False,cls=DateEncoder)

@api.route('/api/admin/news/getMain',methods=['GET'])
def admin_news_getTop():
    return json.dumps(DB().selectFromDB("""SELECT * FROM "NEWS" WHERE in_top = 1 ORDER BY date desc LIMIT 5"""),ensure_ascii=False,cls=DateEncoder)

@api.route('/api/admin/news/get/<int:_id>',methods=['GET'])
def admin_news_get_by_id(_id):
    return json.dumps(DB().selectFromDB("""SELECT * FROM "NEWS" WHERE id = %s """%_id),ensure_ascii=False,cls=DateEncoder)

@api.route('/api/admin/news/add', methods=['POST'])
def admin_news_add():
    try:
        news_id = DB().changeInDB("""INSERT INTO "NEWS"(site_id,title,lead_content,content,date,is_active,author_id, in_top) VALUES
                        (%s,'%s','%s','%s', TO_DATE('%s','DD.MM.YYYY'),%s,%s, %s)""" %
                        (request.form['site_id'],request.form['title'],request.form['lead_content'],request.form['content'],
                         request.form['date'],request.form['is_active'],request.form['author_id'], request.form['in_top']),needCommit=True,needIDs=True)
        return json.dumps({"succeed": True, 'news_id' : news_id})
    except Exception as e:
        print(e)
        return json.dumps({"succeed":False})

@api.route('/api/admin/news/change', methods=['POST'])
def admin_news_change():
    try:
        print(request.form)
        DB().changeInDB("""UPDATE "NEWS" SET title = '%s', lead_content = '%s', content = '%s',
                            date = TO_DATE('%s','DD.MM.YYYY'),site_id = %s WHERE id = %s""" %
                        (request.form['title'],request.form['lead_content'],request.form['content'],
                         request.form['date'],request.form['site_id'],request.form['id']),needCommit=True)
        return json.dumps({"succeed": True })
    except Exception as e:
        print(e)
        return json.dumps({"succeed":False})

@api.route('/api/admin/news/remove',methods=['POST'])
def admin_news_remove():
    try:
        DB().changeInDB("DELETE FROM \"NEWS\" WHERE id = %s" % request.form['id'],needCommit=True)
        return json.dumps({"succeed": True})
    except Exception as e:
        print(e)
        return json.dumps({"succeed": False})

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

@api.route('/api/admin/news/image/upload/<_id>', methods=['GET', 'POST'])
def upload_file(_id):
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit a empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            next_id = -1
            db = DB()

            if _id != -1:
                mypath = api.root_path[:-4] + '/static/img/news'
                if os.path.exists(mypath) != True:
                    os.mkdir(mypath)
                _filename = str(uuid.uuid4().hex) + '.' + filename.rsplit('.', 1)[1]
                try:
                    file.save(os.path.join(mypath, _filename))
                    print(_filename)
                    db.changeInDB(("""UPDATE "NEWS" SET image_name = '%s' WHERE id=%s""" %  (_filename,_id)), needCommit=True)
                    return json.dumps({'succeed': True})
                except Exception as e:
                    print(e)
                    return json.dumps({"succeed":False})