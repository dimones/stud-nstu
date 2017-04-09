from flask import render_template
from API import *
class Header:
    nav=None
    def __init__(self):
        self.nav=DB().selectFromDB("""SELECT * FROM "sites" WHERE sub=0 ORDER BY site_order ASC """, needDict=True)
    def render(self):
        return render_template('header.html', nav=self.nav)
class Footer:
    footer=None
    def __init__(self,site):
        if site==None:
            self.footer = "index/footer.html"
        else:
            self.footer = "footer.html"
    def render(self):
        return render_template(self.footer)

class Promo:
    adress = None
    def __init__(self, site):
        obj= DB().selectFromDB("""SELECT template_name FROM "sites"  WHERE id=%s"""% site,needOne=True,needDict=True)
        self.adress =obj[0]['template_name']
    def render(self):
        if self.adress==None:
            return
        else:
            return render_template(self.adress)

class Content:
    sidebar = None
    content = []
    posts=[]
    def __init__(self, site):
        pass
        # self.sidebar=Side_item(site)
    def render(self):
        return render_template('content.html', posts=self.content)

class Main:
    def render(self):
        pass

class Sidebar:
    side_items=[]
    def __init__(self, site):
        self.side_items.append(Side_menu(site))
        self.side_items.append(Side_news())
    def render(self):
        pass

class Side_item:
    def render(self):
        pass

class Side_menu(Side_item):
    menu=None
    def __init__(self, site):
        self.menu=sidebar_menu_get_dict(site)

class Side_news(Side_item):
    pass

class Side_cal(Side_item):
    pass

class Page:
    header=None
    promo = None
    content = None
    footer=None
    def __init__(self, site=None, sidebar_item=None, material=None):
        self.header = Header()
        self.promo = Promo(site)
        self.content = Content(site)
        self.footer = Footer(site)
    def __str__(self):
        return self.render()
    def render(self):
        try:
            return render_template('layout.html', header=self.header.render(),
                               promo=self.promo.render(),
                               content=self.content.render(),
                               footer=self.footer.render())
        except:
            return render_template('layout.html', header=Header().render(),
                                                  promo=render_template('dev.html'),
                                                  footer=Footer(None).render())
