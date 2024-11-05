import React, { useState, useCallback } from 'react';
import { NavBar } from '../nav_bar';
import { DeleteSpotInput, PostSpotInput, Spot } from 'ww-3-models-tjb';
import { useSpotService } from '../../services/spot_service';
import { ExistingSpots } from '../existing_spots/existing_spots';
import { CreatorExistingSpotExtension } from '../existing_spots/deletable_existing_spot_extension';
import { Link } from 'react-router-dom';
import { useMapService } from '../../services/map_service';
import { LatLng } from 'leaflet';
import { LatLngInput } from '../lat_lng_input';
import {
  MapContainerWrapper,
  LeafletMarkerColorOptions,
  MapClickController,
  SelectedSpot,
} from '../map_stuff';

export interface HoveredSpot {
  spotId: number;
  fromMap: boolean;
}

export function SpotCreationScreen() {
  const spotService = useSpotService();
  const mapService = useMapService();

  const [lat, setLat] = useState(mapService.getCenterLat());
  const [lng, setLng] = useState(mapService.getCenterLng());
  const [name, setName] = useState('');

  const [desiredCenter, setDesiredCenter] = useState(
    new LatLng(mapService.getCenterLat(), mapService.getCenterLng()),
  );

  const [existingSpots, setExistingSpots] = useState<Spot[]>([]);
  const [toggleToRefreshExistingSpots, setToggleToRefreshExistingSpots] = useState(true);

  const [hoveredSpotId, setHoveredSpotId] = useState<HoveredSpot | undefined>(undefined);

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
  spotCreationCustomizations.set('Creator', (existingSpot: Spot) => {
    return (
      <CreatorExistingSpotExtension existingSpot={existingSpot} removeSpotFunc={removeSpotFunc} />
    );
  });

  // TODO - turn into an info thing
  const title =
    'Either select a point on the map to have the latitude and longitude autopopulate, or enter them in manually. Then, name your spot and save it. Once all your spots are created, check out the LINK(Spot Selection Page) to select the spots you would like to compare. <br /> Blue spots are spots that are already created, while a green spot is what is currently being created.';

  return (
    <div className='wrapper'>
      <NavBar />
      <h2 title={title}>Create Spots {'&#x1F6C8'}</h2>

      {
        //
        // so, i'd like to move this in to map wrapper thing
        // then, place it on the top right corner of the map
        //
        // to do this, i need a
        //
      }

      {
        //       <LatLngInput
        //         lat={lat}
        //         setLat={setLat}
        //         lng={lng}
        //         setLng={setLng}
        //         name={name}
        //         setName={setName}
        //         setDesiredCenter={setDesiredCenter}
        //       />
        //
        //       <button
        //         onClick={async () => {
        //           await saveSpotFunc({ latitude: lat, longitude: lng, name });
        //         }}
        //       >
        //         Create Spot
        //       </button>
        //
      }
      <MapContainerWrapper
        setExistingSpots={setExistingSpots}
        toggleToRefreshExistingSpots={toggleToRefreshExistingSpots}
        desiredCenter={desiredCenter}
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
            hoveredSpot={hoveredSpotId}
            setHoveredSpot={setHoveredSpotId}
          />
        ))}
        <MapClickController
          saveSelectedSpot={saveSpotFunc}
          color={LeafletMarkerColorOptions.Green}
        />
      </MapContainerWrapper>

      <ExistingSpots
        existingSpots={existingSpots}
        hoveredSpot={hoveredSpotId}
        setHoveredSpot={setHoveredSpotId}
        customizations={spotCreationCustomizations}
      />
    </div>
  );
}
