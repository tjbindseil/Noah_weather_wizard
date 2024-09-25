import { useState } from 'react';
import { ComposableMap, Marker, Geographies, Geography } from 'react-simple-maps';
import { NavBar } from '../nav_bar';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json';

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

      <ComposableMap>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} />)
          }
        </Geographies>

        <Marker coordinates={[longitude, latitude]}>
          <circle r={8} fill='#F53' />
        </Marker>
      </ComposableMap>
    </div>
  );
}
