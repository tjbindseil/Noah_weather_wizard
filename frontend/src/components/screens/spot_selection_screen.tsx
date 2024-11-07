import { useState, useCallback } from 'react';
import { NavBar } from '../nav_bar';
import { PostSpotInput, Spot } from 'ww-3-models-tjb';
import { Link, useNavigate } from 'react-router-dom';
import { ExistingSpots } from '../existing_spots/existing_spots';
import { CheckedExistingSpotExtension } from '../existing_spots/checked_existing_spot_extension';
import { FavoritedExistingSpotExtension } from '../existing_spots/favorite_existing_spot_extension';
import { MapContainerWrapper, LeafletMarkerColorOptions, SelectedSpot } from '../map_stuff';
import { HoveredSpot } from './spot_creation_screen';
import { useSpotService } from '../../services/spot_service';

export function SpotSelectionScreen() {
  const navigate = useNavigate();
  const spotService = useSpotService();

  const [checkedSpots, setCheckedSpots] = useState<number[]>([]);

  // so, when the row is hovered, the spot on the map is hovered
  // and vice versa (when spot is hovered, row is hovered)
  const [hoveredSpot, setHoveredSpot] = useState<HoveredSpot | undefined>(undefined);

  const toForecastPage = useCallback(() => {
    navigate('/forecast', { state: { selectedSpots: [checkedSpots] } });
  }, [checkedSpots, navigate]);

  const [existingSpots, setExistingSpots] = useState<Spot[]>([]);

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
      setCheckedSpots={setCheckedSpots}
    />
  ));

  existingSpotCustomizations.set('Favorited', (existingSpot: Spot) => (
    <FavoritedExistingSpotExtension existingSpot={existingSpot} />
  ));

  const title =
    'To create new spots, use the <Link to={/spot-creation}> Spot Creation Page</Link>' +
    'Once all desired spots are selected, click the compare button to compare their forecasts. Blue spots are' +
    'existing spots which are not selected for comparison, while green spots are selected for comparison.';
  return (
    <div className='MapWrapper'>
      <NavBar />
      <h2 title={title}>Select spots for which you would like a forecast.</h2>

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

// this and spot creation are mighty similar
// maybe:
// * my spots
// * search spots
// * favorite spots
