from flask import *
from . import api
from .Auther import *
import json,sys,uuid,datetime
from .DB import *


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