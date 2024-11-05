import { useState, useCallback } from 'react';
import { NavBar } from '../nav_bar';
import { Spot } from 'ww-3-models-tjb';
import { Link, useNavigate } from 'react-router-dom';
import { ExistingSpots } from '../existing_spots/existing_spots';
import { CheckedExistingSpotExtension } from '../existing_spots/checked_existing_spot_extension';
import { FavoritedExistingSpotExtension } from '../existing_spots/favorite_existing_spot_extension';
import { LatLngInput } from '../lat_lng_input';
import { LatLng } from 'leaflet';
import { useMapService } from '../../services/map_service';
import { MapContainerWrapper, LeafletMarkerColorOptions, SelectedSpot } from '../map_stuff';
import { HoveredSpot } from './spot_creation_screen';

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
  const [hoveredSpot, setHoveredSpot] = useState<HoveredSpot | undefined>(undefined);

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
    <div className='wrapper'>
      <NavBar />
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
        hoveredSpot={hoveredSpot}
        setHoveredSpot={setHoveredSpot}
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
            hoveredSpot={hoveredSpot}
            setHoveredSpot={setHoveredSpot}
          />
        ))}
      </MapContainerWrapper>
    </div>
  );
}
