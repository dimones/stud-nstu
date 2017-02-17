from flask import Flask, render_template

app = Flask(__name__)

class Main:
    promo=None
    main=None



class Page:
    request = None
    body = None
    scripts = None
    def __init__(self, body = None):
        self.body = body
    def __str__(self):
        return self.render()
    def render(self):
        login_block = None
        return render_template('layout.html', header=render_template('header.html', LOGIN_PLACE=login_block.render()),
                        body=self.body,
                        footer=render_template('footer.html'))




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

if __name__ == '__main__':
    app.run(debug=True)
