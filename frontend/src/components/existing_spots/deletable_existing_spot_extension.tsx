import { DeleteSpotInput, Spot } from 'ww-3-models-tjb';
import { useUserService } from '../../services/user_service';

export interface CreatorExistingSpotExtensionProps {
  existingSpot: Spot;
  removeSpotFunc: (arg: DeleteSpotInput) => void;
}

export const CreatorExistingSpotExtension = ({
  existingSpot,
  removeSpotFunc,
}: CreatorExistingSpotExtensionProps) => {
  const userService = useUserService();

  return (
    <td>
      {existingSpot.creator}
      {userService.getUsername() === existingSpot.creator ? (
        <button onClick={() => removeSpotFunc({ id: existingSpot.id })}>Delete Spot</button>
      ) : (
        <></>
      )}
    </td>
  );
};
