import { useState, useCallback } from 'react';
import { NavBar } from '../nav_bar';
import { SelectedSpot } from '../map_stuff/selected_spot';
import { Spot } from 'ww-3-models-tjb';
import { LeafletMarkerColorOptions } from '../map_stuff/marker_color';
import { UserStatus } from '../user_status';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainerWrapper } from '../map_stuff/map_container_wrapper';
import { ExistingSpots } from '../existing_spots/existing_spots';
import { CheckedExistingSpotExtension } from '../existing_spots/checked_existing_spot_extension';
import { FavoritedExistingSpotExtension } from '../existing_spots/favorite_existing_spot_extension';
import { LatLngInput } from '../lat_lng_input';
import { LatLng } from 'leaflet';
import { useMapService } from '../../services/map_service';

export function SpotSelectionScreen() {
  const navigate = useNavigate();
  const mapService = useMapService();

  const [lat, setLat] = useState(mapService.getCenterLat());
  const [lng, setLng] = useState(mapService.getCenterLng());
  const [name, setName] = useState('');

  const [desiredCenter, setDesiredCenter] = useState(
    new LatLng(mapService.getCenterLat(), mapService.getCenterLng()),
  );

  const [checkedSpots, setCheckedSpots] = useState<number[]>([]);

  // so, when the row is hovered, the spot on the map is hovered
  // and vice versa (when spot is hovered, row is hovered)
  const [hoveredSpotId, setHoveredSpotId] = useState<number | undefined>(undefined);

  const toForecastPage = useCallback(() => {
    navigate('/forecast', { state: { selectedSpots: [checkedSpots] } });
  }, [checkedSpots, navigate]);

  const [existingSpots, setExistingSpots] = useState<Spot[]>([]);

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

  return (
    <div className='Home'>
      <NavBar />
      <UserStatus />
      <p>Select spots for which you would like a forecast.</p>
      <p>
        To create new spots, use the <Link to={'/spot-creation'}> Spot Creation Page</Link>
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

      <LatLngInput
        lat={lat}
        setLat={setLat}
        lng={lng}
        setLng={setLng}
        name={name}
        setName={setName}
        setDesiredCenter={setDesiredCenter}
      />

      <ExistingSpots
        existingSpots={existingSpots}
        hoveredSpotId={hoveredSpotId}
        setHoveredSpotId={setHoveredSpotId}
        customizations={existingSpotCustomizations}
      />

      <button onClick={() => toForecastPage()}>Compare Forecasts</button>

      <MapContainerWrapper
        setExistingSpots={setExistingSpots}
        toggleToRefreshExistingSpots={true}
        desiredCenter={desiredCenter}
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
            hoveredSpotId={hoveredSpotId}
            setHoveredSpotId={setHoveredSpotId}
          />
        ))}
      </MapContainerWrapper>
    </div>
  );
}
