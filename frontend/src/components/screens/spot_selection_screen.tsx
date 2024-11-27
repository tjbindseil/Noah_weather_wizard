import { NavBar } from '../nav_bar';
import { ExistingSpots } from '../existing_spots/existing_spots';
import { SelectedExistingSpotExtension } from '../existing_spots/selected_existing_spot_extension';
import { FavoritedExistingSpotExtension } from '../existing_spots/favorite_existing_spot_extension';
import { MapContainerWrapper, LeafletMarkerColorOptions, SelectedSpot } from '../map_stuff';
import { useAppSelector } from '../../app/hooks';
import { VisibleSpot } from '../../app/visible_spots_reducer';

export function SpotSelectionScreen() {
  const visibleSpots = useAppSelector((state) => state.visibleSpots.visibleSpots);

  const existingSpotCustomizations = new Map<
    string,
    (visibleSpot: VisibleSpot) => React.ReactNode
  >();
  existingSpotCustomizations.set('Selected', (visibleSpot: VisibleSpot) => (
    <SelectedExistingSpotExtension visibleSpot={visibleSpot} />
  ));

  existingSpotCustomizations.set('Favorited', (visibleSpot: VisibleSpot) => (
    <FavoritedExistingSpotExtension visibleSpot={visibleSpot} />
  ));

  // TODO check / uncheck all

  return (
    <div className='MapWrapper'>
      <NavBar />
      <h2>Select Spots</h2>

      <MapContainerWrapper>
        {visibleSpots.map((visibleSpot) => (
          <SelectedSpot
            color={
              visibleSpot.selected
                ? LeafletMarkerColorOptions.Green
                : LeafletMarkerColorOptions.Blue
            }
            hoveredColor={LeafletMarkerColorOptions.Red}
            visibleSpot={visibleSpot}
            key={`SelectedSpot-${visibleSpot.spot.id}`}
          />
        ))}
      </MapContainerWrapper>

      <ExistingSpots customizations={existingSpotCustomizations} />
    </div>
  );
}
