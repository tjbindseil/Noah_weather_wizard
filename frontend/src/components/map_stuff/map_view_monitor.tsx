import { useMap } from 'react-leaflet';
import { useAppDispatch } from '../../app/hooks';
import { setCenter, setZoom } from '../../app/map_view_reducer';

export const MapViewMonitor = () => {
  const map = useMap();

  const dispatch = useAppDispatch();

  // all this does is save the zoom and center so that we can keep the map the same while moving from page to page
  map.on('moveend', () => {
    const zoom = map.getZoom();
    dispatch(setZoom(zoom));

    const center = map.getCenter();
    dispatch(setCenter({ lat: center.lat, lng: center.lng }));
  });

  return <></>;
};
