from flask import *
from . import api
from .Auther import *
import json,sys,uuid,datetime
from .DB import *

#sites

@api.route('/api/admin/sites/get',methods=['GET'])
def admin_sites_get():
    return json.dumps(DB().selectFromDB("""SELECT * FROM "NAME" """))


@api.route('/api/admin/sites/add',methods=['POST'])
def admin_sites_add():
    try:
        DB().changeInDB("""INSERT INTO "NAME"(sub,order,template_name,title) VALUES(%s,%s,'%s','%s')"""
                        % (request.form['sub'], request.form['order'], request.form['template_name'],
                           request.form['title']),needCommit=True)
        return json.dumps({'succeed': True})
    except Exception as e:
        print(e)
        return json.dumps({'succeed': False})

@api.route('/api/admin/sites/change',methods=['POST'])
def admin_sites_change():
    try:
        DB().changeInDB("""UPDATE "NAME" SET sub = %s, order = %s, template_name = '%s', title = '%s'
                                                        WHERE id = %s"""
                          % (request.form['sub'], request.form['order'], request.form['template_name'],
                             request.form['title'], request.form['id']),needCommit=True)
        return json.dumps({'succeed': True})
    except Exception as e:
        print(e)
        return json.dumps({'succeed': False})

@api.route('/api/admin/sites/remove',methods=['POST'])
def admin_sites_remove():
    try:
        DB().changeInDB("""DELETE FROM "NAME" WHERE id = %s""" % request.form['id'],needCommit=True)
        return json.dumps({'succeed': True})
    except Exception as e:
        print(e)
        return json.dumps({'succeed': False})