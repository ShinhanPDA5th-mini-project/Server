from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import requests
from io import BytesIO
from PIL import Image, ImageEnhance
import pillow_heif 

pillow_heif.register_heif_opener()

app = Flask(__name__)
CORS(app)

def preprocess_image_from_url(img_url):
    try:
        response = requests.get(img_url)
        response.raise_for_status()
        img = Image.open(BytesIO(response.content))
        img = img.convert("RGB")
        
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(2.5)
        enhancer = ImageEnhance.Sharpness(img)
        img = enhancer.enhance(2.5)

        img = img.resize((224, 224))
        return img
    except Exception as e:
        print(f"Error processing image from URL: {img_url} - {e}")
        raise

def calculate_pixel_difference(before_img_url, after_img_url):
    img1 = preprocess_image_from_url(before_img_url)
    img2 = preprocess_image_from_url(after_img_url)

    diff = np.abs(np.array(img1) - np.array(img2))
    avg_diff = np.mean(diff)

    threshold = 1 
    return avg_diff > threshold

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    before_photo_url = data['beforePhotoUrl']
    after_photo_url = data['afterPhotoUrl']
    
    is_completed = bool(calculate_pixel_difference(before_photo_url, after_photo_url))
    return jsonify({"isCompleted": is_completed})

if __name__ == '__main__':
    app.run(port=5000)
