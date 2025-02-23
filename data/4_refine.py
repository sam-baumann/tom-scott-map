import pandas as pd
import json
from dotenv import load_dotenv
from os import getenv
import requests

#get the data
df = pd.read_csv("./data/3_geocoded.csv", index_col=0)

#first, remove the description column, not needed for web display
df = df.drop(columns=["description"])

#pull 3 selected playlists (things you might not know, amazing places, built for science), add a column to describe 
playlists = {
    "bfs": "PL96C35uN7xGKyF2QKy4NF6ybamx4nQswv", #built for science
    "tymnk": "PL96C35uN7xGI9HGKHsArwxiOejecVyNem", #things you might not know
    "ap": "PL96C35uN7xGK_y459BdHCtGeftqs5_nff" #amazing places
}


load_dotenv("./data/.env")

API_KEY = getenv("API_KEY")

URL = "https://www.googleapis.com/youtube/v3/playlistItems"

params = {
    "key": API_KEY,
    "part": "snippet",
    "maxResults": 50
}

playlist_matches = {}

for playlist in playlists.items():
    next_token = None
    playlist_name = playlist[0]
    playlist_id = playlist[1]
    while(True):
        this_request_params = params | {"playlistId": playlist_id}
        if next_token is not None:
            this_request_params |= {"pageToken": next_token}

        resp = requests.get(URL, this_request_params)
    
        if resp.status_code != 200:
            print(resp.text)
            print(f"ERROR, status code: {resp.status_code}")
            exit()

        resp = resp.json()

        next_token = resp.get("nextPageToken", None)

        for video in resp["items"]:
            playlist_matches[video["snippet"]["resourceId"]["videoId"]] = playlist_name
            
        
        if next_token is None:
            break
    
#match all videos found in playlists with their 
df["playlist"] = df["videoId"].apply(lambda x: playlist_matches.get(x, None))

#remove all videos not in these playlists
df = df.dropna(subset=["playlist"])

#now, take all the geoJson elements and just extract the x and y to reduce json payload size
def get_coords(geojson):
    try:
        geojson = json.loads(geojson)
        geojson = geojson["features"][0]["geometry"]["coordinates"]
        #geojson stores lng,lat, while leaflet expects lat,lng
        geojson[0], geojson[1] = geojson[1], geojson[0]
        return geojson
    except:
        pass

df["geocode"] = df["geocode"].apply(get_coords)

#add a 'marked' field to show when the data has been hand checked
df["marked"] = False

df.to_json("./data/4_refined.json", orient="records")
#the exported CSV does not automatically format csv correctly so convert it to string first
df["geocode"] = df["geocode"].apply(json.dumps)
df.to_csv("./data/4_refined.csv")