from flask import render_template
from API import *
class Header:
    nav=None
    def __init__(self):
        self.nav = DB().selectFromDB("""SELECT * FROM "sites" WHERE sub=0 ORDER BY site_order ASC """, needDict=True)
    def render(self):
        return render_template('header.html', nav=self.nav)
class Footer:
    footer = None
    def __init__(self,site):
        if site==None:
            self.footer = "index/footer.html"
        else:
            self.footer = "footer.html"
    def render(self):
        return render_template(self.footer)

class Promo:
    promos = None
    def __init__(self, info):
        self.promos = info

    def render(self):
        if len(self.promos) > 1:
            result = ""
            for promo in self.promos:
                result += render_template("promos/" + promo['template_name'])
            return result
        else:
            return render_template("promos/" + self.promos[0]['template_name'])

class Content:
    sidebar = None
    content = None
    isContent = None
    template = None
    def __init__(self, site_info=None, page=None, material=None):
        self.template = site_info
        self.sidebar = Sidebar(site_info['id'], site_info['site_type'])
        self.content = Main(site_info['site_type'], page, material)
        self.template = admin_sites_template_get(3)

    def render(self):
        return render_template('content.html', sidebar=self.sidebar.render(),
                               posts=self.content.render())

class Main:
    posts = None
    template = None
    def __init__(self, site_type=None, main=None, material=None):
        self.template = pages_template_get(site_type)
        if main == None:
            pass
        else:
            if material == None:
                self.posts = DB().selectFromDB("""SELECT * FROM  pages WHERE sidebar_id=%s""" % main)
                print(self.posts)
            else:
                self.posts = DB().selectFromDB("""SELECT * FROM  pages WHERE id=%s""" % material)
    def render(self):
        if self.posts != None:
            print("pages/"+self.template)
            return render_template("pages/"+self.template, pages=self.posts, base_url=request.path)
        else:
            return

class Sidebar:
    menu = None
    news = None
    site = None
    def __init__(self, site, site_type):
        self.menu = Side_menu(site, site_type)
        self.news = Side_news()
        self.site = site

    def render(self):
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
    def __init__(self, site=None, site_type=None):
        if site == None:
            pass
        elif site_type == 3:
            self.menu = json.loads(sidebar_menu_get_dict(site))
        elif site_type == 4 or site_type == 5:
            self.menu = json.loads(sites_get_tree())
    def render(self):
        if self.menu == None:
            return
        else:
            return render_template("sidenav.html", sidebar=self.menu)

class Side_news(Side_item):
    news = None

    def __init__(self):
        self.news =DB().selectFromDB("""SELECT * FROM "NEWS" WHERE in_top=1 LIMIT 2""")

    def render(self):
        pass

class Side_cal(Side_item):
    pass

class Page:
    header = None
    promo = None
    content = None
    footer = None
    site_info = None
    def __init__(self, site = None, sidebar = None, material = None):
        self.site_info = json.loads(admin_sites_get(site))[0]
        self.header = Header()
        self.footer = Footer(site)
        if self.site_info['site_type'] == 8:
            self.promo = Promo(json.loads(admin_sites_get_sub(site)))
        else:
            self.promo = Promo([self.site_info])
            if sidebar ==  None:
                self.content = Content(self.site_info, self.site_info['default_sidebar'])
            else:
                self.content = Content(self.site_info, sidebar, material)

    def __str__(self):
        return self.render()

    def render(self):
        try:
            if self.site_info['site_type'] == 8:
                return render_template('layout.html',
                                        header=self.header.render(),
                                        promo =self.promo.render(),
                                        footer=self.footer.render())
            else:
                return render_template('layout.html',
                                        header=self.header.render(),
                                        promo =self.promo.render(),
                                        content=self.content.render(),
                                        footer=self.footer.render())
        except:
            return render_template('layout.html', header=Header().render(),
                                                  promo=render_template('dev.html'),
                                                  footer=Footer(None).render())
