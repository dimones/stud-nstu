from flask import *
from . import api
from .Auther import *
import json,sys,uuid,datetime
from .DB import *

#sites

@api.route('/api/admin/sites/get/<int:_id>',methods=['GET'])
def admin_sites_get(_id):
    return json.dumps(DB().selectFromDB("""SELECT * FROM sites WHERE id=%s""" % _id))

@api.route('/api/admin/sites/get/sub/<int:_id>',methods=['GET'])
def admin_sites_get_sub(_id):
    return json.dumps(DB().selectFromDB("""SELECT * FROM sites WHERE sub=%s""" % _id))

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

@api.route('/api/admin/sites/remove', methods=['POST'])
def admin_sites_remove():
    try:
        DB().changeInDB("""DELETE FROM "NAME" WHERE id = %s""" % request.form['id'],needCommit=True)
        return json.dumps({'succeed': True})
    except Exception as e:
        print(e)
        return json.dumps({'succeed': False})


@api.route('/api/admin/sites/set/sidebar', methods=['POST'])
def set_sidebar():
    try:
        DB().changeInDB("""UPDATE sites SET default_sidebar=%s WHERE id = %s""" %(request.form['sidebar'], request.form['id']), needCommit=True)
        return json.dumps({'succeed': True})
    except Exception as e:
        print(e)
        return json.dumps({'succeed': False})

@api.route('/api/admin/sites/get/sidebar/<int:_id>', methods=['GET'])
def get_sidebar(_id):
    try:
        return json.dumps({'succeed': True, 'sidebar_id': (DB().selectFromDB("""SELECT default_sidebar FROM sites WHERE id = %s""" % _id, needDict=False, needOne=True))[0]})
    except Exception as e:
        print(e)
        return json.dumps({'succeed': False})

@api.route('/api/admin/sites/template/get/<int:_id>',methods=['GET'])
def admin_sites_template_get(_id):
    return (DB().selectFromDB("""SELECT template_name FROM site_types WHERE id=%s""" % _id, needOne=True, needDict=False))[0]
