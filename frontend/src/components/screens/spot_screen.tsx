import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { NavBar } from '../nav_bar';

export function SpotScreen() {
  const [latitude, setLatitude] = useState(42);
  const [longitude, setLongitude] = useState(42);
  const [name, setName] = useState('name');

  const mapRef = useRef(null);
  const latitudeTutorial = 40.255014; // Longs Peak
  const longitudeTutorial = -105.615115;

  const mapContainerProps = {
    center: [latitudeTutorial, longitudeTutorial],
    zoom: 13,
    ref: mapRef,
    style: { height: '50vh', width: '50vw' },
  };
  const tileLayerProps = {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  };

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
