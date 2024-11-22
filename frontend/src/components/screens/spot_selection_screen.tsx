import { useState, useCallback, useEffect } from 'react';
import { NavBar } from '../nav_bar';
import { PostSpotInput, Spot } from 'ww-3-models-tjb';
import { useNavigate } from 'react-router-dom';
import { ExistingSpots } from '../existing_spots/existing_spots';
import { CheckedExistingSpotExtension } from '../existing_spots/checked_existing_spot_extension';
import { FavoritedExistingSpotExtension } from '../existing_spots/favorite_existing_spot_extension';
import { MapContainerWrapper, LeafletMarkerColorOptions, SelectedSpot } from '../map_stuff';
import { HoveredSpot } from './spot_creation_screen';
import { useSpotService } from '../../services/spot_service';

export function SpotSelectionScreen() {
  const navigate = useNavigate();
  const spotService = useSpotService();

  const [checkedSpots, setCheckedSpots] = useState<number[]>(spotService.getCheckedSpots());
  const setAndSaveCheckedSpots = useCallback(
    (newCheckedSpots: number[]) => {
      spotService.setCheckedSpots(newCheckedSpots);
      setCheckedSpots(newCheckedSpots);
    },
    [spotService, setCheckedSpots],
  );

  // so, when the row is hovered, the spot on the map is hovered
  // and vice versa (when spot is hovered, row is hovered)
  const [hoveredSpot, setHoveredSpot] = useState<HoveredSpot | undefined>(undefined);

  const toForecastPage = useCallback(() => {
    navigate('/forecast', { state: { selectedSpots: [checkedSpots] } });
  }, [checkedSpots, navigate]);

  // really these are existing spots in view
  const [existingSpots, setExistingSpots] = useState<Spot[]>([]);

  useEffect(() => {
    console.log('@@ @@ determining if checked spots should be trimmed');
    const existingSpotIds = existingSpots.map((s) => s.id);
    let recalculateCheckedSpots = false;
    checkedSpots.forEach(
      (checkedSpot) =>
        (recalculateCheckedSpots =
          recalculateCheckedSpots || !existingSpotIds.includes(checkedSpot)),
    );

    if (recalculateCheckedSpots) {
      console.log('@@ @@ checked spots should be trimmed');
      const newCheckedSpots: number[] = [];
      checkedSpots.forEach((checkedSpotId) => {
        if (existingSpotIds.includes(checkedSpotId)) {
          newCheckedSpots.push(checkedSpotId);
        }
      });
      setAndSaveCheckedSpots(newCheckedSpots);
    }
  }, [existingSpots, checkedSpots, setAndSaveCheckedSpots]);
  // }, []);

  const [toggleToRefreshExistingSpots, setToggleToRefreshExistingSpots] = useState(true);
  const saveSpotFunc = useCallback(
    async (selectedSpot: PostSpotInput) => {
      const ret = await spotService.createSpot(selectedSpot);
      setToggleToRefreshExistingSpots(!toggleToRefreshExistingSpots);
      return ret;
    },
    [toggleToRefreshExistingSpots, setToggleToRefreshExistingSpots, spotService],
  );

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

      <MapContainerWrapper
        setExistingSpots={setExistingSpots}
        saveSpotFunc={saveSpotFunc}
        toggleToRefreshExistingSpots={toggleToRefreshExistingSpots}
      >
        {existingSpots.map((existingSpot) => (
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
            hoveredSpot={hoveredSpot}
            setHoveredSpot={setHoveredSpot}
          />
        ))}
      </MapContainerWrapper>

      <ExistingSpots
        existingSpots={existingSpots}
        hoveredSpot={hoveredSpot}
        setHoveredSpot={setHoveredSpot}
        customizations={existingSpotCustomizations}
      />
      <button onClick={() => toForecastPage()}>Compare Forecasts</button>
    </div>
  );
}
