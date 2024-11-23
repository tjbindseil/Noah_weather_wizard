import { VisibleSpot } from '../../app/visible_spots_reducer';
import { useSpotService } from '../../services/spot_service';
import { useUserService } from '../../services/user_service';

export interface CreatorExistingSpotExtensionProps {
  visibleSpot: VisibleSpot;
}

export const CreatorExistingSpotExtension = ({
  visibleSpot,
}: CreatorExistingSpotExtensionProps) => {
  const userService = useUserService();
  const spotService = useSpotService();

  return (
    <td>
      {visibleSpot.spot.creator}
      {userService.getUsername() === visibleSpot.spot.creator ? (
        <button onClick={() => spotService.deleteSpot({ id: visibleSpot.spot.id })}>
          Delete Spot
        </button>
      ) : (
        <></>
      )}
    </td>
  );
};
