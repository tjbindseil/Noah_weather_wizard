import { useState, useRef, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { NavBar } from '../nav_bar';
import { SelectedSpot } from '../map_stuff/selected_spot';
import { LatLngBounds, LatLng } from 'leaflet';
import { Spot } from 'ww-3-models-tjb';
import { MapBoundsMonitor } from '../map_stuff/map_bounds_monitor';
import { LeafletMarkerColorOptions } from '../map_stuff/marker_color';
import { useSpotService } from '../../services/spot_service';

export function SpotSelectionScreen() {
  const spotService = useSpotService();

  const longsPeak = {
    lat: 40.255014,
    long: -105.615115,
  };

  const [checkedSpots, setCheckedSpots] = useState<number[]>([]);

  const [mapBounds, setMapBounds] = useState<LatLngBounds>(
    new LatLngBounds(new LatLng(0.0, 0.0), new LatLng(0.0, 0.0)),
  );
  const [existingSpots, setExistingSpots] = useState<Spot[]>([]);

  const mapRef = useRef(null);

  // TODO dry this out man!
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
  }, [mapBounds, setExistingSpots]);

  useEffect(fetchExistingSpots, [mapBounds, setExistingSpots]);

  return (
    <div className='Home'>
      <NavBar />
      <p>Select spots for which you would like a forecast.</p>
      <p>
        To create new spots, use the{' '}
        <a href={'localhost:3000/spot-creation'}> Spot Creation Page</a>
      </p>
      <p>
        Once all desired spots are selected, click the compare button to compare their forecasts.
      </p>
      <br />
      <p>
        Blue spots are existing spots which are not selected for comparison, while green spots are
        selected for comparison.
      </p>
      <br />

      <h3>Existing Spots</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Selected</th>
          </tr>
        </thead>
        <tbody>
          {existingSpots.map((existingSpot) => (
            <>
              <tr>
                <td>{existingSpot.name}</td>
                <td>{existingSpot.latitude}</td>
                <td>{existingSpot.longitude}</td>
                <td>
                  <input
                    type='checkbox'
                    id={existingSpot.id.toString()}
                    name='selected'
                    checked={!!checkedSpots.includes(existingSpot.id)}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      checkedSpots.includes(Number(event.target.id))
                        ? checkedSpots.splice(
                            checkedSpots.findIndex((spotId) => spotId === Number(event.target.id)),
                            1,
                          )
                        : checkedSpots.push(Number(event.target.id));

                      setCheckedSpots([...checkedSpots]);
                    }}
                  />
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>

      <MapContainer
        center={[longsPeak.lat, longsPeak.long]}
        zoom={13}
        ref={mapRef}
        style={{ height: '50vh', width: '50vw' }}
      >
        <TileLayer
          attribution={
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
          url={'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
        />
        {existingSpots.map((existingSpot) => (
          <SelectedSpot
            key={existingSpot.id}
            latitude={existingSpot.latitude}
            longitude={existingSpot.longitude}
            name={existingSpot.name}
            color={
              checkedSpots.includes(existingSpot.id)
                ? LeafletMarkerColorOptions.Green
                : LeafletMarkerColorOptions.Blue
            }
          />
        ))}
        <MapBoundsMonitor setMapBounds={setMapBoundsIfChanged} />
      </MapContainer>
    </div>
  );
}
