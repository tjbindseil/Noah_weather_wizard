import { MapContainer, TileLayer } from 'react-leaflet';
import { useRef } from 'react';
import { PostSpotInput, PostSpotOutput, Spot } from 'ww-3-models-tjb';
import { LatLng } from 'leaflet';
import { MapViewMonitor, MapExistingSpotsMonitor, MapCenterController } from './';
import { LatLngInput } from '../lat_lng_input';
import { useAppSelector } from '../../app/hooks';

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

  const zoom = useAppSelector((state) => state.mapView.zoom);
  console.log(`zoom is: ${zoom}`);
  const center = useAppSelector((state) => state.mapView.center);
  console.log(`center is: ${JSON.stringify(center)}`);

  // TODO move this and all style to CSS
  return (
    <div className='map'>
      <div className={'LatLngInput'}>
        <LatLngInput saveSpotFunc={saveSpotFunc} />
      </div>
      <MapContainer
        center={new LatLng(center.lat, center.lng)}
        zoom={zoom}
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
        <MapCenterController />
        {children}
      </MapContainer>
    </div>
  );
};
