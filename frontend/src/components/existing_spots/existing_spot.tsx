import { Spot } from 'ww-3-models-tjb';

export interface ExistingSpotProps {
  existingSpot: Spot;
}

export const ExistingSpot = ({ existingSpot }: ExistingSpotProps) => {
  return (
    <>
      <td>{existingSpot.name}</td>
      <td>{existingSpot.latitude}</td>
      <td>{existingSpot.longitude}</td>
    </>
  );
};
