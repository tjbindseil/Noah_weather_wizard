import { LatLng, LatLngBounds } from 'leaflet';
import { useCallback, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { Spot } from 'ww-3-models-tjb';

export interface MapExistingSpotsMonitorProps {
  setExistingSpots: (existingSpots: Spot[]) => void;
}

export const MapExistingSpotsMonitorProps = ({
  setExistingSpots,
}: MapExistingSpotsMonitorProps) => {
  const map = useMap();
  // TODO dry this out man!
  // hmm, could this be absorbed into the map service?
  //
  // well, one way to do this would be to have the existing spots be a child of the map
  //
  // Q: how would we keep these dipslayed outside of the thing?
  //   simply moving them under the MapContainer element is ineffective at first pass
  //
  // since that naive solution is ineffective, maybe I could find a middle ground
  //
  // track map bounds as a part of map view monitor (if this works, change its name back to map monitor)
  // when map bounds change there, fetch existing spots (as done here and in spot creation, this will dry things out)
  // pass a function in to set the existing spots
  //
  // lets do that
  const setMapBoundsIfChanged = useCallback(
    (newMapBounds: LatLngBounds) => {
      if (!mapBounds.equals(newMapBounds)) {
        setMapBounds(newMapBounds);
      }
    },
    [mapBounds, setMapBounds],
  );

  // TODO dry this out man!
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
  }, [mapBounds, fetchExistingSpots]);

  useEffect(fetchExistingSpots, [mapBounds, setExistingSpots]);

  // and when the map moves
  map.on('moveend', () => {
    setMapBounds(map.getBounds());
  });

  return <></>;
};
