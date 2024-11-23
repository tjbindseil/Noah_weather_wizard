import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useAppDispatch } from '../../app/hooks';
import { setCenter, setMapBounds, setZoom } from '../../app/map_view_reducer';

export const MapViewMonitor = () => {
  const map = useMap();

  const dispatch = useAppDispatch();

  // one when component loads, get the map bounds from the map and make sure that the system knows the correct bounds
  // this is really the only way to initialize it
  useEffect(() => {
    const initialMapBounds = map.getBounds();
    console.log(`dispatching initialMapBounds is: ${initialMapBounds.toBBoxString()}`);
    dispatch(
      setMapBounds({
        sw: {
          lat: initialMapBounds.getSouthWest().lat,
          lng: initialMapBounds.getSouthWest().lng,
        },
        ne: {
          lat: initialMapBounds.getNorthEast().lat,
          lng: initialMapBounds.getNorthEast().lng,
        },
      }),
    );
  }, []);

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
