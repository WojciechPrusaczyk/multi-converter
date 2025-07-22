from flask import Flask, request, send_file, jsonify
import tempfile
from converters import convert_image, convert_video
from flask_cors import CORS

app = Flask(__name__)
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)