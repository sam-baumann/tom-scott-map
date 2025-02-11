import L from "leaflet"
import 'leaflet/dist/leaflet.css'
import './style.css'
import data from './data/3_geocoded.json'
import { FeatureCollection } from "geojson"
// https://willschenk.com/labnotes/2024/leaflet_markers_with_vite_build/
import markerIconUrl from "leaflet/dist/images/marker-icon.png"
import markerIconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

const map = L.map('map').setView([51.13579773276985, 1.3620947694621373], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// https://willschenk.com/labnotes/2024/leaflet_markers_with_vite_build/
L.Icon.Default.prototype.options.iconUrl = markerIconUrl;
L.Icon.Default.prototype.options.iconRetinaUrl = markerIconRetinaUrl;
L.Icon.Default.prototype.options.shadowUrl = markerShadowUrl;
L.Icon.Default.imagePath = ""

data.forEach(element => {
  if (element.geocode) {
    // there seems to be an issue where the bbox could be interpreted as wrong, so cast to unknown first
    let location_collection = element.geocode as unknown as FeatureCollection;

    //grab the first element from the feature collection as this is our best match
    let location = location_collection.features[0]

    L.geoJSON(location)
      .bindPopup(() => {
        return element.title + '<br>' + `<iframe width="560" height="315" src="https://www.youtube.com/embed/${element.videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`

      }, {
        minWidth: 560
      }).addTo(map)
  } 
});