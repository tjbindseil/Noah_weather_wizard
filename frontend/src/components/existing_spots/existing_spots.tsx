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
      const tableContainer = document.querySelector('.ExistingSpots');
      const header = tableContainer?.querySelector('thead');
      const table = tableContainer?.querySelector('table');

      if (existingSpotRowElement && tableContainer && header && table) {
        const rowOffsetTop = existingSpotRowElement.offsetTop;
        const headerHeight = header.offsetHeight;
        table.scrollTop = rowOffsetTop - headerHeight;
      }
    }
  }, [hoveredSpot]);

  // TODO spread table accross full width
  return (
    <div className={'ExistingSpots'}>
      <table style={{ borderSpacing: 0 }}>
        <ExistingSpotsHeader extraColumns={extraColumnNames} />
        <tbody>
          {visibleSpots.map((visibleSpot) => {
            const style =
              visibleSpot.spot.id === hoveredSpot?.spotId ? { backgroundColor: 'red' } : {};

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
