import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useAppSelector } from '../../app/hooks';

export const MapCenterController = () => {
  const map = useMap();
  const center = useAppSelector((state) => state.mapView.center);
  const desiredCenter = useAppSelector((state) => state.mapView.desiredCenter);
  const toggleToCenter = useAppSelector((state) => state.mapView.toggleToCenter);
  console.log(`@@ @@ toggleToCenter is: ${toggleToCenter}`);

  useEffect(() => {
    console.log(
      `mcc, toggled, center is: ${JSON.stringify(center)} desiredCenter is: ${JSON.stringify(desiredCenter)}`,
    );
    if (!(center.lat === desiredCenter.lat && center.lng === desiredCenter.lng)) {
      console.log(`mcc, setting view t odesired center: ${JSON.stringify(desiredCenter)}`);
      map.setView(desiredCenter);
      // this will rip through and the state store will be updated when the map actually moves
    }
  }, [toggleToCenter]);

  return <></>;
};
