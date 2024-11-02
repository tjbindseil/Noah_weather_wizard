import React, { useState, useCallback } from 'react';
import { NavBar } from '../nav_bar';
import { SelectedSpot } from '../map_stuff/selected_spot';
import { DeleteSpotInput, PostSpotInput, Spot } from 'ww-3-models-tjb';
import { LeafletMarkerColorOptions } from '../map_stuff/marker_color';
import { useSpotService } from '../../services/spot_service';
import { UserStatus } from '../user_status';
import { MapContainerWrapper } from '../map_stuff/map_container_wrapper';
import { ExistingSpots } from '../existing_spots/existing_spots';
import { DeletableExistingSpotExtension } from '../existing_spots/deletable_existing_spot_extension';
import { MapClickController } from '../map_stuff/map_click_controller';
import { Link } from 'react-router-dom';
import { MapCenterController } from '../map_stuff/map_center_controller';
import { useMapService } from '../../services/map_service';
import { LatLng } from 'leaflet';

export function SpotCreationScreen() {
  const spotService = useSpotService();
  const mapService = useMapService();

  const longsPeak = {
    lat: 40.255014,
    long: -105.615115,
  };

  const [latitude, setLatitude] = useState(longsPeak.lat);
  const [longitude, setLongitude] = useState(longsPeak.long);
  const [name, setName] = useState('Longs Peak');

  const [desiredCenter, setDesiredCenter] = useState(
    new LatLng(mapService.getCenterLat(), mapService.getCenterLng()),
  );

  const [existingSpots, setExistingSpots] = useState<Spot[]>([]);
  const [toggleToRefreshExistingSpots, setToggleToRefreshExistingSpots] = useState(true);

  const [hoveredSpotId, setHoveredSpotId] = useState<number | undefined>(undefined);

  const saveSpotFunc = useCallback(
    async (selectedSpot: PostSpotInput) => {
      await spotService.createSpot(selectedSpot);
      setToggleToRefreshExistingSpots(!toggleToRefreshExistingSpots);
    },
    [toggleToRefreshExistingSpots, setToggleToRefreshExistingSpots, spotService],
  );

  const removeSpotFunc = useCallback(
    async (selectedSpot: DeleteSpotInput) => {
      await spotService.deleteSpot(selectedSpot);
      setToggleToRefreshExistingSpots(!toggleToRefreshExistingSpots);
    },
    [toggleToRefreshExistingSpots, setToggleToRefreshExistingSpots, spotService],
  );

  // TODO upon clicing on map, set the lat/long input values

  const spotCreationCustomizations = new Map<string, (existingSpot: Spot) => React.ReactNode>();
  spotCreationCustomizations.set('Checked', (existingSpot: Spot) => {
    return (
      <DeletableExistingSpotExtension existingSpot={existingSpot} removeSpotFunc={removeSpotFunc} />
    );
  });

  return (
    <div className='Home'>
      <NavBar />
      <UserStatus />
      <p>Create and save spots here.</p>
      <p>
        Either select a point on the map to have the latitude and longitude autopopulate, or enter
        them in manually.
      </p>
      <p>Then, name your spot and save it.</p>
      <p>
        Once all your spots are created, check out the
        <Link to={'/spot-selection'}> Spot Selection Page</Link> to select the spots you would like
        to compare.
      </p>
      <br />
      <p>
        Blue spots are spots that are already created, while a green spot is what is currently being
        created.
      </p>
      <br />

      <label htmlFor='latitude'>Latitude:</label>
      <input
        type='number'
        id='latitude'
        value={latitude}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setLatitude(parseFloat(event.target.value));
        }}
      />

      <label htmlFor='longitude'>Longitude:</label>
      <input
        type='number'
        id='longitude'
        value={longitude}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setLongitude(parseFloat(event.target.value));
        }}
      />

      <label htmlFor='name'>Name:</label>
      <input
        type='text'
        id='name'
        value={name}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setName(event.target.value);
        }}
      />

      <button
        onClick={async () => {
          await saveSpotFunc({ latitude, longitude, name });
        }}
      >
        Save Spot
      </button>

      <button
        onClick={async () => {
          setDesiredCenter(new LatLng(latitude, longitude));
        }}
      >
        Center Map
      </button>

      <ExistingSpots
        existingSpots={existingSpots}
        hoveredSpotId={hoveredSpotId}
        setHoveredSpotId={setHoveredSpotId}
        customizations={spotCreationCustomizations}
      />

      <MapContainerWrapper
        setExistingSpots={setExistingSpots}
        toggleToRefreshExistingSpots={toggleToRefreshExistingSpots}
      >
        {existingSpots.map((existingSpot) => (
          <SelectedSpot
            key={existingSpot.id}
            latitude={existingSpot.latitude}
            longitude={existingSpot.longitude}
            name={existingSpot.name}
            spotId={existingSpot.id}
            color={LeafletMarkerColorOptions.Blue}
            hoveredColor={LeafletMarkerColorOptions.Red}
            hoveredSpotId={hoveredSpotId}
            setHoveredSpotId={setHoveredSpotId}
          />
        ))}
        <MapClickController
          saveSelectedSpot={saveSpotFunc}
          color={LeafletMarkerColorOptions.Green}
        />
        <MapCenterController desiredCenter={desiredCenter} />
      </MapContainerWrapper>
    </div>
  );
}
