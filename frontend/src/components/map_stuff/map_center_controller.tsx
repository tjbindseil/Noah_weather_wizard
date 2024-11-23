import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useAppSelector } from '../../app/hooks';

export const MapCenterController = () => {
  const map = useMap();
  const center = useAppSelector((state) => state.mapView.center);
  const desiredCenter = useAppSelector((state) => state.mapView.desiredCenter);
  const toggleToCenter = useAppSelector((state) => state.mapView.toggleToCenter);

  useEffect(() => {
    if (!(center.lat === desiredCenter.lat && center.lng === desiredCenter.lng)) {
      map.setView(desiredCenter);
      // this will rip through and the state store will be updated when the map actually moves
    }
  }, [toggleToCenter]);

  return <></>;
};
