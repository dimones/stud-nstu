from flask import *
from . import api
from .Auther import *
import json,sys,uuid,datetime
from .DB import *

@api.route('/api/admin/users/get', methods=["GET"])
def users_get():
    return json.dumps(DB().selectFromDB("""SELECT * FROM "ADMIN_USERS" WHERE site_id = 1"""))

@api.route('/api/admin/users/add',methods=["POST"])
def users_add():
    try:
        DB().changeInDB("""INSERT INTO "ADMIN_USERS"(username,password,role,site_id) VALUES('%s',%s,%s,%s)"""
                        % (request.form['username'], request.form['password'], request.form['role'],
                           1),needCommit=True)
        return json.dumps({'succeed': True})
    except Exception as e:
        print(e)
        return json.dumps({'succeed': False})

@api.route('/api/admin/users/remove',methods=["POST"])
def users_remove():
    try:
        DB().changeInDB("""DELETE FROM "ADMIN_USERS" WHERE id = %s""" % (request.form['id']),needCommit=True)
        return json.dumps({'succeed': True})
    except Exception as e:
        print(e)
        return json.dumps({'succeed': False})

@api.route('/api/admin/users/change_password',methods=["POST"])
def users_change_password():
    try:
        DB().changeInDB("""UPDATE "ADMIN_USERS" SET password = '%s' WHERE id = %s"""
                        % (request.form['password'], request.form['id']),needCommit=True)
        return json.dumps({'succeed': True})
    except Exception as e:
        print(e)
        return json.dumps({'succeed': False})

@api.route('/api/admin/users/change_role',methods=["POST"])
def users_change_role():
    try:
        DB().changeInDB("""UPDATE "ADMIN_USERS" SET role = %s WHERE id = %s"""
                        % (request.form['role'], request.form['id']), needCommit=True)
        return json.dumps({'succeed': True})
    except Exception as e:
        print(e)
        return json.dumps({'succeed': False})