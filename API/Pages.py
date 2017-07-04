from flask import *
from . import api
from .Auther import *
import json,sys,uuid,datetime,os
from .DB import *
from werkzeug.utils import secure_filename
@api.route('/api/admin/pages/get',methods=['GET'])
def pages_get():
    return json.dumps(DB().selectFromDB("""SELECT * FROM "pages" """,needDict=True),ensure_ascii=False,cls=DateEncoder)

# @api.route('/api/admin/pages/add',methods=['POST'])
# def pages_add():
#     try:
#         DB().changeInDB("""INSERT INTO "pages"(page_content,author_id,type,date,date_begin) VALUES('%s',%s,'%s',TO_DATE('%s','DD.MM.YYYY'),TO_DATE('%s','DD.MM.YYYY'))""" %
#                         (request.form['page_content'],request.form['author_id'],request.form['type'],request.form['date'],request.form['date_begin']),needCommit=True)
#         return json.dumps({'succeed': True})
#     except Exception as e:
#         print(e)
#         return json.dumps({'succeed': False})

@api.route('/api/admin/pages/add',methods=['POST'])
def pages_add():
    try:
        userInfo = AdminHelper(request.cookies['device_token'], request.cookies['device_id']).getUserInfo()
        DB().changeInDB("""INSERT INTO "pages"(author_id,page_content,title, sidebar_id, date, lead_content) VALUES(%s,'%s','%s', %s,TO_DATE('%s','DD.MM.YYYY'), '%s')""" %
                         (userInfo[0]['id'], request.form['page_content'], request.form['title'], request.form['sitebar_id'], request.form['date'], request.form['lead_content']), needCommit=True)
        return json.dumps({'succeed': True})
    except Exception as e:
        print(e)
        return json.dumps({'succeed': False})

@api.route('/api/admin/pages/change',methods=['POST'])
def pages_change():
    try:
        DB().changeInDB("""UPDATE "pages" SET title='%s',lead_content='%s', page_content = '%s',"date" = TO_DATE('%s','DD.MM.YYYY'), sidebar_id=%s WHERE id = %s""" %
                            (request.form['title'], request.form['lead_content'], request.form['page_content'],  request.form['date'],request.form['sidebar_id'], request.form['id']),
                            needCommit=True)
        return json.dumps({'succeed': True})
    except Exception as e:
        return json.dumps({'succeed': False})

@api.route('/api/admin/pages/remove', methods=['POST'])
def pages_remove():
    try:
        DB().changeInDB("""DELETE FROM "pages" WHERE id = %s""" % (request.form['id']), needCommit=True)
        return json.dumps({'succeed': True})
    except Exception as e:
        print(e)
        return json.dumps({'succeed': False})

# @api.route('/api/admin/pages/files/upload/<_id>', methods=['GET', 'POST'])
# def pages_upload_file(_id):
#     if request.method == 'POST':
#         import magic
#         # check if the post request has the file part
#         if 'file' not in request.files:
#             flash('No file part')
#             return redirect(request.url)
#         file = request.files['file']
#         # if user does not select file, browser also
#         # submit a empty part without filename
#         if file.filename == '':
#             flash('No selected file')
#             return redirect(request.url)
#         filename = secure_filename(file.filename)
#         db = DB()
#
#         if _id != -1:
#             mypath = api.root_path[:-4] + '/static/files/onir/' + str(_id)
#             if os.path.exists(mypath) != True:
#                 os.mkdir(mypath)
#             _filename = str(uuid.uuid4().hex) + '.' + filename.rsplit('.', 1)[1]
#             try:
#                 file.save(os.path.join(mypath, _filename))
#                 db.changeInDB(("""INSERT INTO "DOCUMENTS"(filename, site_id,mime_type,page_id) VALUES('%s',%s,'%s',%s)"""
#                                %  (_filename,1,magic.from_file(mypath, mime=True),_id)), needCommit=True)
#                 return json.dumps({'succeed': True})
#             except Exception as e:
#                 print(e)
#                 return json.dumps({"succeed":False})

@api.route('/api/admin/pages/files/get/<int:_id>')
def pages_files_get(_id):
    return json.dumps(DB().selectFromDB("""SELECT * FROM "DOCUMENTS" WHERE page_id = %s""" % _id,needDict=True),ensure_ascii=False)

@api.route('/api/admin/pages/next_id',methods=["GET"])
def pages_next_id():
    return json.dumps({'id': DB().getNextIDFromTable("pages")})

import os


class uploadfile():
    def __init__(self, name, type=None, size=None, not_allowed_msg='',site='onir', _id='', isGal = False):
        self.name = name
        self.type = type
        self.size = size
        self.not_allowed_msg = not_allowed_msg
        self.url = '/static/files/' + site +'/' + str(_id)+'/' + name

        self.thumbnail_url = "thumbnail/%s" % name
        self.delete_url = '/api/admin/pages/files/delete/' + site + '/' + str(_id) +'/' + name
        if isGal:
            self.url = '/static/galleries/' + site + '/' + str(_id) + '/' + name
            self.delete_url = '/api/admin/galleries/files/delete/' + site + '/' + str(_id) + '/' + name
        self.delete_type = "DELETE"

    def is_image(self):
        fileName, fileExtension = os.path.splitext(self.name.lower())

        if fileExtension in ['.jpg', '.png', '.jpeg', '.bmp']:
            return True

        return False

    def get_file(self):
        if self.type != None:
            # POST an image
            if self.type.startswith('image'):
                return {"name": self.name,
                        "type": self.type,
                        "size": self.size,
                        "url": self.url,
                        "thumbnailUrl": self.thumbnail_url,
                        "deleteUrl": self.delete_url,
                        "deleteType": self.delete_type, }

            # POST an normal file
            elif self.not_allowed_msg == '':
                return {"name": self.name,
                        "type": self.type,
                        "size": self.size,
                        "url": self.url,
                        "deleteUrl": self.delete_url,
                        "deleteType": self.delete_type, }

            # File type is not allowed
            else:
                return {"error": self.not_allowed_msg,
                        "name": self.name,
                        "type": self.type,
                        "size": self.size, }

        # GET image from disk
        elif self.is_image():
            return {"name": self.name,
                    "size": self.size,
                    "url": self.url,
                    "thumbnailUrl": self.thumbnail_url,
                    "deleteUrl": self.delete_url,
                    "deleteType": self.delete_type, }

        # GET normal file from disk
        else:
            return {"name": self.name,
                    "size": self.size,
                    "url": self.url,
                    "deleteUrl": self.delete_url,
                    "deleteType": self.delete_type, }

import os
upload_config = {}
upload_config['SECRET_KEY'] = 'stud-nstu'
upload_config['UPLOAD_DOCUMENTS_FOLDER'] = 'static/files/onir/'
upload_config['THUMBNAIL_DOCUMENTS_FOLDER'] = 'static/files/onir/thumbnail/'
upload_config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024

ALLOWED_EXTENSIONS = set(['txt', 'gif', 'png', 'jpg', 'jpeg', 'bmp', 'rar', 'zip', '7zip', 'doc', 'docx'])
IGNORED_FILES = set(['.gitignore'])


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def gen_file_name(filename):
    """
    If file was exist already, rename it and return a new name
    """

    i = 1
    while os.path.exists(os.path.join(upload_config['UPLOAD_DOCUMENTS_FOLDER'], filename)):
        name, extension = os.path.splitext(filename)
        filename = '%s_%s%s' % (name, str(i), extension)
        i += 1

    return filename


def create_thumbnail(image):
    try:
        import Image
        base_width = 80
        img = Image.open(os.path.join(upload_config['UPLOAD_FOLDER'], image))
        w_percent = (base_width / float(img.size[0]))
        h_size = int((float(img.size[1]) * float(w_percent)))
        img = img.resize((base_width, h_size), PIL.Image.ANTIALIAS)
        img.save(os.path.join(upload_config['THUMBNAIL_FOLDER'], image))

        return True

    except Exception as e:
        print(e)
        return False


@api.route("/api/admin/<string:_type>/files/upload/<string:_site>/<int:_id>", methods=['GET', 'POST'])
def upload(_type,_site,_id):
    site = DB().selectFromDB("SELECT lat_name FROM \"sites\" WHERE id = %s " % _site)[0]['lat_name']
    if request.method == 'POST':
        files = request.files['file']

        if files:
            print(files.filename)
            filename = secure_filename(files.filename)
            # filename = gen_file_name(filename)
            # filename = files.filename
            mime_type = files.content_type
            print(mime_type)
            # if not allowed_file(files.filename):
            #     result = uploadfile(name=filename, type=mime_type, size=0, not_allowed_msg="File type not allowed")
            # else:
            if _type == 'pages':
                path = api.root_path[:-4] + '/static/files/' + site +'/'  + str(_id)
                # save file to disk
                if os.path.exists(path) != True:
                    os.makedirs(path,exist_ok=True)
                # _filename = str(uuid.uuid4().hex) + '.' + filename.split('.')[-1]
                uploaded_file_path = os.path.join(path, filename)
                files.save(uploaded_file_path)
                #TODO site_id
                DB().changeInDB("""INSERT INTO "DOCUMENTS"(filename,site_id,mime_type,page_id) VALUES('%s',%s,'%s',%s)"""
                                % (filename,_site,mime_type,_id),needCommit=True)
                # create thumbnail after saving
                # if mime_type.startswith('image'):
                #     create_thumbnail(filename)

                # get file size after saving
                size = os.path.getsize(uploaded_file_path)

                # return json for js call back
                result = uploadfile(name=filename, type=mime_type, size=size,site=site,_id=_id)

                return json.dumps({"files": [result.get_file()]})
            elif _type == 'galleries':
                path = api.root_path[:-4] + '/static/galleries/' + site + '/' + str(_id)
                # save file to disk
                if os.path.exists(path) != True:
                    os.mkdir(path)
                # _filename = str(uuid.uuid4().hex) + '.' + filename.split('.')[-1]
                uploaded_file_path = os.path.join(path, filename)
                files.save(uploaded_file_path)
                # TODO site_id
                DB().changeInDB("""INSERT INTO "GALLERIES_PHOTO"(filename,site_id,mime_type,gal_id) VALUES('%s',%s,'%s',%s)"""
                                % (filename, site, mime_type, _id), needCommit=True)
                # create thumbnail after saving
                # if mime_type.startswith('image'):
                #     create_thumbnail(filename)

                # get file size after saving
                size = os.path.getsize(uploaded_file_path)

                # return json for js call back
                result = uploadfile(name=filename, type=mime_type, size=size, site=_site, _id=_id)

                return json.dumps({"files": [result.get_file()]})

    if request.method == 'GET':
        temp_path = api.root_path[:-4] + '/static/files/' + site +'/'  + str(_id)
        if _type is 'galleries':
            temp_path = api.root_path[:-4] + '/static/galleries/' + site + '/' + str(_id)
        if os.path.exists(temp_path):
            # get all file in ./data directory
            files = [f for f in os.listdir(temp_path) if
                     os.path.isfile(temp_path) and f not in IGNORED_FILES]

            file_display = []

            for f in files:
                size = os.path.getsize(os.path.join(temp_path, f))
                file_saved = uploadfile(name=f, size=size,site=site,_id=_id)
                file_display.append(file_saved.get_file())

            return json.dumps({"files": file_display},ensure_ascii=False)
        else:
            return json.dumps({"files": []}, ensure_ascii=False)
    return "ok"


@api.route("/api/admin/<string:_type>/files/delete/<string:_site>/<int:_id>/<string:filename>", methods=['DELETE'])
def delete(_type,_site,_id,filename):
    if _type is 'pages':
        path = api.root_path[:-4] + '/static/files/' + _site +'/' + str(_id)+'/' + filename
        print(path)
        # file_thumb_path = os.path.join(upload_config['THUMBNAIL_DOCUMENTS_FOLDER'], filename)

        if os.path.exists(path):
            print('file exists')
            try:
                os.remove(path)
                DB().changeInDB("""DELETE FROM "DOCUMENTS" WHERE page_id = %s and filename = '%s'""" % (_id,filename),needCommit=True)

                # if os.path.exists(file_thumb_path):
                #     os.remove(file_thumb_path)

                return json.dumps({"filename": 'True'})
            except:
                return json.dumps({"filename": 'False'})
    elif _type is 'galleries':
        path = api.root_path[:-4] + '/static/galleries/' + _site + '/' + str(_id) + '/' + filename
        print(path)
        # file_thumb_path = os.path.join(upload_config['THUMBNAIL_DOCUMENTS_FOLDER'], filename)

        if os.path.exists(path):
            print('file exists')
            try:
                os.remove(path)
                DB().changeInDB("""DELETE FROM "GALLERIES_PHOTO" WHERE page_id = %s and filename = '%s'""" % (_id, filename),
                                needCommit=True)

                # if os.path.exists(file_thumb_path):
                #     os.remove(file_thumb_path)

                return json.dumps({"filename": 'True'})
            except:
                return json.dumps({"filename": 'False'})


# serve static files
@api.route("/thumbnail/<string:filename>", methods=['GET'])
def get_thumbnail(filename):
    return send_from_directory(upload_config['THUMBNAIL_FOLDER'], filename=filename)


@api.route("/data/<string:filename>", methods=['GET'])
def get_file(filename):
    return send_from_directory(os.path.join(upload_config['UPLOAD_DOCUMENTS_FOLDER']), filename=filename)
