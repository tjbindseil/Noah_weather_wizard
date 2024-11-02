import { LatLng } from 'leaflet';

export interface LatLngInputProps {
  lat: number;
  setLat: (arg: number) => void;
  lng: number;
  setLng: (arg: number) => void;
  name: string;
  setName: (arg: string) => void;
  setDesiredCenter: (arg: LatLng) => void;
}

export const LatLngInput = ({
  lat,
  lng,
  setLat,
  setLng,
  name,
  setName,
  setDesiredCenter,
}: LatLngInputProps) => {
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

      <label htmlFor='longitude'>Longitude:</label>
      <input
        type='number'
        id='longitude'
        value={lng}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setLng(parseFloat(event.target.value));
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
        onClick={async () => {
          setDesiredCenter(new LatLng(lat, lng));
        }}
      >
        Center Map
      </button>
    </>
  );
};
