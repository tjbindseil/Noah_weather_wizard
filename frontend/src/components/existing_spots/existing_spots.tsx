import { useEffect } from 'react';
import { Spot } from 'ww-3-models-tjb';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { clearHoveredSpot, setHoveredSpot } from '../../app/visible_spots_reducer';
import { ExistingSpot } from './existing_spot';
import { ExistingSpotsHeader } from './header';

export interface ExistingSpotsProps {
  customizations: Map<string, (existingSpot: Spot) => React.ReactNode>; // column name to factory
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
          {visibleSpots
            .map((visibleSpot) => visibleSpot.spot)
            .map((existingSpot) => {
              const style =
                existingSpot.id === hoveredSpot?.spotId ? { backgroundColor: 'yellow' } : {};

              const extraColumns = Array.from(customizations.values()).map((extensionFactory) =>
                extensionFactory(existingSpot),
              );

              return (
                <tr
                  key={existingSpot.id}
                  id={makeExistingSpotRowId(existingSpot.id)}
                  onMouseOver={() => {
                    dispatch(setHoveredSpot({ spotId: existingSpot.id, fromMap: false }));
                  }}
                  onMouseOut={() => {
                    dispatch(clearHoveredSpot());
                  }}
                  style={style}
                >
                  <ExistingSpot existingSpot={existingSpot} />
                  {extraColumns}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};
