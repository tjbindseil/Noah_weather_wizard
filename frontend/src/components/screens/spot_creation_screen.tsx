import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { NavBar } from '../nav_bar';
import { SelectedSpot } from '../map_stuff/selected_spot';
import { MapClickController } from '../map_stuff/map_click_controller';
import { LatLng, LatLngBounds } from 'leaflet';
import { MapBoundsMonitor } from '../map_stuff/map_bounds_monitor';
import { PostSpotInput, Spot } from 'ww-3-models-tjb';
import { LeafletMarkerColorOptions } from '../map_stuff/marker_color';
import { useSpotService } from '../../services/spot_service';

export function SpotCreationScreen() {
  const spotService = useSpotService();

  const mapRef = useRef(null);

  const longsPeak = {
    lat: 40.255014,
    long: -105.615115,
  };

  const [latitude, setLatitude] = useState(longsPeak.lat);
  const [longitude, setLongitude] = useState(longsPeak.long);
  const [name, setName] = useState('Longs Peak');

  // TODO I dont think this mechanism works
  const [centerLat, setCenterLat] = useState(longsPeak.lat);
  const [centerLong, setCenterLong] = useState(longsPeak.long);

  const [mapBounds, setMapBounds] = useState<LatLngBounds>(
    new LatLngBounds(new LatLng(0.0, 0.0), new LatLng(0.0, 0.0)),
  );
  const [existingSpots, setExistingSpots] = useState<Spot[]>([]);

  const setMapBoundsIfChanged = useCallback(
    (newMapBounds: LatLngBounds) => {
      if (!mapBounds.equals(newMapBounds)) {
        setMapBounds(newMapBounds);
      }
    },
    [mapBounds, setMapBounds],
  );

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

  useEffect(fetchExistingSpots, [fetchExistingSpots, mapBounds]);

  const saveSpotFunc = useCallback(
    async (selectedSpot: PostSpotInput) => {
      await spotService.createSpot(selectedSpot);
      // TODO i think this still doesn't work
      fetchExistingSpots();
    },
    [fetchExistingSpots, spotService],
  );

  // TODO upon clicing on map, set the lat/long input values

  return (
    <div className='Home'>
      <NavBar />
      <p>Create and save spots here.</p>
      <p>
        Either select a point on the map to have the latitude and longitude autopopulate, or enter
        them in manually.
      </p>
      <p>Then, name your spot and save it.</p>
      <p>
        Once all your spots are created, check out the
        <a href={'localhost:3000/spot-selection'}> Spot Selection Page</a> to select the spots you
        would like to compare.
      </p>
      <br />
      <p>
        Blue spots are spots that are already created, while a green spot is what is currently being
        created.
      </p>
      <br />

      <label htmlFor='latitude'>Latitude:</label>
      <input
        type='number'
        id='latitude'
        value={latitude}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setLatitude(parseFloat(event.target.value));
        }}
      />

      <label htmlFor='longitude'>Longitude:</label>
      <input
        type='number'
        id='longitude'
        value={longitude}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setLongitude(parseFloat(event.target.value));
        }}
      />

      <label htmlFor='name'>Name:</label>
      <input
        type='text'
        id='name'
        value={name}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setName(event.target.value);
        }}
      />

      <button
        onClick={async () => {
          await saveSpotFunc({ latitude, longitude, name });
          // TODO refresh shown spots (this should turn the current spot from blue to red)
          // this is getting done now, but initial spots are an issue because the map bounds monitor has trouble setting them initially
          //
          // could pass in some rigged one time setter to use
        }}
      >
        Save Spot
      </button>
      <button
        onClick={async () => {
          setCenterLat(latitude);
          setCenterLong(longitude);
        }}
      >
        Center map
      </button>

      <h3>Existing Spots</h3>
      {existingSpots.map((existingSpot) => (
        <p key={existingSpot.id}>
          {`${existingSpot.name} lat: ${existingSpot.latitude} long: ${existingSpot.longitude}`}
        </p>
      ))}

      <MapContainer
        center={[centerLat, centerLong]}
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
            color={LeafletMarkerColorOptions.Blue}
          />
        ))}
        <MapClickController
          saveSelectedSpot={saveSpotFunc}
          color={LeafletMarkerColorOptions.Green}
        />
        <MapBoundsMonitor setMapBounds={setMapBoundsIfChanged} />
      </MapContainer>
    </div>
  );
}
