from flask import Flask, render_template , request , jsonify

app = Flask(__name__)

@app.route('/')
def root():
	return "<font face='comic sans ms'><center><br><br><h1>File Tracking System</h1><br><h3>Project currently under development!</h3><img src='https://i.pinimg.com/originals/ef/03/f8/ef03f898ffa6f5eac9a37622cd73cd4b.gif'>"

@app.route('/home')
def home():
	return render_template('index.jinja2')


if __name__ == '__main__':
	app.run(debug = True)