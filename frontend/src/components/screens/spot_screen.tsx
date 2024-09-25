import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { NavBar } from '../nav_bar';

export function SpotScreen() {
  const [latitude, setLatitude] = useState(42);
  const [longitude, setLongitude] = useState(42);
  const [name, setName] = useState('name');

  const mapRef = useRef(null);
  const latitudeTutorial = 51.505;
  const longitudeTutorial = -0.09;

  const mapContainerProps = {
    center: [latitudeTutorial, longitudeTutorial],
    zoom: 13,
    ref: mapRef,
    style: { height: '100vh', width: '100vw' },
  };
  const tileLayerProps = {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  };

  // so,
  // i could have users input points by:
  // 1. manually putting lat/long
  // 2. selecing via a map
  //
  // lets allow both, and lets get something like this working:
  //
  // naw, first, lets just get something working
  // lets just do one
  //
  // i think interacting with caltopo is ideal
  // https://cal.com/docs/core-features/embed/adding-embed-to-your-webpage
  // ^ umm, this is for a calendar
  //
  // I will search a bit more to see if i can get a way to interact directly with cal topo
  // if not, i will probably just resort to just showing the points as lat/long/name, and probably allow users to favorite them or something
  //
  //
  // gonna try to use leaflet.js as a mapping lib: https://leafletjs.com/
  //
  // IntrinsicAttributes & MapContainerProps & RefAttributes<LeafletMap>'
  return (
    <div className='Home'>
      <NavBar />
      <p>Select spots here</p>

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

      <MapContainer {...mapContainerProps}>
        <TileLayer {...tileLayerProps} />
        {/* Additional map layers or components can be added here */}
      </MapContainer>
    </div>
  );
}
