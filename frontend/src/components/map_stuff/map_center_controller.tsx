import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useAppSelector } from '../../app/hooks';

export const MapCenterController = () => {
  const map = useMap();
  const center = useAppSelector((state) => state.mapView.center);
  const desiredCenter = useAppSelector((state) => state.mapView.desiredCenter);

  useEffect(() => {
    if (!center.equals(desiredCenter)) {
      map.setView(desiredCenter);
      // this will rip through and the state store will be updated when the map actually moves
    }
  }, [desiredCenter]);

  return <></>;
};
