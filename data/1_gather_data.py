from dotenv import load_dotenv
from os import getenv
import requests
import pandas as pd

load_dotenv("./data/.env")

API_KEY = getenv("API_KEY")

handle = "TomScottGo"

API = "https://www.googleapis.com/youtube/v3"

# get 'uploads' playlist ID
resp = requests.get(API+"/channels", params={"key":API_KEY, "forHandle":handle, "part": "contentDetails"})
if resp.status_code != 200:
    print(f'Something went wrong! Response code {resp.status_code}, check content: {resp.json()}')
    exit()

playlist_id = resp.json()["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"] 

max_iter = 5

params = {
    "key": API_KEY,
    "playlistId": playlist_id,
    "part": "snippet"
}

keyItems = ["publishedAt", "title", "description", "videoId"]

rows = []

for i in range(max_iter):

    resp = requests.get(API+"/playlistItems", params=params)
    if resp.status_code != 200:
        print(f'Check response: {resp.status_code}, {resp.json()}')
        exit()

    resp = resp.json()

    for item in resp["items"]:
        item["snippet"]["videoId"] = item["snippet"]["resourceId"]["videoId"]
        rows.append({x: item["snippet"][x] for x in keyItems})

    if resp.get("nextPageToken", None) != None:
        params["pageToken"] = resp["nextPageToken"]
    else:
        break
    print(len(rows))


export = pd.DataFrame(rows, columns=keyItems)
export.to_csv("./data/data.csv")