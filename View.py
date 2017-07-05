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
    content = None
    isContent=None
    def __init__(self, site, page, material):
        self.isContent=(DB().selectFromDB("""SELECT editable FROM sites WHERE id=%s""" % site)[0]['editable'])
        if self.isContent == 1:
            self.sidebar = Sidebar(site)
            self.content = Main(page, material)
    def render(self):
        if self.isContent == 1:
            return render_template('content.html', sidebar=self.sidebar.render(),
                               posts=self.content.render())

class Main:
    posts=None
    def __init__(self, main=None, material=None):
        if main == None:
            pass
        else:
            if material ==None:
                self.posts = DB().selectFromDB("""SELECT * FROM  pages WHERE sidebar_id=%s""" % main)
            else:
                self.posts= DB().selectFromDB("""SELECT * FROM  pages WHERE id=%s""" % material)
    def render(self):
        if self.posts!=None:
            return render_template("conf_template.html", pages=self.posts, base_url=request.path)
        else:
            return

class Sidebar:
    menu=None
    news=None
    site=None
    def __init__(self, site):
        self.menu=Side_menu(site)
        self.news=Side_news()
        self.site=site
    def render(self):
        print(self.menu)
        return render_template("sidenav.html",site=self.site,
                               sidebar=self.menu.menu,
                               news=self.news.news)


class Side_item:
    def __init__(self, site):
        self.site_items.append(Side_menu(site))

    def render(self, item):
        pass


class Side_menu(Side_item):
    menu = None
    def __init__(self, site=None):
        if site == None:
            pass
        else:
            self.menu = json.loads(sidebar_menu_get_dict(site))
    def render(self):
        if self.menu == None:
            return
        else:
            return render_template("sidenav.html", sidebar=self.menu)

class Side_news(Side_item):
    news=None
    def __init__(self):
        self.news =DB().selectFromDB("""SELECT * FROM "NEWS" WHERE in_top=1 LIMIT 2""")
    def render(self):
        pass

class Side_cal(Side_item):
    pass

class Page:
    header=None
    promo = None
    content = None
    footer=None
    def __init__(self, site = None, page = None, material = None):
        print (site, page, material)
        if page == None:
            page = (json.loads(get_sidebar(_id=site)))['sidebar_id']
            print (page)
        self.header = Header()
        self.promo = Promo(site)
        self.content = Content(site, page, material)
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
