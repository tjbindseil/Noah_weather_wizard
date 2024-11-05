import { MapContainer, TileLayer } from 'react-leaflet';
import { useRef, useState } from 'react';
import { useMapService } from '../../services/map_service';
import { PostSpotInput, PostSpotOutput, Spot } from 'ww-3-models-tjb';
import { LatLng } from 'leaflet';
import { MapCenterController, MapViewMonitor, MapExistingSpotsMonitor } from './';
import { LatLngInput } from '../lat_lng_input';

export interface MapContainerWrapperProps {
  children: React.ReactNode;
  setExistingSpots: (existingSpots: Spot[]) => void;
  toggleToRefreshExistingSpots: boolean;
  saveSpotFunc: (input: PostSpotInput) => Promise<PostSpotOutput>;
}

export const MapContainerWrapper = ({
  children,
  setExistingSpots,
  toggleToRefreshExistingSpots,
  saveSpotFunc,
}: MapContainerWrapperProps) => {
  const mapRef = useRef(null);
  const mapService = useMapService();

  const [desiredCenter, setDesiredCenter] = useState(
    new LatLng(mapService.getCenterLat(), mapService.getCenterLng()),
  );

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
        <div
          style={{
            position: 'absolute',
            width: '10vw',
            height: '10vh',
            top: 0,
            right: 0,
            zIndex: 10000,
            backgroundColor: 'red',
          }}
        >
          <LatLngInput saveSpotFunc={saveSpotFunc} setDesiredCenter={setDesiredCenter} />
        </div>
      </MapContainer>
    </div>
  );
};
