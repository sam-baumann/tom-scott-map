# Map of all Tom Scott videos

As of right now, limited to videos in the playlists "Things You Might Not Know", "Amazing Places", and "Built for Science"

### Data Pipeline
Youtube API: extract video names and descriptions -> GPT-4o-mini: extract place names from video -> Nominatim API: Geocoding -> Leaflet: Display places

### Todos
 - [x] Remove description from web JSON file
 - [x] Pre-parse geocoding JSON in web file
 - [ ] Create type definition for data file
 - [ ] Lift state up to main component
 - [ ] If filtering data in the sidebar, also filter the options shown in the display
 - [ ] Change marker image/color for each playlist
 - [ ] Canter frame when video is clicked
 - [ ] Manual check of all videos (1/2 done)
 - [ ] Add text search filter
