import { useState } from 'react';
import { PostSpotInput, PostSpotOutput } from 'ww-3-models-tjb';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { center, setDesiredCenter } from '../app/map_view_reducer';

export interface LatLngInputProps {
  saveSpotFunc: (input: PostSpotInput) => Promise<PostSpotOutput>;
}

export const LatLngInput = ({ saveSpotFunc }: LatLngInputProps) => {
  const dispatch = useAppDispatch();

  const [lat, setLat] = useState(useAppSelector((state) => state.mapView.center).lat);
  const [lng, setLng] = useState(useAppSelector((state) => state.mapView.center).lng);
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
        onClick={() => {
          console.log('todo');
          dispatch(setDesiredCenter({ lat, lng }));
          dispatch(center());
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
