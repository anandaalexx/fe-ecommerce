import React, { useEffect, useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { useMap } from "react-leaflet"; // <- import useMap
import L from "leaflet";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const RecenterAutomatically = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lon], map.getZoom());
    }
  }, [position, map]);

  return null;
};

const MapPicker = ({ initialPosition, onLocationChange }) => {
  const [position, setPosition] = useState(initialPosition);
  const markerRef = useRef(null);

  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);

      if (markerRef.current) {
        markerRef.current.setLatLng([initialPosition.lat, initialPosition.lon]);
      }
    }
  }, [initialPosition]);

  const handleMapClick = (e) => {
    const coords = { lat: e.latlng.lat, lon: e.latlng.lng };
    setPosition(coords);
    onLocationChange(coords);
  };

  return (
    <MapContainer
      center={[position.lat, position.lon]}
      zoom={15}
      style={{ height: "400px" }}
      onClick={handleMapClick}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker
        position={[position.lat, position.lon]}
        draggable={true}
        eventHandlers={{
          dragend: (event) => {
            const marker = event.target;
            const newPos = marker.getLatLng();
            const coords = { lat: newPos.lat, lon: newPos.lng };
            setPosition(coords);
            onLocationChange(coords);

            // Tambahkan log di sini  
            console.log("Marker moved to:", coords.lat, coords.lon);
          },
        }}
        ref={markerRef}
      />

      {/* Komponen khusus untuk pindahkan view peta */}
      <RecenterAutomatically position={position} />
    </MapContainer>
  );
};

export default MapPicker;
