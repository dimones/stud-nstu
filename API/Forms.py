from flask import *
from . import api
from .Auther import *
import json,sys,uuid,datetime
from .DB import *

@api.route('/api/admin/form/add', methods=['POST'])
def form_add():
    try:
        DB().changeInDB("""INSERT INTO "FORMS"(json_data) VALUES('%s')""" % request.form['data'],needCommit=True)
        return json.dumps({"succeed": True})
    except Exception as e:
        print(e)
        return json.dumps({"succeed": False})