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
