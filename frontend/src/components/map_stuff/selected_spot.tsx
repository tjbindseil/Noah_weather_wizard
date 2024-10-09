import { Marker, Popup } from 'react-leaflet';
import { LeafletMarkerColorOptions, makeColoredIcon } from './marker_color';

export interface SelectedSpotProps {
  latitude: number;
  longitude: number;
  name: string;
  color: LeafletMarkerColorOptions;
}

export function SelectedSpot(props: SelectedSpotProps) {
  const coloredIcon = makeColoredIcon(props.color);
  return (
    <Marker key={props.name} position={[props.latitude, props.longitude]} icon={coloredIcon}>
      <Popup key={props.name}>{props.name}</Popup>
    </Marker>
  );
}
