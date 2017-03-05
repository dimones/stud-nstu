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
        def hello_world_1():
            return render_template("onir_tmp.html", list=json.loads(admin_news_get()))

        @app.route('/test')
        def test():
            return Page(promo=promo(adress="promo_garage.html"),
                        content=content(
                            # sidebar=sidebar()
                            posts=("""
                                        <div class="note">
                                          <div class="main-text">
                                              <h2>
                                                 Общая информация
                                              </h2>
                                              <p class="important">
                                                  25 апреля 1995 года в Новосибирском государственном техническом университете был создан Центр научно-технической работы студентов (Центр НТРС НГТУ),
                                                  который руководствуется в своей деятельности Уставом НГТУ, решениями и рекомендациями Экспертного Совета по НИРС, являясь его исполнительным органом по
                                                  развитию и координации научно-технической работы студентов и созданию новых университетских традиций.

                                              </p>
                                              <p class="important">
                                                  Организатором Центра НТРС и его руководителем до ноября 2003 года была доктор технических наук, профессор Кувшинова Мария Александровна.
                                              </p>
                                              <p class="important">
                                                  Здесь разработано информационное и программное обеспечение мониторинга НИРС в НГТУ. В банке данных имеются сведения о студентах,
                                                  участвующих в научно-исследовательской работе и результатах их деятельности, сведения о студентах-держателях грантов,
                                                  о преподавателях - научных руководителях, а также информация обо всех текущих и плановых мероприятиях университета, города, России,
                                                  об участии студентов в конференциях, выставках, олимпиадах, конкурсах и т.д.
                                              </p>
                                              <p class="important">
                                                  Центр НТРС поддерживает связь с аналогичными структурами города и России.
                                              </p>

                                              <p class="important">
                                                  Центр НТРС является инициатором выпуска сборника тезисов по результатам Дней Науки НГТУ (1996 г.),
                                                  проведения в университете студенческого конкурса "Прометей" (1997 г.), стендовой научной студенческой конференции (1997 г.), всероссийской научной
                                                  конференции молодых ученых "Наука. Технологии. Инновации" (2001 г.),
                                              </p>
                                              <p class="important">
                                                  В 2017 году ЦНТРС был переименован в отдел научно-исследовательской работы студентов- ОНИРС, и введён в состав Инновационно-технологического центра.
                                              </p>

                                              </div>
                                      </div>
                                        """))).render()

        @app.route('/news')
        def news():
            return render_template("news.html")

        @app.route('/news/<news>')
        def piece_of_news(news):
            return render_template("piece-of-news.html")

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

<<<<<<< HEAD
=======
        @app.route('/admin')
        def login():
            return render_template("Admin/login.html")

        @app.route('/admin/forms/list')
        @need_admin
        def forms_list():
            return render_template("Admin/layout.html", header=render_template("Admin/header.html"),
                                   sidebar=render_template("Admin/sidebar.html"),
                                   page=render_template("Admin/forms/forms_list.html"))

        @app.route('/admin/forms/add')
        @need_admin
        def forms_add():
            return render_template("Admin/layout.html", header=render_template("Admin/header.html"),
                                   sidebar=render_template("Admin/sidebar.html"),
                                   page=render_template("Admin/forms/forms_add.html"))
        @app.route('/admin/news/add')
        @need_admin
        def forms():
            return render_template("Admin/layout.html", header=render_template("Admin/header.html"),
                                   sidebar=render_template("Admin/sidebar.html"),
                                   page=render_template("Admin/AddNews.html"))

        @app.route('/admin/news/list')
        @need_admin
        def lists():
            tmp = admin_news_get()
            print(tmp)
            return render_template("Admin/layout.html", header=render_template("Admin/header.html"),
                                   sidebar=render_template("Admin/sidebar.html"),
                                   page=render_template("Admin/Lists.html", lists=json.loads(admin_news_get())))
>>>>>>> origin/master

    def run(self):
        self.app.run(debug=True)


s = StudNSTU(app)


if __name__ == '__main__':
    s.run()