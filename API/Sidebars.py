from flask import *
from . import api
from .Auther import *
import json,sys,uuid,datetime
from .DB import *


@api.route('/api/admin/sites/sidebars/menu/get',methods=["GET"])
def sidebar_menu_get():
    return json.dumps(DB().selectFromDB("""SELECT * FROM "sidebar_menus" WHERE site_id = %s """
                                        % request.args.get('site_id')))


def sidebar_menu_get_dict(site_id):
    main_items=DB().selectFromDB("""SELECT * FROM "sidebar_menus" WHERE dropdown_id=0 AND site_id = %s """
                                        % site_id)
    sub_items=DB().selectFromDB("""SELECT * FROM "sidebar_menus" WHERE dropdown_id!=0 AND site_id = %s """
                                        % site_id)
    for item in main_items:
        sub_nav=[]
        for sub_item in sub_items:
            if item["id"] == sub_item["dropdown_id"]:
                sub_nav.append(sub_item)

        item["submenu"] = sub_nav
    return main_items

@api.route('/api/admin/sites/sidebars/menu/add',methods=["POST"])
def sidebar_menu_add():
    try:
        print (request.form)
        DB().changeInDB("""INSERT INTO "sidebar_menus" (name, site_id, item_order, dropdown_id) VALUES('%s',%s,%s,%s)"""
                        % (request.form['name'], request.form['site_id'],
                           request.form['order'],request.form['dropdown_id']),needCommit=True)
        print("succeed")
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

@api.route('/api/admin/sites/sidebars/menu/recount',methods=["POST"])
def sidebar_menu_recount():
    pass