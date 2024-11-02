import { useState, useCallback } from 'react';
import { NavBar } from '../nav_bar';
import { SelectedSpot } from '../map_stuff/selected_spot';
import { Spot } from 'ww-3-models-tjb';
import { LeafletMarkerColorOptions } from '../map_stuff/marker_color';
import { UserStatus } from '../user_status';
import { useNavigate } from 'react-router-dom';
import { MapContainerWrapper } from '../map_stuff/map_container_wrapper';
import { ExistingSpots } from '../existing_spots/existing_spots';
import { CheckedExistingSpotExtension } from '../existing_spots/checked_existing_spot_extension';

export function SpotSelectionScreen() {
  const navigate = useNavigate();

  const [checkedSpots, setCheckedSpots] = useState<number[]>([]);

  // so, when the row is hovered, the spot on the map is hovered
  // and vice versa (when spot is hovered, row is hovered)
  const [hoveredSpotId, setHoveredSpotId] = useState<number | undefined>(undefined);

  const toForecastPage = useCallback(() => {
    navigate('/forecast', { state: { selectedSpots: [checkedSpots] } });
  }, [checkedSpots, navigate]);

  const [existingSpots, setExistingSpots] = useState<Spot[]>([]);

  const existingSpotCustomizations = new Map<string, (existingSpot: Spot) => React.ReactNode>();
  existingSpotCustomizations.set('Checked', (existingSpot: Spot) => {
    return (
      <CheckedExistingSpotExtension
        existingSpot={existingSpot}
        checkedSpots={checkedSpots}
        setCheckedSpots={setCheckedSpots}
      />
    );
  });

  return (
    <div className='Home'>
      <NavBar />
      <UserStatus />
      <p>Select spots for which you would like a forecast.</p>
      <p>
        To create new spots, use the{' '}
        <a href={'localhost:3000/spot-creation'}> Spot Creation Page</a>
      </p>
      <p>
        Once all desired spots are selected, click the compare button to compare their forecasts.
      </p>
      <br />
      <p>
        Blue spots are existing spots which are not selected for comparison, while green spots are
        selected for comparison.
      </p>
      <br />

      <ExistingSpots
        existingSpots={existingSpots}
        hoveredSpotId={hoveredSpotId}
        setHoveredSpotId={setHoveredSpotId}
        customizations={existingSpotCustomizations}
      />

      <button onClick={() => toForecastPage()}>Compare Forecasts</button>

      <MapContainerWrapper setExistingSpots={setExistingSpots} toggleToRefreshExistingSpots={true}>
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
            hoveredSpotId={hoveredSpotId}
            setHoveredSpotId={setHoveredSpotId}
          />
        ))}
      </MapContainerWrapper>
    </div>
  );
}