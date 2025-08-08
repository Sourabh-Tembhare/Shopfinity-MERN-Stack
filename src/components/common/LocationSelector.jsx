import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const LocationSelector = ({ onChange }) => {
  const [position, setPosition] = useState(null);
  const [manualAddress, setManualAddress] = useState('');

  // Fetch user location on first render
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setPosition(coords);
        reverseGeocode(coords[0], coords[1]);
      },
      (err) => {
        console.error("Geolocation error:", err);
        // fallback to India's center
        setPosition([20.5937, 78.9629]);
      }
    );
  }, []);

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      onChange({ lat, lng, address: data.display_name || '' });
    } catch (err) {
      console.error("Reverse geocode failed", err);
      onChange({ lat, lng, address: '' });
    }
  };

  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        reverseGeocode(lat, lng);
        setManualAddress('');
      },
    });

    // fly to position if user location is fetched
    useEffect(() => {
      if (position) {
        map.flyTo(position, 13);
      }
    }, [position]);

    return position ? <Marker position={position} /> : null;
  };

  const handleManualChange = (e) => {
    const value = e.target.value;
    setManualAddress(value);
    onChange({ lat: null, lng: null, address: value });
  };

  return (
    <div className="space-y-4 z-10">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select location on map:<sup className='text-pink-400'>*</sup></label>
        {position && (
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={true}
            className="h-72 w-full rounded-lg border border-gray-300"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <LocationMarker />
          </MapContainer>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Or enter address manually:</label>
        <input
          type="text"
          value={manualAddress}
          onChange={handleManualChange}
          placeholder="Type your store location"
          className="bg-richblack-700 outline-none border-b-[1px] border-richblack-5 p-2 rounded-md w-full"
        />
      </div>
    </div>
  );
};

export default LocationSelector;
