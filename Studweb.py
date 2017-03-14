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

        @app.route('/')
        def hello_world1():
            return render_template('index.html')

        @app.route('/science')
        def science():
            return render_template('science.html')

        @app.route('/culture')
        def culture():
            return render_template("culture.html")

        @app.route('/schedule')
        def schedule():
            return render_template("schedule.html")

        @app.route('/map')
        def map():
            return render_template("map.html")

        @app.route('/om')
        def om():
            return render_template("om.html")

        @app.route('/test')
        def test():
            return Page(promo=promo(adress="promo_garage.html"),
                        content=content(
                            # sidebar=sidebar()
                            posts=("""<div>dfs</div>"""))).render()

        @app.route('/dev')
        def dev():
            return render_template("dev.html")

        @app.route('/news')
        def news():
            return render_template("news.html")

        @app.route('/wysiwyg')
        def wysiwyg():
            return render_template("wysiwyg.html")
        @app.route('/news/<int:news>')
        def piece_of_news(news):
            return render_template("onir_tmp.html", page=render_template("news.html", item=DB().selectFromDB('SELECT * FROM "NEWS" WHERE id = %s' % (news), needDict=True)[0]))


    def run(self):
        self.app.run(debug=True)


s = StudNSTU(app)


if __name__ == '__main__':
    s.run()