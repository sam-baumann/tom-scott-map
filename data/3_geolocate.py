import pandas as pd
import requests
import json

df = pd.read_csv("./data/data_with_loc.csv", index_col=0)

header = {
    "User-Agent": "Scott-Map/0.0 (sam.k.baumann@gmail.com)"
}

API = "https://nominatim.openstreetmap.org/search"

i = 0

def geocode(row):
    global i
    i += 1
    print(i, end='\r')
    if row["location"] == "no location found":
        return None
    resp = requests.get(API, params={"format": "geojson", "q": row["location"]}, headers=header)
    if resp.status_code == 200:
        return resp.json()
    else:
        return None

#only apply to the first 20, remove this when not testing
df = df.head(20)
df["geocode"] = df.apply(geocode, axis=1)
df.to_csv("./data/3_geocoded.csv")
df["geocode"].apply(json.dumps)
df.to_json("./data/3_geocoded.json", orient="records")