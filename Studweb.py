from flask import Flask, render_template,wrappers
from view import *
from API import *
from Utils import *

app = Flask(__name__)
class StudNSTU:
    app = None
    # app = Flask(__name__)

    def __init__(self,app):
        self.app = app
        app.register_blueprint(api)
        @app.route('/culture')
        def culture():
            return render_template("culture.html")

        @app.route('/map')
        def map():
            return render_template("map.html")

        @app.route('/om')
        def om():
            return render_template("om.html")

        @app.route('/schedule')
        def schedule():
            return render_template("schedule.html")

        @app.route('/map_inner.html')
        def map_inner_html():
            return render_template("map_inner.html")

        @app.route('/garage')
        def hello_world():
            return render_template("garage.html")

        @app.route('/')
        def hello_world1():
            return render_template('science.html')

        @app.route('/science')
        def science():
            return render_template('science.html')

        @app.route('/onirs')
        def onirs():
            return render_template("onir_tmp.html", page=render_template("news_list.html", list=json.loads(admin_news_get())))

        @app.route('/test')
        def test():
            return Page(promo=promo(adress="promo_garage.html"),
                        content=content(
                            # sidebar=sidebar()
                            posts=("""<div>dfs</div>"""))).render()


        @app.route('/news')
        def news():
            return render_template("news.html")

        @app.route('/news/<int:news>')
        def piece_of_news(news):
            return render_template("onir_tmp.html", page=render_template("news.html", item=DB().selectFromDB('SELECT * FROM "NEWS" WHERE id = %s' % (news), needDict=True)[0]))

        @app.route('/gallery')
        def gallery():
            return render_template("gallery.html")

        @app.route('/gallery/<album>')
        def album(album):
            return render_template("album.html")

        @app.route('/gallery/<album>/<photo>')
        def photo(album, photo):
            return render_template("photo.html")

        @app.route('/conferences')
        def conferences():
            return render_template("conferences.html")
        @app.route('/dev')
        def dev():
            return render_template("dev.html")

    def run(self):
        self.app.run(debug=True)


s = StudNSTU(app)


if __name__ == '__main__':
    s.run()