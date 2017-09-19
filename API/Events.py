from flask import *
from . import api
from .DB import *
import datetime
import json,sys,uuid,datetime,os
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
@api.route('/api/admin/events/get', methods=['GET'])
def admin_events_get():
    return json.dumps(DB().selectFromDB("""SELECT * FROM "EVENTS" ORDER BY  event_date  DESC """))

@api.route('/api/admin/events/get/weeks', methods=['GET'])
def admin_events_get_weeks():
    months =['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
    week_days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']
    day = datetime.date.today()+datetime.timedelta(days=-datetime.date.today().weekday())
    events = DB().selectFromDB("""SELECT id, site_id,title, to_char(DATE(event_date), 'YYYY-MM-DD') AS "date", to_char(pg_catalog.TIME(event_date), 'HH24:MI') as "time", text, lead_text, site_id 
                                  FROM "EVENTS" WHERE  event_date>TO_TIMESTAMP('%s','YYYY-MM-DD') ORDER by "time" ASC""" % day)
    result = []
    for i in range(14):
        week_day = {}
        week_day['day'] = day.day
        week_day['month'] = (months[day.month-1])
        week_day['weekday']= week_days[day.weekday()]
        week_day['events'] = []
        for item in events:
            if item['date'] == day.strftime('%Y-%m-%d'):
                week_day['events'].append({'title': item["title"],
                                           'time': item["time"],
                                           'lead': item["lead_text"],
                                           'text': item["text"],
                                           'url': str(item["site_id"])+"/" + str(item["id"])
                                           })
        result.append(week_day)
        day += datetime.timedelta(days=1)
    return result




@api.route('/api/admin/events/add', methods=['POST'])
def admin_events_add():
    try:
        print(request.form)
        event_id = DB().changeInDB("""INSERT INTO "EVENTS"(title,text,event_date,site_id, lead_text) 
                           VALUES('%s','%s', TO_TIMESTAMP('%s','DD.MM.YYYY HH24:MI'),%s,'%s')"""
                        % (request.form['title'], request.form['text'], request.form['date'],
                           request.form['site_id'], request.form['lead_text']), needCommit=True,needIDs=True)
        return json.dumps({'succeed': True, 'event_id': event_id})
    except Exception as e:
        print(e)
        return json.dumps({'succeed': False})


@api.route('/api/admin/events/remove', methods=['POST'])
def event_remove():
    try:
        DB().changeInDB("""DELETE FROM "EVENTS" WHERE id = %s""" % (request.form['id']), needCommit=True)
        return json.dumps({'succeed': True})
    except Exception as e:
        print(e)
        return json.dumps({'succeed': False})

@api.route('/api/admin/events/change', methods=['POST'])
def event_change():
    try:
        DB().changeInDB("""UPDATE "EVENTS" SET title = '%s', text = '%s', lead_text = '%s',
                            event_date = TO_TIMESTAMP('%s','DD.MM.YYYY HH24:MI'),site_id = %s WHERE id = %s""" %
                        (request.form['title'], request.form['text'], request.form['lead_text'],
                         request.form['date'], request.form['site_id'], request.form['id']), needCommit=True)
        return json.dumps({"succeed": True })
    except Exception as e:
        print(e)
        return json.dumps({"succeed":False})
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS
@api.route('/api/admin/events/image/upload/<_id>', methods=['GET', 'POST'])
def upload_file_event(_id):
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
                mypath = api.root_path[:-4] + '/static/img/events'
                if os.path.exists(mypath) != True:
                    os.makedirs(mypath,exist_ok=True)
                _filename = str(uuid.uuid4().hex) + '.' + filename.rsplit('.', 1)[1]
                try:
                    file.save(os.path.join(mypath, _filename))
                    print(_filename)
                    db.changeInDB(("""UPDATE "EVENTS" SET image_name = '%s' WHERE id=%s""" %  (_filename,_id)), needCommit=True)
                    return json.dumps({'succeed': True})
                except Exception as e:
                    print(e)
                    return json.dumps({"succeed":False})