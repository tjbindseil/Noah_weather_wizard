import { Spot } from 'ww-3-models-tjb';

export interface ExistingSpotProps {
  spot: Spot;
}

export const ExistingSpot = ({ spot }: ExistingSpotProps) => {
  return (
    <>
      <td>{spot.name}</td>
      <td>{spot.latitude}</td>
      <td>{spot.longitude}</td>
    </>
  );
};
