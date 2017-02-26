from flask import *
from . import api
from .Auther import *
@api.route('/api/admin/auth', methods=['POST'])
def admin_aut():
    a = AdminAuther(request.form['username'],request.form['password'],request.form['device_id']).auth_user()
    print(a)
    return a

