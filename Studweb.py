from flask import Flask, render_template,wrappers,session
# from flask_session import *
from View import *
from API import *
from Utils import *
app = Flask(__name__)

# Session(app)
class StudNSTU:
    app = None
    # app = Flask(__name__)
    # SESSION_TYPE = 'redis'
    def __init__(self,app):

        self.app = app
        app.register_blueprint(api)
        print(app)
        # SESSION_TYPE = 'redis'
        # app.con fig.from_object(__name__)
        # sess = Session()
        # sess.init_app(app)
        @app.route('/')
        def index():
            # return Page().render()
            return render_template('layout.html', header=Header().render(), content=render_template("index/index.html"), footer=render_template("index/footer.html"))

        @app.route('/science')
        def science():
            return render_template('layout.html', header=Header().render(),
                        content=render_template("science.html"), footer=render_template("footer.html"))

        @app.route('/culture')
        def culture():
            return render_template('layout.html', header=Header().render(),
                                   content=render_template("promos/culture.html"), footer=render_template("footer.html"))

        @app.route('/schedule')
        def schedule():
            return render_template('layout.html', header=Header().render(),
                                   content=render_template("promos/schedule.html"), footer=render_template("footer.html"))

        @app.route('/map')
        def map():
            return render_template('layout.html', header=Header().render(),
                                       content=render_template("map.html"), footer=render_template("footer.html"))

        @app.route('/om')
        def om():
            return render_template('layout.html', header=Header().render(),
                                   content=render_template("om.html"), footer=render_template("footer.html"))

        @app.route('/3d-nstu')
        def _3dnstu():
            return render_template('layout.html', header=Header().render(),
                                   content=render_template("panoramas.html"), footer=render_template("footer.html"))

        @app.route('/dev')
        def dev():
            return render_template('layout.html', header=Header().render(),
                                   content=render_template("dev.html"), footer=render_template("footer.html"))

        @app.route('/news')
        def news():
            return render_template("news.html")

        @app.route('/onirs')
        def onirs():
            return render_template('layout.html', header=Header().render(),
                                   content=render_template("onir_tmp.html",
                                                           sidebar=sidebar_menu_get_dict(1),
                                                           page=render_template("pages/news_list.html",
                                                                                list=json.loads(admin_news_get()))),
                                   footer=render_template("footer.html"))

        @app.route('/onirs/<int:page>')
        def onirs_page(page):
            print(DB().selectFromDB("""SELECT id, title, page_content FROM "pages" WHERE sidebar_id=%s """% page, needDict=True))
            return render_template('layout.html', header=Header().render(),
                                   content=render_template("onir_tmp.html",
                                                           sidebar=sidebar_menu_get_dict(1),
                                                           page=render_template("pages/default.html",
                                                                                pages=DB().selectFromDB("""SELECT id, title, page_content, date FROM "pages" WHERE sidebar_id=%s """% page, needDict=True),
                                                                                files=pages_files_get(page))),
                                   footer=render_template("footer.html"))
        @app.route('/news/<int:news>')
        def piece_of_news(news):
            return render_template('layout.html', header=Header().render(),
                                   content=render_template("onir_tmp.html",
                                                           sidebar=sidebar_menu_get_dict(1),
                                                           page=render_template("news.html",
                                                                                item=DB().selectFromDB('SELECT * FROM "NEWS" WHERE id = %s' % (news), needDict=True)[0])),
                                   footer=render_template("footer.html"))

        @app.route('/<int:site>')
        def getSite(site):
            return Page(site).render()

        @app.route('/<int:site>/<int:page>')
        def getPage(site, page):
            return Page(site, page).render()

        @app.route('/<int:site>/<int:page>/<int:material>')
        def getMaterial(site, page, material):
            return Page(site, page, material).render()

        @app.route('/events')
        def events():
            # return Page().render()
            return render_template('layout.html', header=Header().render(), content=render_template(
                "pages/events.html"), footer=render_template("index/footer.html"))

        @app.route('/len')
        def lens():
            # return Page().render()
            return render_template('update170517.html')


    def run(self):
        self.app.run(debug=True)


s = StudNSTU(app)


if __name__ == '__main__':
    s.run()