import { useEffect, useRef } from 'react';
import L, { Marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
// https://willschenk.com/labnotes/2024/leaflet_markers_with_vite_build/
import markerIconUrl from "leaflet/dist/images/marker-icon.png"
import markerIconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";
import { VideoInfo } from './App';

// https://willschenk.com/labnotes/2024/leaflet_markers_with_vite_build/
L.Icon.Default.prototype.options.iconUrl = markerIconUrl;
L.Icon.Default.prototype.options.iconRetinaUrl = markerIconRetinaUrl;
L.Icon.Default.prototype.options.shadowUrl = markerShadowUrl;
L.Icon.Default.imagePath = ""

const MapComponent = ({ data, activeVideo, setActiveVideo }: { data: VideoInfo[], activeVideo: string, setActiveVideo: (video: string) => void }) => {
    //store a map of video ids to marker elements,
    const markersRef = useRef<Map<string, Marker>>(new Map());
    const mapRef = useRef<L.Map>(null);
    const markerLayerRef = useRef<L.LayerGroup>(null)

    useEffect(() => {
        const map = L.map('map').setView([51.1358, 1.3621], 5);
        mapRef.current = map

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        let markerLayer = L.layerGroup().addTo(map)
        markerLayerRef.current = markerLayer

        return () => {
            map.remove();
        };
    }, []);

    useEffect(() => {
        let currentPopup = markersRef.current.get(activeVideo)
        if (currentPopup) {
            mapRef.current?.panTo(currentPopup.getLatLng())
            currentPopup.openPopup();
        }
    }, [activeVideo])

    useEffect(() => {
        markerLayerRef.current?.clearLayers();
        markersRef.current = new Map<string, Marker>();

        data.forEach(element => {
            if (element.geocode && element.geocode.length == 2) {
                const coords = element.geocode
                const marker = L.marker(coords)
                    .bindPopup(
                        `<iframe width="560" height="315" src="https://www.youtube.com/embed/${element.videoId}" allowfullscreen></iframe>`,
                        { minWidth: 560 }
                    )

                markerLayerRef.current?.addLayer(marker);

                marker.on("click", () => {
                    setActiveVideo(element.videoId)
                })

                markersRef.current.set(element.videoId, marker)
            }
        });

    }, [data])

    return <div id="map" style={{ height: '100vh' }}></div>;
};

export default MapComponent;
