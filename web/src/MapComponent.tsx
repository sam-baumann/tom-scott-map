import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import data from './data/3_geocoded.json';
import { FeatureCollection } from 'geojson';
// https://willschenk.com/labnotes/2024/leaflet_markers_with_vite_build/
import markerIconUrl from "leaflet/dist/images/marker-icon.png"
import markerIconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

// https://willschenk.com/labnotes/2024/leaflet_markers_with_vite_build/
L.Icon.Default.prototype.options.iconUrl = markerIconUrl;
L.Icon.Default.prototype.options.iconRetinaUrl = markerIconRetinaUrl;
L.Icon.Default.prototype.options.shadowUrl = markerShadowUrl;
L.Icon.Default.imagePath = ""

const MapComponent: React.FC = () => {
    useEffect(() => {
        const map = L.map('map').setView([51.1358, 1.3621], 5);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        data.forEach(element => {
            if (element.geocode) {
                let locationCollection = element.geocode as unknown as FeatureCollection
                let location = locationCollection.features[0]
                L.geoJSON(location)
                    .bindPopup(
                        `<iframe width="560" height="315" src="https://www.youtube.com/embed/${element.videoId}" allowfullscreen></iframe>`,
                        { minWidth: 560 }
                    )
                    .addTo(map);
            }
        });

        return () => {
            map.remove();
        };
    }, []);

    return <div id="map" style={{ height: '100vh' }}></div>;
};

export default MapComponent;
