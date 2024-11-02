import { useEffect, useState } from 'react';
import { Spot } from 'ww-3-models-tjb';
import { useSpotService } from '../../services/spot_service';

export interface FavoritedExistingSpotExtensionProps {
  existingSpot: Spot;
}

export const FavoritedExistingSpotExtension = ({
  existingSpot,
}: FavoritedExistingSpotExtensionProps) => {
  const spotService = useSpotService();

  const [selfManagedFavorites, setSelfManagedFavorites] = useState<number[]>([]);

  useEffect(() => {
    spotService
      .getFavorites({})
      .then((result) => setSelfManagedFavorites(result.favoriteSpots.map((spot) => spot.id)));
  }, [spotService, setSelfManagedFavorites]);

  const favorited = !!selfManagedFavorites.includes(existingSpot.id);

  return (
    <td>
      <input
        type='checkbox'
        id={existingSpot.id.toString()}
        name='selected'
        checked={favorited}
        onChange={async () => {
          if (favorited) {
            await spotService.deleteFavorite({ spotId: existingSpot.id });
            const newFavorites = selfManagedFavorites.filter((id) => id !== existingSpot.id);
            setSelfManagedFavorites(newFavorites);
          } else {
            await spotService.postFavorite({ spotId: existingSpot.id });
            const newFavorites = JSON.parse(JSON.stringify(selfManagedFavorites));
            newFavorites.push(existingSpot.id);
            setSelfManagedFavorites(newFavorites);
          }
        }}
      />
    </td>
  );
};