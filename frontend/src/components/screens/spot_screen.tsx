import React, { useState, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { NavBar } from '../nav_bar';
import { SelectedSpot } from '../selected_spot';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
// icon={new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })}

export function SpotScreen() {
  const [selectedSpots, setSelectedSpots] = useState<SelectedSpot[]>([]);

  const [latitude, setLatitude] = useState(40.255014);
  const [longitude, setLongitude] = useState(-105.615115);
  const [name, setName] = useState('Longs Peak');

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
        <p
          key={selectedSpot.name}
        >{`${selectedSpot.name} lat: ${selectedSpot.latitude} long: ${selectedSpot.longitude}`}</p>
      ))}

      <MapContainer {...mapContainerProps}>
        <TileLayer {...tileLayerProps} />
        {/* Additional map layers or components can be added here */}
        {selectedSpots.map((selectedSpot) => {
          const markerProps = {
            position: [selectedSpot.latitude, selectedSpot.longitude],
            iconUrl: markerIconPng,
          };
          return (
            <Marker key={selectedSpot.name} {...markerProps}>
              <Popup key={selectedSpot.name}>{selectedSpot.name}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
