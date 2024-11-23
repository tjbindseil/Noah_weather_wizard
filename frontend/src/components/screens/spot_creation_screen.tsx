import React from 'react';
import { NavBar } from '../nav_bar';
import { Spot } from 'ww-3-models-tjb';
import { ExistingSpots } from '../existing_spots/existing_spots';
import { CreatorExistingSpotExtension } from '../existing_spots/deletable_existing_spot_extension';
import {
  MapContainerWrapper,
  LeafletMarkerColorOptions,
  MapClickController,
  SelectedSpot,
} from '../map_stuff';
import { Tooltip } from 'react-tooltip';
import { useAppSelector } from '../../app/hooks';

export function SpotCreationScreen() {
  const visibleSpots = useAppSelector((state) => state.visibleSpots.visibleSpots);

  const spotCreationCustomizations = new Map<string, (existingSpot: Spot) => React.ReactNode>();
  spotCreationCustomizations.set('Creator', (existingSpot: Spot) => {
    return <CreatorExistingSpotExtension existingSpot={existingSpot} />;
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

      <MapContainerWrapper>
        {visibleSpots
          .map((visibleSpots) => visibleSpots.spot)
          .map((existingSpot) => (
            <SelectedSpot
              key={existingSpot.id}
              latitude={existingSpot.latitude}
              longitude={existingSpot.longitude}
              name={existingSpot.name}
              spotId={existingSpot.id}
              color={LeafletMarkerColorOptions.Blue}
              hoveredColor={LeafletMarkerColorOptions.Red}
            />
          ))}
        <MapClickController color={LeafletMarkerColorOptions.Green} />
      </MapContainerWrapper>

      <ExistingSpots customizations={spotCreationCustomizations} />
    </div>
  );
}
