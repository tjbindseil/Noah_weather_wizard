import { LatLng, LatLngBounds } from 'leaflet';
import { useCallback, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { Spot } from 'ww-3-models-tjb';
import { useSpotService } from '../../services/spot_service';

export interface MapExistingSpotsMonitorProps {
  setExistingSpots: (existingSpots: Spot[]) => void;
  toggleToRefreshExistingSpots: boolean;
}

export const MapExistingSpotsMonitor = ({
  setExistingSpots,
  toggleToRefreshExistingSpots,
}: MapExistingSpotsMonitorProps) => {
  toggleToRefreshExistingSpots; // dummy prop to allow parent to force this to refresh

  // TODO do we need to use the map service here?
  const map = useMap();
  const spotService = useSpotService();

  const [mapBounds, setMapBounds] = useState(map.getBounds());

  const setMapBoundsIfChanged = useCallback(
    (newMapBounds: LatLngBounds) => {
      if (!mapBounds.equals(newMapBounds)) {
        setMapBounds(newMapBounds);
      }
    },
    [mapBounds, setMapBounds],
  );

  // I think we will have to run this func upon start up if we want to save checked spots between page loads
  // so we might have to vend the funcgtionality from spot service
  const fetchExistingSpots = useCallback(() => {
    // weird initial situation...
    // the asynchronous calls here are returning out of order, so the initial call with a 0/0 window
    // will return after the call with the real window. this results in there being no spots
    // this solution does not address the root cause but seems to work
    const zeroMapBounds = new LatLngBounds(new LatLng(0.0, 0.0), new LatLng(0.0, 0.0));
    if (mapBounds.equals(zeroMapBounds)) {
      return;
    }

    spotService
      .getSpots({
        minLat: mapBounds.getSouth().toString(),
        maxLat: mapBounds.getNorth().toString(),
        minLong: mapBounds.getWest().toString(),
        maxLong: mapBounds.getEast().toString(),
      })
      .then((result) => {
        setExistingSpots(result.spots);
      })
      .catch(console.error);
  }, [mapBounds]);

  useEffect(fetchExistingSpots, [mapBounds, toggleToRefreshExistingSpots]);

  // and when the map moves
  map.on('moveend', () => {
    setMapBoundsIfChanged(map.getBounds());
  });

  return <></>;
};

// county office: 303 271 1388
// main office (last resort): 800 221 3943
