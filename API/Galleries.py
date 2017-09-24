from flask import *
from . import api
from .Auther import *
import json,sys,uuid,datetime,os
from .DB import *
from werkzeug.utils import secure_filename


@api.route('/api/admin/galleries/reserve',methods=['GET'])
def galleries_reserve():
    try:
        # print(request.form)
        t = DB().changeInDB("INSERT INTO \"GALLERIES\"(is_released) VALUES(0) ",
                                                 needCommit=True,needIDs=True)
        return json.dumps({'id': t})
    except Exception as e:
        pass

@api.route('/api/admin/galleries/check', methods=['POST'])
def galleries_check():
    try:
        if request.form['gal_id'] is None:
            abort(403)
        res = DB().selectFromDB('SELECT is_released FROM "GALLERIES" WHERE id = %s' % request.form['gal_id'])
        if len(res) > 0:
            if res[0]['is_released'] == 1:
                return json.dumps({'res': False}, ensure_ascii=False)
            else:
                return json.dumps({'res': True}, ensure_ascii=False)
        else:
            return json.dumps({'res': False}, ensure_ascii=False)
    except Exception as e:
        pass


@api.route('/api/admin/galleries/add',methods=['POST'])
def galleries_add():
    try:
        if request.form['gal_id'] is None:
            abort(403)
        # print(request.form)
        return json.dumps({'id': DB().changeInDB("UPDATE \"GALLERIES\" SET title = '%s',description = '%s', date=NOW(), is_released = 1 WHERE id = %s" %
                                                 (request.form['title'], request.form['description'], request.form['gal_id']),
                                                 needCommit=True)})
    except Exception as e:
        pass


@api.route('/api/admin/galleries/get/preview',methods=['POST'])
def galleries_get_prev():
    galleries = DB().selectFromDB("""SELECT id, title, description, to_char("date",'YYYY-MM-DD') as "date" FROM "GALLERIES" WHERE  is_released=1 """)
    galleries_photo_preview = DB().selectFromDB("""SELECT * FROM "GALLERIES_PHOTOS" WHERE "type"=1""")
    for item in galleries:
        photos = []

        for galleries_photo in galleries_photo_preview:
            if item["id"] == galleries_photo["gal_id"]:
                photos.append(galleries_photo)
            if photos.__len__()==6:
                break

        item["photo"] = photos

    return json.dumps(galleries)

@api.route('/api/admin/galleries/get/<int:id>',methods=['GET'])
def galleries_get(id):
    galleries = DB().selectFromDB("""SELECT id, title, description, to_char("date",'YYYY-MM-DD') as "date" FROM "GALLERIES" WHERE  id=%s"""% id)
    galleries_photo_preview = DB().selectFromDB("""SELECT * FROM "GALLERIES_PHOTOS" WHERE "type"=0 AND gal_id=%s""" % id)

    galleries[0]['photo'] = galleries_photo_preview

    return json.dumps(galleries)


@api.route('/api/admin/galleries/delete',methods=['POST'])
def galleries_delete():
    try:
        if request.form['gal_id'] is None:
            abort(403)
        # print(request.form)
        return json.dumps({'id': DB().changeInDB("DELETE FROM \"GALLERIES\" WHERE id = %s" %
                                                 (request.form['gal_id']), needCommit=True)})
    except Exception as e:
        pass

@api.route('/api/admin/uploads/scripts', methods=['GET'])
def galleries_scripts():
    #TODO: Да, такая хуйня.
    return render_template('Admin/galleries/scripts.html')
@api.route('/api/admin/galleries/list', methods=['GET'])
def galleries_list():
    try:
        if request.args.get('site_id') is None:
            abort(403)
        return json.dumps(DB().selectFromDB("SELECT * FROM GALLERIES WHERE site_id = %s" % (request.args.get('site_id'))))
    except Exception as e:
        pass
if __name__ == '__main__':
    galleries_reserve()