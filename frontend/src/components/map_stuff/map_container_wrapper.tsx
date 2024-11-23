import { MapContainer, TileLayer } from 'react-leaflet';
import { useRef } from 'react';
import { LatLng } from 'leaflet';
import { MapViewMonitor, MapCenterController } from './';
import { LatLngInput } from '../lat_lng_input';
import { useAppSelector } from '../../app/hooks';

export interface MapContainerWrapperProps {
  children: React.ReactNode;
}

export const MapContainerWrapper = ({ children }: MapContainerWrapperProps) => {
  const mapRef = useRef(null);

  const zoom = useAppSelector((state) => state.mapView.zoom);
  const center = useAppSelector((state) => state.mapView.center);

  // TODO move this and all style to CSS
  return (
    <div className='map'>
      <div className={'LatLngInput'}>
        <LatLngInput />
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
        <MapViewMonitor />
        <MapCenterController />
        {children}
      </MapContainer>
    </div>
  );
};
