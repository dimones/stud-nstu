from flask import *
from . import api
from .Auther import *
import json,sys,uuid,datetime
from .DB import *


class DateEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.date):
            return obj.strftime("%d.%m.%y")
        if isinstance(obj, map):
            return list(obj)
        return json.JSONEncoder.default(self, obj)



@api.route('/api/admin/news/get',methods=['GET'])
def admin_news_get():
    return json.dumps(DB().selectFromDB("""SELECT * FROM "NEWS" WHERE site_id = 1"""),ensure_ascii=False,cls=DateEncoder)

@api.route('/api/admin/news/add', methods=['POST'])
def admin_news_add():
    print(request.form['date'])
    try:
        DB().changeInDB("""INSERT INTO "NEWS"(title,lead_content,content,date,is_active,site_id) VALUES
                        ('%s','%s','%s', TO_DATE('%s','DD.MM.YYYY'),%s,1)""" %
                        (request.form['title'],request.form['lead_content'],request.form['content'],
                         request.form['date'],request.form['is_active']),needCommit=True)
        print(1)
        return json.dumps({"succeed": True})
    except Exception as e:
        print(e)
        return json.dumps({"succeed":False})

@api.route('/api/admin/news/change', methods=['POST'])
def admin_news_change():
    try:
        DB().changeInDB("""UPDATE "NEWS" SET title = '%s', lead_content = '%s', content = '%s',
                            date = TO_DATE('%s',"DD.MM.YYYY"),is_active = %s,site_id = 1 WHERE id = %s""" %
                        (request.form['title'],request.form['lead_content'],request.form['content'],
                         request.form['date'],request.form['is_active'],request.form['id']),needCommit=True)
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