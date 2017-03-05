from flask import *
from . import api
from .Auther import *
import json,sys,uuid,datetime,magic,os
from .DB import *
from werkzeug.utils import secure_filename
@api.route('/api/admin/pages/get',methods=['GET'])
def pages_get():
    return json.dumps(DB().selectFromDB("""SELECT * FROM "PAGES" """,needDict=True),ensure_ascii=False)

@api.route('/api/admin/pages/add',methods=['POST'])
def pages_add():
    try:
        DB().changeInDB("""INSERT INTO "PAGES"(page_content,author_id,type) VALUES('%s',%s,'%s')""" %
                        (request.form['page_content'],request.form['author_id'],request.form['type']),needCommit=True)
        return json.dumps({'succeed': True})
    except Exception as e:
        print(e)
        return json.dumps({'succeed': False})

@api.route('/api/admin/pages/change',methods=['POST'])
def pages_change():
    try:
        DB().changeInDB("""UPDATE "PAGES" SET page_content = '%s', author_id = %s, type = '%s' WHERE id = %s""" %
                        (request.form['page_content'],request.form['author_id'],request.form['type'],request.form['id']),
                        needCommit=True)
        return json.dumps({'succeed': True})
    except Exception as e:
        print(e)
        return json.dumps({'succeed': False})

@api.route('/api/admin/pages/remove', methods=['POST'])
def pages_remove():
    try:
        DB().changeInDB("""DELETE FROM "PAGES" WHERE id = %s""" % (request.form['id']), needCommit=True)
        return json.dumps({'succeed': True})
    except Exception as e:
        print(e)
        return json.dumps({'succeed': False})

@api.route('/api/admin/pages/files/upload/<_id>', methods=['GET', 'POST'])
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
        filename = secure_filename(file.filename)
        db = DB()

        if _id != -1:
            mypath = api.root_path[:-4] + '/static/files/onir/' + str(_id)
            if os.path.exists(mypath) != True:
                os.mkdir(mypath)
            _filename = str(uuid.uuid4().hex) + '.' + filename.rsplit('.', 1)[1]
            try:
                file.save(os.path.join(mypath, _filename))
                db.changeInDB(("""INSERT INTO "DOCUMENTS"(filename, site_id,mime_type,page_id) VALUES('%s',%s,'%s',%s)"""
                               %  (_filename,1,magic.from_file(mypath, mime=True),_id)), needCommit=True)
                return json.dumps({'succeed': True})
            except Exception as e:
                print(e)
                return json.dumps({"succeed":False})