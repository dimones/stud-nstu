from flask import *
from . import api
from .Auther import *
import json,sys,uuid,datetime
from .DB import *


@api.route('/api/admin/sites/sidebars/menu/get',methods=["GET"])
def sidebar_menu_get():
    return json.dumps(DB().selectFromDB("""SELECT * FROM "sidebar_menus" WHERE site_id = %s """
                                        % request.args.get('site_id')))

@api.route('/api/admin/sites/sidebars/menu/add',methods=["POST"])
def sidebar_menu_add():
    try:
        DB().changeInDB("""INSERT INTO "sidebar_menus"(name,site_id,page_id,order,dropdown_id) VALUES('%s',%s,%s,%s,%s)"""
                        % (request.form['name'], request.form['site_id'], request.form['page_id'],
                           request.form['order'],request.form['dropdown_id']),needCommit=True)
        return json.dumps({'succeed': True})
    except Exception as e:
        print(e)
        return json.dumps({'succeed': False})

@api.route('/api/admin/sites/sidebars/menu/change',methods=["POST"])
def sidebar_menu_change():
    try:
        DB().changeInDB("""UPDATE "sidebar_menus" SET name = '%s', site_id = %s, page_id = %s, order = %s,
                            dropdown_id = %s WHERE id = %s"""
                        % (request.form['name'], request.form['site_id'], request.form['page_id'],
                           request.form['order'],request.form['dropdown_id'],request.form['id']),needCommit=True)
        return json.dumps({'succeed': True})
    except Exception as e:
        print(e)
        return json.dumps({'succeed': False})

@api.route('/api/admin/sites/sidebars/menu/remove',methods=["POST"])
def sidebar_menu_remove():
    try:
        DB().changeInDB("""DELETE FROM "sidebar_menus" WHERE id = %s""" % (request.form['id']),needCommit=True)
        return json.dumps({'succeed': True})
    except Exception as e:
        print(e)
        return json.dumps({'succeed': False})
