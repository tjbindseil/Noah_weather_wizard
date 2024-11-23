import { useState, useCallback, useEffect } from 'react';
import { NavBar } from '../nav_bar';
import { Spot } from 'ww-3-models-tjb';
import { useNavigate } from 'react-router-dom';
import { ExistingSpots } from '../existing_spots/existing_spots';
import { CheckedExistingSpotExtension } from '../existing_spots/checked_existing_spot_extension';
import { FavoritedExistingSpotExtension } from '../existing_spots/favorite_existing_spot_extension';
import { MapContainerWrapper, LeafletMarkerColorOptions, SelectedSpot } from '../map_stuff';
import { useSpotService } from '../../services/spot_service';
import { useAppSelector } from '../../app/hooks';

export function SpotSelectionScreen() {
  const navigate = useNavigate();
  const spotService = useSpotService();

  const visibleSpots = useAppSelector((state) => state.visibleSpots.visibleSpots);

  const [checkedSpots, setCheckedSpots] = useState<number[]>(spotService.getCheckedSpots());
  const setAndSaveCheckedSpots = useCallback(
    (newCheckedSpots: number[]) => {
      spotService.setCheckedSpots(newCheckedSpots);
      setCheckedSpots(newCheckedSpots);
    },
    [spotService, setCheckedSpots],
  );

  const toForecastPage = useCallback(() => {
    navigate('/forecast');
  }, [navigate]);

  useEffect(() => {
    const existingSpotIds = visibleSpots.map((v) => v.spot).map((s) => s.id);
    let recalculateCheckedSpots = false;
    checkedSpots.forEach(
      (checkedSpot) =>
        (recalculateCheckedSpots =
          recalculateCheckedSpots || !existingSpotIds.includes(checkedSpot)),
    );

    if (recalculateCheckedSpots) {
      const newCheckedSpots: number[] = [];
      checkedSpots.forEach((checkedSpotId) => {
        if (existingSpotIds.includes(checkedSpotId)) {
          newCheckedSpots.push(checkedSpotId);
        }
      });
      setAndSaveCheckedSpots(newCheckedSpots);
    }
  }, [visibleSpots, checkedSpots, setAndSaveCheckedSpots]);

  const existingSpotCustomizations = new Map<string, (existingSpot: Spot) => React.ReactNode>();
  existingSpotCustomizations.set('Checked', (existingSpot: Spot) => (
    <CheckedExistingSpotExtension
      existingSpot={existingSpot}
      checkedSpots={checkedSpots}
      setCheckedSpots={setAndSaveCheckedSpots}
    />
  ));

  existingSpotCustomizations.set('Favorited', (existingSpot: Spot) => (
    <FavoritedExistingSpotExtension existingSpot={existingSpot} />
  ));

  // TODO check / uncheck all

  return (
    <div className='MapWrapper'>
      <NavBar />
      <h2>Select Spots</h2>

      <MapContainerWrapper>
        {visibleSpots
          .map((v) => v.spot)
          .map((existingSpot) => (
            <SelectedSpot
              key={existingSpot.id}
              latitude={existingSpot.latitude}
              longitude={existingSpot.longitude}
              name={existingSpot.name}
              spotId={existingSpot.id}
              color={
                checkedSpots.includes(existingSpot.id)
                  ? LeafletMarkerColorOptions.Green
                  : LeafletMarkerColorOptions.Blue
              }
              hoveredColor={LeafletMarkerColorOptions.Red}
            />
          ))}
      </MapContainerWrapper>

      <ExistingSpots customizations={existingSpotCustomizations} />
      <button onClick={() => toForecastPage()}>Compare Forecasts</button>
    </div>
  );
}
