import { useState } from 'react';
import { LatLng } from 'leaflet';
import { useMapService } from '../services/map_service';
import { PostSpotInput, PostSpotOutput } from 'ww-3-models-tjb';

export interface LatLngInputProps {
  setDesiredCenter: (arg: LatLng) => void;

  saveSpotFunc: (input: PostSpotInput) => Promise<PostSpotOutput>;
}

export const LatLngInput = ({ setDesiredCenter, saveSpotFunc }: LatLngInputProps) => {
  const mapService = useMapService();

  const [lat, setLat] = useState(mapService.getCenterLat());
  const [lng, setLng] = useState(mapService.getCenterLng());
  const [name, setName] = useState('');

  return (
    <>
      <label htmlFor='latitude'>Latitude:</label>
      <input
        type='number'
        id='latitude'
        value={lat}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setLat(parseFloat(event.target.value));
        }}
      />
      <br />

      <label htmlFor='longitude'>Longitude:</label>
      <input
        type='number'
        id='longitude'
        value={lng}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setLng(parseFloat(event.target.value));
        }}
      />
      <br />

      <label htmlFor='name'>Name:</label>
      <input
        type='text'
        id='name'
        value={name}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setName(event.target.value);
        }}
      />
      <br />

      <button
        onClick={async () => {
          setDesiredCenter(new LatLng(lat, lng));
        }}
      >
        Center Map
      </button>

      <button
        onClick={async () => {
          await saveSpotFunc({ latitude: lat, longitude: lng, name });
        }}
      >
        Create Spot
      </button>
    </>
  );
};
