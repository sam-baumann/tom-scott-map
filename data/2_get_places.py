# %%
import pandas as pd

# %%
df = pd.read_csv("./data.csv", index_col=0)
df

# %%
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI()

# %%
def get_location(row):
    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "given a video description and title, give the location that the video was filmed.\
              If it's not extremely clear, say \"no location found\" all lowercase with no punctuation. \
             get as specific of a location as possible with the given inputs. \
                Especially if there is a bulilding named in the description, this should be the response.\
             Ideally, output should be formatted 'location, city, state, country' if applicable. If not applicable, just skip"},
            {
                "role": "user",
                "content": f'title: "{row["title"]}", description:"{row["description"]}"'
            }
        ]
    )

    return completion.choices[0].message.content

responses = df.apply(get_location, axis=1)

# %%
df["location"] = responses

# %%
df.to_csv("./data_with_loc.csv")


