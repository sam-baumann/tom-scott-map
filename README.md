# Map of all Tom Scott videos

As of right now, limited to videos in the playlists "Things You Might Not Know", "Amazing Places", and "Built for Science"

### Data Pipeline
Youtube API: extract video names and descriptions -> GPT-4o-mini: extract place names from video -> Nominatim API: Geocoding -> Leaflet: Display places

### Todods
 -[ ] Remove description from web JSON file
 -[ ] Pre-parse geocoding JSON in web file