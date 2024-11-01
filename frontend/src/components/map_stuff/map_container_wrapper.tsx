import { MapContainer, TileLayer } from 'react-leaflet';
import { useRef } from 'react';
import { useMapService } from '../../services/map_service';
import { MapViewMonitor } from '../map_stuff/map_view_monitor';
import { MapExistingSpotsMonitor } from '../map_stuff/map_existing_spots_monitor';
import { Spot } from 'ww-3-models-tjb';
import { LatLng } from 'leaflet';

export interface MapContainerWrapperProps {
  children: React.ReactNode;
  setExistingSpots: (existingSpots: Spot[]) => void;
  toggleToRefreshExistingSpots: boolean;
}

export const MapContainerWrapper = ({
  children,
  setExistingSpots,
  toggleToRefreshExistingSpots,
}: MapContainerWrapperProps) => {
  const mapRef = useRef(null);
  const mapService = useMapService();

  return (
    <MapContainer
      center={new LatLng(mapService.getCenterLat(), mapService.getCenterLng())}
      zoom={mapService.getZoom()}
      ref={mapRef}
      style={{ height: '50vh', width: '50vw' }}
    >
      <TileLayer
        attribution={
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
        url={'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
      />
      <MapExistingSpotsMonitor
        setExistingSpots={setExistingSpots}
        toggleToRefreshExistingSpots={toggleToRefreshExistingSpots}
      />
      <MapViewMonitor />
      {children}
    </MapContainer>
  );
};
