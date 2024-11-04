import { MapContainer, TileLayer } from 'react-leaflet';
import { useRef } from 'react';
import { useMapService } from '../../services/map_service';
import { Spot } from 'ww-3-models-tjb';
import { LatLng } from 'leaflet';
import { MapCenterController, MapViewMonitor, MapExistingSpotsMonitor } from './';

export interface MapContainerWrapperProps {
  children: React.ReactNode;
  setExistingSpots: (existingSpots: Spot[]) => void;
  toggleToRefreshExistingSpots: boolean;
  desiredCenter: LatLng;
}

export const MapContainerWrapper = ({
  children,
  setExistingSpots,
  toggleToRefreshExistingSpots,
  desiredCenter,
}: MapContainerWrapperProps) => {
  const mapRef = useRef(null);
  const mapService = useMapService();

  // TODO move this and all style to CSS
  return (
    <div className='map'>
      <MapContainer
        center={new LatLng(mapService.getCenterLat(), mapService.getCenterLng())}
        zoom={mapService.getZoom()}
        ref={mapRef}
        style={{ height: '50vh', width: '100vw' }}
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
        <MapCenterController desiredCenter={desiredCenter} />
        {children}
      </MapContainer>
    </div>
  );
};
