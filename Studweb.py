from flask import Flask , render_template

app = Flask(__name__)

@app.route('/culture')
def culture():
    return render_template("culture.html")
@app.route('/map')
def map():
    return render_template("map.html")
@app.route('/map_inner.html')
def map_inner_html():
    return render_template("map_inner.html")
@app.route('/garage')
def hello_world():
    return render_template("garage.html")

@app.route('/')
def hello_world_1():
    return render_template("onir.html")


if __name__ == '__main__':
    app.run(debug=True)
