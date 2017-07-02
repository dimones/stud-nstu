from flask import *
from . import api
from .DB import *


@api.route('/api/admin/events/get', methods=['GET'])
def admin_events_get():
    return json.dumps(DB().selectFromDB("""SELECT * FROM "EVENTS" ORDER BY  event_date  DESC """))


@api.route('/api/admin/events/add', methods=['POST'])
def admin_events_add():
    try:
        print (request.form)
        DB().changeInDB("""INSERT INTO "EVENTS"(title,text,event_date,site_id, lead_text) VALUES('%s','%s', TO_TIMESTAMP('%s','DD.MM.YYYY HH24:MI'),%s,'%s')"""
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