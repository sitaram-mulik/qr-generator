import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import iconUrl from './location.svg';

const Map = ({ locations = [], centerLocation }) => {
  if (!locations.length) return null;
  const { lat, lng } = centerLocation || locations[0];

  const customIcon = new L.Icon({
    iconUrl,
    iconSize: new L.Point(40, 47)
  });

  return (
    locations[0] && (
      <MapContainer
        style={{ height: '500px', minWidth: '300px', width: '100%' }}
        center={[lat, lng]}
        zoom={2}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup>
          {locations.map((loc, i) => (
            <Marker icon={customIcon} key={i} position={[loc.lat, loc.lng]}></Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    )
  );
};

export default Map;
