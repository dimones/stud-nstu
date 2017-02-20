from flask import Flask, render_template
from view import *

app = Flask(__name__)

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
    return render_template("onir.html")

@app.route('/onir_about')
def onir_about():
    return render_template("onir_about.html")

@app.route('/admin')
def admin_page():
    return render_template("admin.html")

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
{#                          <div class="person">#}
{#                              <div class="img"></div>#}
{#                              <span>Директор ИТЦ</span>#}
{#                              <span>Филатова Светлана Геннадьевна</span>#}
{#                          </div>#}
{#                          <div class="person">#}
{#                              <div class="img"></div>#}
{#                              <span>Руководитель группы ОНИР</span>#}
{#                              <span>Петрова Ирина Владимировна</span>#}
{#                          </div>#}
                  </div>
                    """))).render()

if __name__ == '__main__':
    app.run(debug=True)
