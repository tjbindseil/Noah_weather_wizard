import { useState } from 'react';
import { NavBar } from '../nav_bar';

export function SpotScreen() {
  const [latitude, setLatitude] = useState(42);
  const [longitude, setLongitude] = useState(42);
  const [name, setName] = useState('name');

  // so,
  // i could have users input points by:
  // 1. manually putting lat/long
  // 2. selecing via a map
  //
  // lets allow both, and lets get something like this working:
  //
  // naw, first, lets just get something working
  // lets just do one
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
    </div>
  );
}
