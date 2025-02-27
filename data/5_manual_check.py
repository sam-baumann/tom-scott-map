from flask import Flask, request, jsonify
from threading import Thread, Event
from flask_cors import CORS
import json
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG)
logging.getLogger('flask-cors').level = logging.DEBUG
CORS(app)

new_video_event = Event()
new_video_id = ""

map_click_event = Event()
map_click_coords = []

@app.route('/api/', methods=["POST"])
def home():
    global new_video_id
    video_id = request.args.get('video_id')
    if not video_id:
        return jsonify({"error": "No video_id provided"}), 400
    new_video_id = video_id
    new_video_event.set()
    return jsonify({"message": "looks good"})

@app.route('/api/coords')
def coords():
    global map_click_coords
    lat = request.args.get('lat')
    lng = request.args.get('lng')
    map_click_coords = [lat, lng]
    map_click_event.set()
    return jsonify({"message": "looks good"})

def run_flask_app():
    app.run(debug=True, use_reloader=False, port=5001)

if __name__ == '__main__':
    Thread(target=run_flask_app).start()
    while True:
        new_video_event.wait()
        new_video_event.clear()
        with open("./web/src/data/data.json", 'r') as file:
            data = json.load(file)
        #first, search for this element in the list and find its index
        item_index = -1
        for i, video in enumerate(data):
            if video.get("videoId", None) == new_video_id:
                item_index = i
                break
        if item_index == -1:
            print('no video found with this id')
            continue
        user_input = input("looks good? (Y/N): ")
        if user_input.strip().upper() != 'Y':
            print(f'https://youtube.com/watch?v={new_video_id}')
            user_input = input("Find on map, enter coords, or plus code? (M/C/P)")
            if user_input.strip().upper() == 'M':
                map_click_event.clear()
                map_click_event.wait()
                map_click_event.clear()
            else:
                user_input = input("Enter coords: ")
                map_click_coords = [float(x) for x in user_input.split(',')]
            data[item_index]["geocode"] = map_click_coords
        with open("./web/src/data/data.json", 'w') as file:
            json.dump(data, file)

        user_input = input("looks good now?: ")
        if user_input.strip().upper() == 'Y':
            data[item_index]["marked"] = True
            with open("./web/src/data/data.json", 'w') as file:
                json.dump(data, file)


            
