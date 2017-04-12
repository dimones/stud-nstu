from flask import *
from . import api
from .Auther import *
from .News import *
from .Users import *
from .Sidebars import *
from Utils import *
@api.route('/admin')
def login():

    return render_template("Admin/login.html")

@api.route('/admin/forms/list')
@need_admin
def forms_list():

    return render_template("Admin/layout.html", header=render_template("Admin/header.html"),
                           sidebar=render_template("Admin/sidebar.html"),
                           page=render_template("Admin/forms/forms_list.html"))

@api.route('/admin/forms/add')
@need_admin
def forms_add():
    return render_template("Admin/layout.html", header=render_template("Admin/header.html"),
                           sidebar=render_template("Admin/sidebar.html"),
                           page=render_template("Admin/forms/forms_add.html"))

@api.route('/admin/news/add')
@need_admin
def forms():
    user = AdminHelper(request.cookies['device_token'], request.cookies['device_id']).getUserInfo()
    if user[0]['site_id']==0:
        return render_template("Admin/layout.html", header=render_template("Admin/header.html"),
                               sidebar=render_template("Admin/sidebar.html"),
                               page=render_template("Admin/news/add.html", action="create",
                                                    sites=DB().selectFromDB("""SELECT id, title FROM sites WHERE editable =1""")))
    else:
        return render_template("Admin/layout.html", header=render_template("Admin/header.html"),
                               sidebar=render_template("Admin/sidebar.html"),
                               page=render_template("Admin/news/add.html", action="create",
                                                    sites=DB().selectFromDB("""SELECT id, title FROM sites WHERE id =%s""" % user[0]['site_id'])))

@api.route('/admin/news/edit/<int:_id>', methods=['GET'])
@need_admin
def change_news(_id):
    return render_template("Admin/layout.html", header=render_template("Admin/header.html"),
                           sidebar=render_template("Admin/sidebar.html"),
                           page=render_template("Admin/news/add.html", action="edit",
                                                object=json.dumps((DB().selectFromDB("""SELECT * FROM "NEWS" WHERE id=%s"""%_id))[0],ensure_ascii=False,cls=DateEncoder),
                                                id=_id,
                                                user=(AdminHelper(request.cookies['device_token'],
                                                                  request.cookies['device_id']).getUserInfo())[0]))

@api.route('/admin/news/list')
@need_admin
def lists():
    return render_template("Admin/layout.html", header=render_template("Admin/header.html"),
                           sidebar=render_template("Admin/sidebar.html",news_list="activ"),
                           page=render_template("Admin/news/lists.html", lists=json.loads(admin_news_get())))

@api.route('/admin/users/add')
@need_admin
def Profile():

    return render_template("Admin/layout.html", header=render_template("Admin/header.html"),
                           sidebar=render_template("Admin/sidebar.html"),
                           page=render_template("Admin/users/add.html"))

@api.route('/admin/users/list')
@need_admin
def users_list():
    return render_template("Admin/layout.html", header=render_template("Admin/header.html"),
                           sidebar=render_template("Admin/sidebar.html"),
                           page=render_template("Admin/users/list.html", list=json.loads(users_get())))

@api.route('/admin/sidebar_menus/list')
@need_admin
def sidebar_menus_list():
    return render_template("Admin/layout.html", header=render_template("Admin/header.html"),
                           sidebar=render_template("Admin/sidebar.html"),
                           page=render_template("Admin/sidebars/list.html", list=DB().selectFromDB("""SELECT * FROM "sidebar_menus" WHERE site_id = 1 """)))

@api.route('/admin/sidebar_menus/add')
@need_admin
def sidebar_menus_add():
    user = AdminHelper(request.cookies['device_token'], request.cookies['device_id']).getUserInfo()
    # items = sidebar_menu_get_dict(1)
    if user[0]['site_id'] == 0:
        return render_template("Admin/layout.html", header=render_template("Admin/header.html"),
                               sidebar=render_template("Admin/sidebar.html"),
                               page=render_template("Admin/sidebars/add.html",
                                                    sites=DB().selectFromDB("""SELECT id, title FROM sites WHERE editable =1"""))
                                                    # list=items,
                                                    # count=len(items)+2)
                               )
    else:
         return render_template("Admin/layout.html", header=render_template("Admin/header.html"),
                               sidebar=render_template("Admin/sidebar.html"),
                               page=render_template("Admin/sidebars/add.html",
                                                    sites=DB().selectFromDB("""SELECT id, title FROM sites WHERE id =%s""" % user[0]['site_id'])))
                                                    # list=items,
                                                    # count=len(items)+2))

@api.route('/admin/pages/add')
@need_admin
def page_add():
    user = AdminHelper(request.cookies['device_token'], request.cookies['device_id']).getUserInfo()
    if user[0]['site_id']==0:
        return render_template("Admin/layout.html", header=render_template("Admin/header.html"),
                               sidebar=render_template("Admin/sidebar.html"),
                               page=render_template("Admin/page/add.html", list=DB().selectFromDB("""SELECT * FROM "sidebar_menus" WHERE site_id = 1 """),
                                                                           sites=DB().selectFromDB("""SELECT id, title FROM sites WHERE editable =1""")))
    else:
        return render_template("Admin/layout.html", header=render_template("Admin/header.html"),
                               sidebar=render_template("Admin/sidebar.html"),
                               page=render_template("Admin/page/add.html", list=DB().selectFromDB("""SELECT * FROM "sidebar_menus" WHERE site_id = 1 """),
                                                                           sites=DB().selectFromDB("""SELECT id, title FROM sites WHERE id =%s""" % user[0]['site_id'])))

@api.route('/admin/pages/list')
@need_admin
def page_list():
    return render_template("Admin/layout.html", header=render_template("Admin/header.html"),
                           sidebar=render_template("Admin/sidebar.html"),
                           page=render_template("Admin/page/list.html", list=DB().selectFromDB(
                               """SELECT pages.id, pages.page_content, pages.title,admin.name,admin.surname, pages.date FROM "pages", "ADMIN_USERS" AS  admin WHERE admin.id=pages.author_id""")))

@api.route('/admin/pages/edit/<int:_id>', methods=['GET'])
@need_admin
def change_pages(_id):
    print(AdminHelper(request.cookies['device_token'], request.cookies['device_id']).getUserInfo())
    return render_template("Admin/layout.html", header=render_template("Admin/header.html"),
                           sidebar=render_template("Admin/sidebar.html"),
                           page=render_template("Admin/page/add.html", action="edit",
                                                list=DB().selectFromDB(
                                                    """SELECT * FROM "sidebar_menus" WHERE site_id = 1 """),
                                                object=((DB().selectFromDB(
                                                    """SELECT * FROM "pages" WHERE id=%s""" % _id))[0]
                                                                 ),
                                                id=_id,
                                                user=(AdminHelper(request.cookies['device_token'],
                                                                  request.cookies['device_id']).getUserInfo())[0]))


        # tem_scr="""<!-- The template to display files available for upload -->
#             <script id="template-upload" type="text/x-tmpl">
#             {% for (var i=0, file; file=o.files[i]; i++) { %}
#                 <tr class="template-upload fade">
#                     <td>
#                         <span class="preview"></span>
#                     </td>
#                     <td>
#                         <p class="name">{%=file.name%}</p>
#                         <strong class="error"></strong>
#                     </td>
#                     <td>
#                         <p class="size">Processing...</p>
#                         <div class="progress"></div>
#                     </td>
#                     <td>
#                         {% if (!i && !o.options.autoUpload) { %}
#                             <button class="start" disabled>Start</button>
#                         {% } %}
#                         {% if (!i) { %}
#                             <button class="cancel">Cancel</button>
#                         {% } %}
#                     </td>
#                 </tr>
#             {% } %}
#             </script>
#             <!-- The template to display files available for download -->
#             <script id="template-download" type="text/x-tmpl">
#             {% for (var i=0, file; file=o.files[i]; i++) { %}
#                 <tr class="template-download fade">
#                     <td>
#                         <span class="preview">
#                             {% if (file.thumbnailUrl) { %}
#                                 <a href="{%=file.url%}" title="{%=file.name%}" download="{%=file.name%}" data-gallery><img src="{%=file.thumbnailUrl%}"></a>
#                             {% } %}
#                         </span>
#                     </td>
#                     <td>
#                         <p class="name">
#                             <a href="{%=file.url%}" title="{%=file.name%}" download="{%=file.name%}" {%=file.thumbnailUrl?'data-gallery':''%}>{%=file.name%}</a>
#                         </p>
#                         {% if (file.error) { %}
#                             <div><span class="error">Error</span> {%=file.error%}</div>
#                         {% } %}
#                     </td>
#                     <td>
#                         <span class="size">{%=o.formatFileSize(file.size)%}</span>
#                     </td>
#                     <td>
#                         <button class="delete" data-type="{%=file.deleteType%}" data-url="{%=file.deleteUrl%}"{% if (file.deleteWithCredentials) { %} data-xhr-fields='{"withCredentials":true}'{% } %}>Delete</button>
#                         <input type="checkbox" name="delete" value="1" class="toggle">
#                     </td>
#                 </tr>
#             {% } %}
#             </script>"""