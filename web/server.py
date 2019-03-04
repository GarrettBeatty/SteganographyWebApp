import base64
import io
import json

from PIL import Image
from flask import Flask, Response
from flask import render_template
from flask import request

from steganography.message import Message
from steganography.source import Source
from steganography.steganography import Steganography

app = Flask(__name__)

if __name__ == ' __main__':
    app.debug = True
    app.run(host='0.0.0.0')

def get_base_64_str(image):
    in_mem_file = io.BytesIO()
    image.save(in_mem_file, format="PNG")
    # reset file pointer to start
    in_mem_file.seek(0)
    img_bytes = in_mem_file.read()

    base64_encoded_result_bytes = base64.b64encode(img_bytes)
    data = base64_encoded_result_bytes.decode('ascii')
    return data


@app.route('/encode', methods=['POST'])
def encode():
    source_image = request.files.get('source')
    m = request.files.get('message')
    bit_split = int(request.form['bitsplit'])

    if not source_image or not m or not bit_split:
        return Response(response=json.dumps(obj='Source and Message not uploaded.'), status=400,
                        mimetype='application/json')

    try:
        source = Source(source_image, source_type='image')
        try:
            message = Message(m, message_type='image')
        except:
            message = Message(m, message_type='text_stream')

        encoded = Steganography.encode(source, message, bit_split)
        image_encoded = Image.fromarray(encoded)
        data = {'message': get_base_64_str(image_encoded)}
        resp = Response(response=json.dumps(data), status=200, mimetype='application/json')
        return resp

    except Exception as e:
        data = str(e)
        resp = Response(response=json.dumps(data), status=400, mimetype='application/json')
        return resp


@app.route('/decode', methods=['POST'])
def decode():
    source_image = request.files.get('source')
    if source_image:
        source = Source(source_image, source_type='image')
        message, message_type, extras = Steganography.decode(source)
        message = Message.convert_to_type(message, message_type, extras)

        if message_type == 'image':
            data = {'message': get_base_64_str(message), 'secret_type':message_type}
        else:
            data = {'message': message, 'secret_type':message_type}
        resp = Response(response=json.dumps(data), status=200, mimetype='application/json')
        return resp
    return Response(response=json.dumps(obj='Source not uploaded'), status=400, mimetype='application/json')


@app.route('/')
def index():
    return render_template('index.html')
