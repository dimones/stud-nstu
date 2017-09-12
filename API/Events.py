from flask import *
from . import api
from .DB import *
import datetime

@api.route('/api/admin/events/get', methods=['GET'])
def admin_events_get():
    return json.dumps(DB().selectFromDB("""SELECT * FROM "EVENTS" ORDER BY  event_date  DESC """))

@api.route('/api/admin/events/get/weeks', methods=['GET'])
def admin_events_get_weeks():
    months =['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
    week_days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']
    day = datetime.date.today()+datetime.timedelta(days=-datetime.date.today().weekday())
    events = DB().selectFromDB("""SELECT title, to_char(DATE(event_date), 'YYYY-MM-DD') AS "date", to_char(pg_catalog.TIME(event_date), 'HH24:MI') as "time", text, lead_text, site_id 
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
                                           'text': item["text"]
                                           })
        result.append(week_day)
        day += datetime.timedelta(days=1)
    return result




@api.route('/api/admin/events/add', methods=['POST'])
def admin_events_add():
    try:
        print(request.form)
        DB().changeInDB("""INSERT INTO "EVENTS"(title,text,event_date,site_id, lead_text) 
                           VALUES('%s','%s', TO_TIMESTAMP('%s','DD.MM.YYYY HH24:MI'),%s,'%s')"""
                        % (request.form['title'], request.form['text'], request.form['date'],
                           request.form['site_id'], request.form['lead_text']), needCommit=True)
        return json.dumps({'succeed': True})
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

