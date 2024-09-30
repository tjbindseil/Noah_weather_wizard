import React, { useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { NavBar } from '../nav_bar';
import { SelectedSpotProps } from '../map_stuff/selected_spot';
import { MapZoomController } from '../map_stuff/map_zoom_controller';
import { LeafletMarkerColorOptions, MapClickController } from '../map_stuff/map_click_controller';

export function SpotCreationScreen() {
  const [latitude, setLatitude] = useState(40.255014);
  const [longitude, setLongitude] = useState(-105.615115);
  const [name, setName] = useState('Longs Peak');

  const mapRef = useRef(null);

  const saveSpotFunc = useCallback(
    async (selectedSpot: SelectedSpotProps) => {
      // TODO context like dwf services
      await (
        await fetch('localhost:8080/spot', {
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
        <a href={'localhost:3000/spot-selection'}> Spot Selection Page</a> to select the spots
        you&aposd like to compare.
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
        onClick={async (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          await saveSpotFunc({ latitude, longitude, name });
          // TODO refresh shown spots (this should turn the current spot from blue to red)
        }}
      >
        Save Spot
      </button>

      {
        // TODO could potentially list existing spots
        //       <h3>Selected Spots</h3>
        //       {selectedSpots.map((selectedSpot) => (
        //         <p key={selectedSpot.name}>
        //           {`${selectedSpot.name} lat: ${selectedSpot.latitude} long: ${selectedSpot.longitude}`}
        //           <button onClick={(_e) => removeThisSelectedSpot(selectedSpot)}>Remove</button>
        //         </p>
        //       ))}
      }

      <MapContainer ref={mapRef} style={{ height: '50vh', width: '50vw' }}>
        <TileLayer
          attribution={
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
          url={'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
        />
        <MapZoomController selectedSpots={[[latitude, longitude]]} />
        <MapClickController
          saveSelectedSpot={saveSpotFunc}
          color={LeafletMarkerColorOptions.Blue}
        />
      </MapContainer>
    </div>
  );
}
