import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setDesiredCenter } from '../app/map_view_reducer';
import { useSpotService } from '../services/spot_service';

export const LatLngInput = () => {
  const dispatch = useAppDispatch();
  const spotService = useSpotService();

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
          dispatch(setDesiredCenter({ lat, lng }));
        }}
      >
        Center Map
      </button>

      <button
        onClick={async () => {
          await spotService.createSpot({ latitude: lat, longitude: lng, name });
        }}
      >
        Create Spot
      </button>
    </>
  );
};
