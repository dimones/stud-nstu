from flask import Flask , render_template

app = Flask(__name__)

@app.route('/culture')
def culture():
    return render_template("culture.html")

@app.route('/garage')
def hello_world():
    return render_template("garage.html")

@app.route('/')
def hello_world_1():
    return render_template("onir.html")


if __name__ == '__main__':
    app.run(debug=True)
