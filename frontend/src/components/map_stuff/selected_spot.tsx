import { Marker, Popup } from 'react-leaflet';
import { LeafletMarkerColorOptions, makeColoredIcon } from './marker_color';

export interface SelectedSpotProps {
  latitude: number;
  longitude: number;
  name: string;
  spotId: number;
  color: LeafletMarkerColorOptions;
  hoveredColor: LeafletMarkerColorOptions;
  hoveredSpotId: number | undefined;
  setHoveredSpotId: (arg: number | undefined) => void;
}

export function SelectedSpot(props: SelectedSpotProps) {
  const coloredIcon =
    props.spotId === props.hoveredSpotId
      ? makeColoredIcon(props.hoveredColor)
      : makeColoredIcon(props.color);

  return (
    <Marker
      eventHandlers={{
        mouseover: () => {
          props.setHoveredSpotId(props.spotId);
          console.log('onMouseEnter');
        },
        mouseout: () => {
          props.setHoveredSpotId(undefined);
          console.log('onMouseLeave');
        },
      }}
      key={props.name}
      position={[props.latitude, props.longitude]}
      icon={coloredIcon}
    >
      <Popup key={props.name}>{props.name}</Popup>
    </Marker>
  );
}
