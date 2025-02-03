import pandas as pd
import json

#get the data
df = pd.read_csv("./data/3_geocoded.csv", index_col=0)

#first, remove the description column, not needed for web display
df = df.drop(columns=["description"])

df["geocode"].apply(json.loads)

print(df)