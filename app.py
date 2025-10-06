from flask import Flask
app = Flask(__name__)

@app.route('/')
def home():
    return "🚀 Successfully deployed the app via Jenkins + ArgoCD!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)