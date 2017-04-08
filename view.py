from flask import render_template
from API import *
class Header:
    navigation=None
    def __init__(self, nav):
        self.navigation=nav
    def render(self):
        return render_template('header.html', nav=self.navigation)
class Footer:
    def render(self):
        return render_template('footer.html')

class Promo:
    adress = None
    def __init__(self, adress):
        self.adress = adress
    def render(self):
        return render_template(self.adress)

class Content:
    sidebar = None
    posts = []
    def __init__(self, sidebar = None, posts = None):
        self.sidebar = sidebar
        # print(posts)
        self.posts = [posts]
        # self.posts.append(posts)
    def render(self):
        return render_template('content.html', posts=self.posts)

class Main:
    def render(self):
        pass

class Sidebar:
    side_items=[]
    def render(self):
        pass

class Side_item:
    def render(self):
        pass

class side_menu(Side_item):
    pass

class side_news(Side_item):
    pass

class side_cal(Side_item):
    pass

class Page:
    header=None
    promo = None
    content = None
    footer=None
    def __init__(self, site=None, sidebar_item=None, material=None):
        temp = DB().selectFromDB("""SELECT * FROM "sites" """, needDict=True)
        self.header = Header(temp)
        for item in temp:
            if site == item['id']:
                self.promo = Promo(item['template_name'])
                break
        # header=
        # promo=
        # content=
        self.footer=Footer()
    def __str__(self):
        return self.render()
    def render(self):
        return render_template('layout.html', header=self.header.render(),
                               promo=self.promo.render(),
                               # content=self.content.render(),
                               footer=self.footer.render())
