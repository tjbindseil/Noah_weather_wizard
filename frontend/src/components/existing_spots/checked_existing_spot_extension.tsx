import { useAppDispatch } from '../../app/hooks';
import { toggleSpotSelection, VisibleSpot } from '../../app/visible_spots_reducer';

export interface CheckedExistingSpotExtensionProps {
  visibleSpot: VisibleSpot;
}

export const CheckedExistingSpotExtension = ({
  visibleSpot,
}: CheckedExistingSpotExtensionProps) => {
  const dispatch = useAppDispatch();
  return (
    <td>
      <input
        type='checkbox'
        id={visibleSpot.spot.id.toString()}
        name='selected'
        checked={visibleSpot.selected}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          dispatch(toggleSpotSelection(Number(event.target.id)));
        }}
      />
    </td>
  );
};
