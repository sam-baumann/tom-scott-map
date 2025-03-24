# Map of Tom Scott videos

### [View the map here](https://sambaumann.com/tom-scott-map)

Interactive map to explore locations documented by creator [Tom Scott](https://www.youtube.com/channel/UCBa659QWEk1AI4Tg--mrJ2A)

Notice anything off? Issues and PRs welcome!

### Data Pipeline
Youtube API: extract video names and descriptions -> GPT-4o-mini: extract place names from video -> Nominatim API: Geocoding -> Leaflet: Display places
