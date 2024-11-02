import { Spot } from 'ww-3-models-tjb';

export interface CheckedExistingSpotExtensionProps {
  existingSpot: Spot;
  checkedSpots: number[];
  setCheckedSpots: (arg: number[]) => void;
}

export const CheckedExistingSpotExtension = ({
  existingSpot,
  checkedSpots,
  setCheckedSpots,
}: CheckedExistingSpotExtensionProps) => {
  return (
    <td>
      <input
        type='checkbox'
        id={existingSpot.id.toString()}
        name='selected'
        checked={!!checkedSpots.includes(existingSpot.id)}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          checkedSpots.includes(Number(event.target.id))
            ? checkedSpots.splice(
                checkedSpots.findIndex((spotId) => spotId === Number(event.target.id)),
                1,
              )
            : checkedSpots.push(Number(event.target.id));

          setCheckedSpots([...checkedSpots]);
        }}
      />
    </td>
  );
};
