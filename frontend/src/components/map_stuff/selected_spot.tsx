import { Marker, Popup } from 'react-leaflet';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { clearHoveredSpot, setHoveredSpot, VisibleSpot } from '../../app/visible_spots_reducer';
import { LeafletMarkerColorOptions, makeColoredIcon } from './marker_color';

export interface SelectedSpotProps {
  hoveredColor: LeafletMarkerColorOptions;
  visibleSpot: VisibleSpot;
  color: LeafletMarkerColorOptions;
}

export function SelectedSpot(props: SelectedSpotProps) {
  const dispatch = useAppDispatch();
  const hoveredSpot = useAppSelector((state) => state.visibleSpots.hoveredSpot);

  const coloredIcon =
    props.visibleSpot.spot.id === hoveredSpot.spotId
      ? makeColoredIcon(props.hoveredColor)
      : makeColoredIcon(props.color);

  return (
    <Marker
      eventHandlers={{
        mouseover: () => {
          // TODO maybe delay a split second before scrolling table
          dispatch(setHoveredSpot({ spotId: props.visibleSpot.spot.id, fromMap: true }));
        },
        mouseout: () => {
          dispatch(clearHoveredSpot());
        },
      }}
      key={props.visibleSpot.spot.name}
      position={[props.visibleSpot.spot.latitude, props.visibleSpot.spot.longitude]}
      icon={coloredIcon}
    >
      <Popup key={props.visibleSpot.spot.name}>{props.visibleSpot.spot.name}</Popup>
    </Marker>
  );
}
