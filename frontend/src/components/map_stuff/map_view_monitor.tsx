import { useMap } from 'react-leaflet';
import { useAppDispatch } from '../../app/hooks';
import { setCenter, setMapBounds, setZoom } from '../../app/map_view_reducer';

export const MapViewMonitor = () => {
  const map = useMap();

  const dispatch = useAppDispatch();

  // all this does is save the zoom and center so that we can keep the map the same while moving from page to page
  map.on('moveend', () => {
    dispatch(setZoom(map.getZoom()));

    const center = map.getCenter();
    dispatch(setCenter({ lat: center.lat, lng: center.lng }));

    const mapBounds = map.getBounds();
    dispatch(
      setMapBounds({
        sw: {
          lat: mapBounds.getSouthWest().lat,
          lng: mapBounds.getSouthWest().lng,
        },
        ne: {
          lat: mapBounds.getNorthEast().lat,
          lng: mapBounds.getNorthEast().lng,
        },
      }),
    );
  });

  return <></>;
};
