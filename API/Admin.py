from flask import *
from . import api
from .Auther import *
@api.route('/admin/auth', methods=['POST'])
def admin_auth():
    return AdminAuther(request.form['username'],request.form['password'],request.form['device_id']).auth_user()

