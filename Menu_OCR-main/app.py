from flask import Flask, request, jsonify, send_from_directory
import ocr_recognition
import json
import os

app = Flask(__name__)

# 영양 정보
file_path = os.path.join(os.path.dirname(__file__), 'nutrition_info.json')
with open(file_path, encoding='utf-8') as f:
    nutrition_info = json.load(f)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/get_nutrition', methods=['POST'])
def get_nutrition():
    file = request.files['image']
    filename = 'temp.jpg'
    file.save(filename)
    menu_items = ocr_recognition.process_image(filename)

    results = {}
    for item in menu_items:
        item = item.strip()
        if item:
            info = nutrition_info.get(item, "데이터가 없는 음식 입니다.")
            results[item] = info

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)

