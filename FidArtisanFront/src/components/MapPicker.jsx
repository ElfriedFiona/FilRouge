import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    return data.display_name || `${lat}, ${lng}`;
  } catch (err) {
    console.error('Erreur reverse geocode:', err);
    return `${lat}, ${lng}`;
  }
};

const LocationMarker = ({ onSelect }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      const adresse = await reverseGeocode(lat, lng);
      onSelect(adresse);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const RecenterButton = ({ onRecenter }) => (
  <button
    onClick={onRecenter}
    className="absolute top-2 right-2 bg-white border shadow px-3 py-1 rounded text-sm hover:bg-gray-100 z-[1000]"
  >
    📍 Recentrer
  </button>
);

const MapPicker = ({ onSelect }) => {
  const [mapCenter, setMapCenter] = useState([4.0511, 9.7679]); // Douala par défaut
  const mapRef = useRef(null);

  const recenterToUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const newCenter = [latitude, longitude];
          setMapCenter(newCenter);
          if (mapRef.current) {
            mapRef.current.setView(newCenter, 13);
          }
        },
        (err) => {
          console.warn('Erreur géolocalisation:', err);
        }
      );
    }
  };

  useEffect(() => {
    recenterToUserLocation();
  }, []);

  return (
    <div className="mt-4 relative">
      <p className="mb-2 text-sm text-gray-600">Cliquez sur la carte pour choisir une adresse</p>
      <RecenterButton onRecenter={recenterToUserLocation} />
      <MapContainer
        center={mapCenter}
        zoom={13}
        className="h-64 rounded shadow"
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <LocationMarker onSelect={onSelect} />
      </MapContainer>
    </div>
  );
};

export default MapPicker;
