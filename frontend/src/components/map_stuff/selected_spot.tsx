import { Marker, Popup } from 'react-leaflet';

export interface SelectedSpotProps {
  latitude: number;
  longitude: number;
  name: string;
}

export function SelectedSpot(props: SelectedSpotProps) {
  return (
    <Marker key={props.name} position={[props.latitude, props.longitude]}>
      <Popup key={props.name}>{props.name}</Popup>
    </Marker>
  );
}
