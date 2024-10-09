import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { NavBar } from '../nav_bar';
import { SelectedSpot } from '../map_stuff/selected_spot';
import { LatLngBounds, LatLng } from 'leaflet';
import { Spot } from 'ww-3-models-tjb';
import { MapBoundsMonitor } from '../map_stuff/map_bounds_monitor';

export function SpotSelectionScreen() {
  // this screen is for selecting spots that are already created, note that new spots
  // must be created on the <a>spot creation page</a>
  //
  // so, here, based on the bounds of the map, we will display any existing spots
  // existing spots will be listed as blue points on the map and listed in a table
  //
  // in the table, the user will have the option to select them with a checkbox
  //
  // once selected, the spots will go from blue to green on the map
  //
  // lastly, the user can select a 'go to forecast' button and display the forecast for each
  const longsPeak = {
    lat: 40.255014,
    long: -105.615115,
  };

  // TODO state controlled checked vs unchecked for existing spots
  const checked = false;

  const [mapBounds, setMapBounds] = useState<LatLngBounds>(
    new LatLngBounds(new LatLng(0.0, 0.0), new LatLng(0.0, 0.0)),
  );
  const [existingSpots, setExistingSpots] = useState<Spot[]>([]);

  const mapRef = useRef(null);

  // so, upon loading, get map bounds
  // upon mapBounds changing, get existing points
  // upon existingPoints being updated, display them?

  useEffect(() => {
    fetch(
      'http://localhost:8080/spots?' +
        new URLSearchParams({
          minLat: mapBounds.getSouth().toString(),
          maxLat: mapBounds.getNorth().toString(),
          minLong: mapBounds.getWest().toString(),
          maxLong: mapBounds.getEast().toString(),
        }),
      {
        method: 'GET',
        mode: 'cors',
      },
    )
      .then((result) => result.json())
      .then((result) => {
        setExistingSpots(result.spots);
      })
      .catch(console.error);
  }, [mapBounds, setExistingSpots]);

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
                  <input type='checkbox' id='selected' name='selected' checked={!!checked} />
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
          />
        ))}
        <MapBoundsMonitor setMapBounds={setMapBounds} />
      </MapContainer>
    </div>
  );
}
