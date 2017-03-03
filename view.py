from flask import render_template
class header:
    def render(self):
        return render_template('header.html')

class footer:
    def render(self):
        return render_template('footer.html')

class promo:
    adress = None
    def __init__(self, adress):
        self.adress = adress
    def render(self):
        return render_template(self.adress)

class content:
    sidebar = None
    posts = []
    def __init__(self, sidebar = None, posts = None):
        self.sidebar = sidebar
        # print(posts)
        self.posts = [posts]
        # self.posts.append(posts)
    def render(self):
        return render_template('content.html', posts=self.posts)

class main:
    def render(self):
        pass

class sidebar:
    side_items=[]
    def render(self):
        pass

class side_item:
    def render(self):
        pass

class side_menu(side_item):
    pass

class side_news(side_item):
    pass

class side_cal(side_item):
    pass

class Page:
    promo = None
    content = None
    def __init__(self, promo = None, content = None):
        self.promo = promo
        self.content = content
    def __str__(self):
        return self.render()
    def render(self):
        return render_template('layout.html', header=header().render(),
                               promo=self.promo.render(),
                               content=self.content.render(),
                               footer=footer().render())
