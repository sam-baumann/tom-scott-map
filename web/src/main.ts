import L from "leaflet"
import 'leaflet/dist/leaflet.css'
import './style.css'

const map = L.map('map').setView([35.954956, -83.925376], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
