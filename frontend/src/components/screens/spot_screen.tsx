import React, { useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility';
import { NavBar } from '../nav_bar';
import { SelectedSpot, SelectedSpotProps } from '../map_stuff/selected_spot';
import { MapZoomController } from '../map_stuff/map_zoom_controller';
import { MapClickController } from '../map_stuff/map_click_controller';

export function SpotScreen() {
  const [selectedSpots, setSelectedSpots] = useState<SelectedSpotProps[]>([]);

  const [latitude, setLatitude] = useState(40.255014);
  const [longitude, setLongitude] = useState(-105.615115);
  const [name, setName] = useState('Longs Peak');

  const mapRef = useRef(null);

  const saveSpotFunc = useCallback(
    (selectedSpot: SelectedSpotProps) => {
      selectedSpots.push(selectedSpot);
      setSelectedSpots([...selectedSpots]);
    },
    [selectedSpots, setSelectedSpots],
  );

  const removeThisSelectedSpot = (removedSpot: SelectedSpotProps) => {
    const newSelectedSpots: SelectedSpotProps[] = [];
    selectedSpots.forEach((selectedSpot) => {
      if (selectedSpot !== removedSpot) {
        newSelectedSpots.push(selectedSpot);
      }
    });
    setSelectedSpots(newSelectedSpots);
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

      <button
        onClick={(_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          selectedSpots.push({ latitude, longitude, name });
          setSelectedSpots([...selectedSpots]);
        }}
      >
        Add
      </button>

      <h3>Selected Spots</h3>
      {selectedSpots.map((selectedSpot) => (
        <p key={selectedSpot.name}>
          {`${selectedSpot.name} lat: ${selectedSpot.latitude} long: ${selectedSpot.longitude}`}
          <button onClick={(_e) => removeThisSelectedSpot(selectedSpot)}>Remove</button>
        </p>
      ))}

      <MapContainer ref={mapRef} style={{ height: '50vh', width: '50vw' }}>
        <TileLayer
          attribution={
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
          url={'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
        />
        {/* Additional map layers or components can be added here */}
        {selectedSpots.map((selectedSpot) => (
          <SelectedSpot
            key={selectedSpot.name}
            latitude={selectedSpot.latitude}
            longitude={selectedSpot.longitude}
            name={selectedSpot.name}
          />
        ))}
        <MapZoomController
          selectedSpots={selectedSpots.map((selectedSpot) => [
            selectedSpot.latitude,
            selectedSpot.longitude,
          ])}
        />
        <MapClickController saveSelectedSpot={saveSpotFunc} />
      </MapContainer>
    </div>
  );
}
