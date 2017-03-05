from flask import *
from functools import wraps
from API.Auther import *
def need_admin(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        print(request.cookies)
        if 'device_token' not in request.cookies or 'device_id' not in request.cookies:
            return redirect(url_for('login'))
        a_h = AdminHelper(request.cookies['device_token'], request.cookies['device_id'])
        if a_h.isValid():
            role = a_h.getRole()
            part_site = request.path.split('/')[1].lower()
            if part_site is 'news':
                if role in [1,2,3,4]:
                    return func(*args, **kwargs)
                else:
                    return redirect(url_for('login'))
            elif part_site is 'forms':
                if role in [1,2,3,4]:
                    return func(*args, **kwargs)
                else:
                    return redirect(url_for('login'))
            elif part_site is 'users':
                if role in [1,2,3]:
                    return func(*args, **kwargs)
                else:
                    return redirect(url_for('login'))
            return func(*args, **kwargs)
        else:
            return redirect(url_for('login'))
    return decorated_function