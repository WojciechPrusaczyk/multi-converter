#!/bin/bash

# Ścieżki
BACKEND_DIR="./backend"
FRONTEND_DIR="./frontend"
VENV_DIR="./venv"
BUILD_DIR="$FRONTEND_DIR/build"

# Wyłącz zmienną HOST (psuje React Dev Server)
unset HOST

# 1. Tworzymy virtualenv jeśli nie istnieje
if [ ! -d "$VENV_DIR" ]; then
    echo ">>> Tworzę virtualenv..."
    python3.13 -m venv venv
fi

# 2. Instalujemy zależności backendu
echo ">>> Instaluję zależności backendu..."
source venv/bin/activate
pip install -r $BACKEND_DIR/requirements.txt

# 3. Instalujemy paczki frontendu jeśli node_modules brak
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo ">>> Instaluję paczki frontendu..."
    cd $FRONTEND_DIR
    npm install
    cd ..
fi

# 4. Budujemy frontend (React -> statyczne pliki)
echo ">>> Buduję frontend (React)..."
cd $FRONTEND_DIR
npm run build
cd ..

# 5. Serwujemy frontend przez Flask (jeden serwer na porcie 5000)
echo ">>> Uruchamiam aplikację (Flask + frontend na porcie 5000)..."

# Ustawiamy zmienną środowiskową, by Flask wiedział gdzie są pliki Reacta
export REACT_BUILD_PATH=$(realpath $BUILD_DIR)

# Tworzymy plik app_static.py (serwuje frontend)
cat > $BACKEND_DIR/app_static.py <<'EOF'
from flask import Flask, send_from_directory, request, send_file, jsonify
import os, tempfile
from converters import convert_image, convert_video
from flask_cors import CORS

app = Flask(__name__, static_folder=os.environ.get("REACT_BUILD_PATH"), static_url_path="/")
CORS(app)

FORMATS = {
    "image": ["jpg", "png", "gif", "webp"],
    "video": ["mp4", "avi", "mov", "webm"]
}

@app.route('/formats')
def get_formats():
    file_type = request.args.get("type", "image")
    return jsonify(FORMATS.get(file_type, []))

@app.route('/convert', methods=['POST'])
def convert():
    file = request.files['file']
    target_format = request.form['format']
    file_type = request.form['type']

    with tempfile.NamedTemporaryFile(delete=False) as tmp_in:
        file.save(tmp_in.name)
        tmp_out = tmp_in.name + f".{target_format}"

        if file_type == 'image':
            convert_image(tmp_in.name, tmp_out)
        else:
            convert_video(tmp_in.name, tmp_out)

        return send_file(tmp_out, as_attachment=True)

# Serwowanie plików Reacta
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    root_dir = app.static_folder
    if path != "" and os.path.exists(os.path.join(root_dir, path)):
        return send_from_directory(root_dir, path)
    else:
        return send_from_directory(root_dir, "index.html")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
EOF

# 6. Uruchamiamy finalny serwer
cd $BACKEND_DIR
source ../venv/bin/activate
python app_static.py