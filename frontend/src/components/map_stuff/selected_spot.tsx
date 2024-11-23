import { Marker, Popup } from 'react-leaflet';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { clearHoveredSpot, setHoveredSpot } from '../../app/visible_spots_reducer';
import { LeafletMarkerColorOptions, makeColoredIcon } from './marker_color';

export interface SelectedSpotProps {
  latitude: number;
  longitude: number;
  name: string;
  spotId: number;
  color: LeafletMarkerColorOptions;
  hoveredColor: LeafletMarkerColorOptions;
}

export function SelectedSpot(props: SelectedSpotProps) {
  const dispatch = useAppDispatch();
  const hoveredSpot = useAppSelector((state) => state.visibleSpots.hoveredSpot);

  const coloredIcon =
    props.spotId === hoveredSpot.spotId
      ? makeColoredIcon(props.hoveredColor)
      : makeColoredIcon(props.color);

  return (
    <Marker
      eventHandlers={{
        mouseover: () => {
          // TODO maybe delay a split second before scrolling table
          dispatch(setHoveredSpot({ spotId: props.spotId, fromMap: true }));
        },
        mouseout: () => {
          dispatch(clearHoveredSpot());
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
