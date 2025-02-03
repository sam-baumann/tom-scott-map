import L from "leaflet"
import 'leaflet/dist/leaflet.css'
import './style.css'
import data from './data/3_geocoded.json'
import { FeatureCollection } from "geojson"

const map = L.map('map').setView([51.13579773276985, 1.3620947694621373], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

data.forEach(element => {
  if (element.geocode) {
    // there seems to be an issue where the bbox could be interpreted as wrong, so cast to unknown first
    let location = element.geocode as unknown as FeatureCollection;
    L.geoJSON(location)
      .bindPopup(() => {
        return element.title + '<br>' + `<iframe width="560" height="315" src="https://www.youtube.com/embed/${element.videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`

      }, {
        minWidth: 560
      }).addTo(map)
  } 
});