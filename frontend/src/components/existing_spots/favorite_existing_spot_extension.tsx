import { useEffect, useState } from 'react';
import { VisibleSpot } from '../../app/visible_spots_reducer';
import { useSpotService } from '../../services/spot_service';

export interface FavoritedExistingSpotExtensionProps {
  visibleSpot: VisibleSpot;
}

export const FavoritedExistingSpotExtension = ({
  visibleSpot,
}: FavoritedExistingSpotExtensionProps) => {
  const spotService = useSpotService();

  const [selfManagedFavorites, setSelfManagedFavorites] = useState<number[]>([]);

  useEffect(() => {
    spotService
      .getFavorites({})
      .then((result) => setSelfManagedFavorites(result.favoriteSpots.map((spot) => spot.id)))
      .catch((e) => {
        console.error(`issue getting favorites, e is: ${e}`);
        setSelfManagedFavorites([]);
      });
  }, [spotService, setSelfManagedFavorites]);

  const favorited = !!selfManagedFavorites.includes(visibleSpot.spot.id);

  return (
    <td>
      <input
        type='checkbox'
        id={visibleSpot.spot.id.toString()}
        name='selected'
        checked={favorited}
        onChange={async () => {
          if (favorited) {
            try {
              await spotService.deleteFavorite({ spotId: visibleSpot.spot.id });
              const newFavorites = selfManagedFavorites.filter((id) => id !== visibleSpot.spot.id);
              setSelfManagedFavorites(newFavorites);
            } catch (e: unknown) {
              console.error(e);
            }
          } else {
            try {
              await spotService.postFavorite({ spotId: visibleSpot.spot.id });
              const newFavorites = JSON.parse(JSON.stringify(selfManagedFavorites));
              newFavorites.push(visibleSpot.spot.id);
              setSelfManagedFavorites(newFavorites);
            } catch (e: unknown) {
              console.error(e);
            }
          }
        }}
      />
    </td>
  );
};
