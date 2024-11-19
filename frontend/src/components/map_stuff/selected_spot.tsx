import { Marker, Popup } from 'react-leaflet';
import { HoveredSpot } from '../screens/spot_creation_screen';
import { LeafletMarkerColorOptions, makeColoredIcon } from './marker_color';

export interface SelectedSpotProps {
  latitude: number;
  longitude: number;
  name: string;
  spotId: number;
  color: LeafletMarkerColorOptions;
  hoveredColor: LeafletMarkerColorOptions;
  hoveredSpot: HoveredSpot | undefined;
  setHoveredSpot: (arg: HoveredSpot | undefined) => void;
}

export function SelectedSpot(props: SelectedSpotProps) {
  const coloredIcon =
    props.spotId === props.hoveredSpot?.spotId
      ? makeColoredIcon(props.hoveredColor)
      : makeColoredIcon(props.color);

  return (
    <Marker
      eventHandlers={{
        mouseover: () => {
          // TODO maybe delay a split second before scrolling table
          props.setHoveredSpot({ spotId: props.spotId, fromMap: true });
        },
        mouseout: () => {
          props.setHoveredSpot(undefined);
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
