import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { NavBar } from '../nav_bar';
import { SelectedSpot, SelectedSpotProps } from '../map_stuff/selected_spot';
import { LeafletMarkerColorOptions, MapClickController } from '../map_stuff/map_click_controller';
import { LatLng, LatLngBounds } from 'leaflet';
import { MapBoundsMonitor } from '../map_stuff/map_bounds_monitor';
import { Spot } from 'ww-3-models-tjb';

export function SpotCreationScreen() {
  const longsPeak = {
    lat: 40.255014,
    long: -105.615115,
  };

  const [latitude, setLatitude] = useState(longsPeak.lat);
  const [longitude, setLongitude] = useState(longsPeak.long);
  const [name, setName] = useState('Longs Peak');

  const [centerLat, setCenterLat] = useState(longsPeak.lat);
  const [centerLong, setCenterLong] = useState(longsPeak.long);

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

  const saveSpotFunc = useCallback(
    async (selectedSpot: SelectedSpotProps) => {
      // TODO context like dwf services
      await (
        await fetch('http://localhost:8080/spot', {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...selectedSpot,
          }),
        })
      ).json();
    },
    [name, latitude, longitude],
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
        Red spots are spots that are already created, while a blue spot is what is currently being
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
          />
        ))}
        <MapClickController
          saveSelectedSpot={saveSpotFunc}
          color={LeafletMarkerColorOptions.Green}
        />
        <MapBoundsMonitor setMapBounds={setMapBounds} />
      </MapContainer>
    </div>
  );
}
