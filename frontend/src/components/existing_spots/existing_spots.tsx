import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { clearHoveredSpot, setHoveredSpot, VisibleSpot } from '../../app/visible_spots_reducer';
import { ExistingSpot } from './existing_spot';
import { ExistingSpotsHeader } from './header';

export interface ExistingSpotsProps {
  customizations: Map<string, (visibleSpot: VisibleSpot) => React.ReactNode>; // column name to factory
}

export const ExistingSpots = ({ customizations }: ExistingSpotsProps) => {
  const dispatch = useAppDispatch();
  const visibleSpots = useAppSelector((state) => state.visibleSpots.visibleSpots);
  const hoveredSpot = useAppSelector((state) => state.visibleSpots.hoveredSpot);

  const extraColumnNames = Array.from(customizations.keys());

  const makeExistingSpotRowId = (existingSpotId: number) => `existing_spot_id_${existingSpotId}`;

  useEffect(() => {
    if (hoveredSpot && hoveredSpot.fromMap) {
      const existingSpotRowElement = document.getElementById(
        makeExistingSpotRowId(hoveredSpot.spotId),
      );
      existingSpotRowElement?.scrollIntoView();
    }
  }, [hoveredSpot]);

  return (
    <div className={'ExistingSpots'}>
      <h4 style={{ margin: 4 }}>Existing Spots</h4>
      <table>
        <ExistingSpotsHeader extraColumns={extraColumnNames} />
        <tbody>
          {visibleSpots.map((visibleSpot) => {
            const style =
              visibleSpot.spot.id === hoveredSpot?.spotId ? { backgroundColor: 'yellow' } : {};

            const extraColumns = Array.from(customizations.values()).map((extensionFactory) =>
              extensionFactory(visibleSpot),
            );

            return (
              <tr
                key={visibleSpot.spot.id}
                id={makeExistingSpotRowId(visibleSpot.spot.id)}
                onMouseOver={() => {
                  dispatch(setHoveredSpot({ spotId: visibleSpot.spot.id, fromMap: false }));
                }}
                onMouseOut={() => {
                  dispatch(clearHoveredSpot());
                }}
                style={style}
              >
                <ExistingSpot spot={visibleSpot.spot} />
                {extraColumns}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
