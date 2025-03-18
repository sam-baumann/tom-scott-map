import json

# Load the JSON data
with open('./web/src/data/data_new.json') as f:
    data = json.load(f)

def validate_video_data(data):
    valid_data = []
    invalid_data = []

    for index, item in enumerate(data):
        if (
            isinstance(item.get('publishedAt'), str) and
            isinstance(item.get('title'), str) and
            isinstance(item.get('videoId'), str) and
            isinstance(item.get('location'), str) and
            (
                (isinstance(item.get('geocode'), list) and
                 (len(item['geocode']) == 0 or
                  (len(item['geocode']) == 2 and
                   isinstance(item['geocode'][0], (int, float)) and
                   isinstance(item['geocode'][1], (int, float)))
                 )
                ) or item.get('geocode') is None
            ) and
            item.get('playlist') in ["ap", "tymnk", "bfs"] and
            isinstance(item.get('marked'), bool)
        ):
            valid_data.append(item)
        else:
            invalid_data.append((index, item))

    return valid_data, invalid_data

valid_data, invalid_data = validate_video_data(data)

# Print invalid data
for index, item in invalid_data:
    print(f'Invalid item at index {index}: {item}')