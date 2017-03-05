from flask import *
from . import api
from .Auther import *
from .News import *

@api.route('/admin')
def login():
    return render_template("Admin/login.html")

@api.route('/admin/forms/list')
def forms_list():
    return render_template("Admin/layout.html", header=render_template("Admin/header.html"),
                           sidebar=render_template("Admin/sidebar.html"),
                           page=render_template("Admin/forms/forms_list.html"))

@api.route('/admin/forms/add')
def forms_add():
    return render_template("Admin/layout.html", header=render_template("Admin/header.html"),
                           sidebar=render_template("Admin/sidebar.html"),
                           page=render_template("Admin/forms/forms_add.html"))
@api.route('/admin/news/add')
def forms():
    return render_template("Admin/layout.html", header=render_template("Admin/header.html"),
                           sidebar=render_template("Admin/sidebar.html"),
                           page=render_template("Admin/AddNews.html"))

@api.route('/admin/news/list')
def lists():
    return render_template("Admin/layout.html", header=render_template("Admin/header.html"),
                           sidebar=render_template("Admin/sidebar.html"),
                           page=render_template("Admin/Lists.html", lists=json.loads(admin_news_get())))

@api.route('/admin/users/profile')
def Profile():
    return render_template("Admin/layout.html", header=render_template("Admin/header.html"),
                           sidebar=render_template("Admin/sidebar.html"),
                           page=render_template("Admin/Profile.html"))
