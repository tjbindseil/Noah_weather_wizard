import React, { useState, useCallback } from 'react';
import { NavBar } from '../nav_bar';
import { DeleteSpotInput, PostSpotInput, Spot } from 'ww-3-models-tjb';
import { useSpotService } from '../../services/spot_service';
import { ExistingSpots } from '../existing_spots/existing_spots';
import { CreatorExistingSpotExtension } from '../existing_spots/deletable_existing_spot_extension';
import {
  MapContainerWrapper,
  LeafletMarkerColorOptions,
  MapClickController,
  SelectedSpot,
} from '../map_stuff';
import { Tooltip } from 'react-tooltip';

export interface HoveredSpot {
  spotId: number;
  fromMap: boolean;
}

export function SpotCreationScreen() {
  const spotService = useSpotService();

  const [existingSpots, setExistingSpots] = useState<Spot[]>(spotService.getExistingSpots());
  const setAndSaveExistingSpots = useCallback(
    (newExistingSpots: Spot[]) => {
      spotService.setExistingSpots(newExistingSpots);
      setExistingSpots(newExistingSpots);
    },
    [spotService, setExistingSpots],
  );

  const [toggleToRefreshExistingSpots, setToggleToRefreshExistingSpots] = useState(true);

  const [hoveredSpotId, setHoveredSpotId] = useState<HoveredSpot | undefined>(undefined);

  const saveSpotFunc = useCallback(
    async (selectedSpot: PostSpotInput) => {
      const ret = await spotService.createSpot(selectedSpot);
      setToggleToRefreshExistingSpots(!toggleToRefreshExistingSpots);
      return ret;
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

  const tooltipId = 'spot_creation_tooltip_id';
  const toolTipContent =
    '<p>Either select a point on the map to have the latitude and longitude autopopulate, or enter them in manually. Then, name your spot and save it. Once all your spots are created, check out the LINK(Spot Selection Page) to select the spots you would like to compare. <br /> Blue spots are spots that are already created, while a green spot is what is currently being created.</p>';

  return (
    <div className='MapWrapper'>
      <NavBar />
      <div style={{ zIndex: 200 }}>
        <Tooltip id={tooltipId} />
        <h2 data-tooltip-id={tooltipId} data-tooltip-html={toolTipContent}>
          <a>Create Spots</a>
        </h2>
      </div>

      <MapContainerWrapper
        setExistingSpots={setAndSaveExistingSpots}
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
