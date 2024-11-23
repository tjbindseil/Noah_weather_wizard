import { Spot } from 'ww-3-models-tjb';
import { useSpotService } from '../../services/spot_service';
import { useUserService } from '../../services/user_service';

export interface CreatorExistingSpotExtensionProps {
  existingSpot: Spot;
}

export const CreatorExistingSpotExtension = ({
  existingSpot,
}: CreatorExistingSpotExtensionProps) => {
  const userService = useUserService();
  const spotService = useSpotService();

  return (
    <td>
      {existingSpot.creator}
      {userService.getUsername() === existingSpot.creator ? (
        <button onClick={() => spotService.deleteSpot({ id: existingSpot.id })}>Delete Spot</button>
      ) : (
        <></>
      )}
    </td>
  );
};
