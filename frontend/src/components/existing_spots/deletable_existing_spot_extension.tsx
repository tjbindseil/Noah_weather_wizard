import { DeleteSpotInput, Spot } from 'ww-3-models-tjb';
import { useUserService } from '../../services/user_service';

export interface DeletableExistingSpotExtensionProps {
  existingSpot: Spot;
  removeSpotFunc: (arg: DeleteSpotInput) => void;
}

export const DeletableExistingSpotExtension = ({
  existingSpot,
  removeSpotFunc,
}: DeletableExistingSpotExtensionProps) => {
  const userService = useUserService();

  if (userService.getUsername() === existingSpot.creator) {
    return <button onClick={() => removeSpotFunc({ id: existingSpot.id })}>Delete Spot</button>;
  } else {
    return <></>;
  }
};
