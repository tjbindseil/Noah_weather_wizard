import { useEffect } from 'react';
import { Spot } from 'ww-3-models-tjb';
import { HoveredSpot } from '../screens/spot_creation_screen';
import { ExistingSpot } from './existing_spot';
import { ExistingSpotsHeader } from './header';

export interface ExistingSpotsProps {
  existingSpots: Spot[];
  hoveredSpot: HoveredSpot | undefined;
  setHoveredSpot: (arg: HoveredSpot | undefined) => void;
  customizations: Map<string, (existingSpot: Spot) => React.ReactNode>; // column name to factory
}

export const ExistingSpots = ({
  existingSpots,
  hoveredSpot,
  setHoveredSpot,
  customizations,
}: ExistingSpotsProps) => {
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
      <p style={{ margin: 2 }}>
        <em>Existing Spots</em>
      </p>
      <table>
        <ExistingSpotsHeader extraColumns={extraColumnNames} />
        <tbody>
          {existingSpots.map((existingSpot) => {
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
                  setHoveredSpot({ spotId: existingSpot.id, fromMap: false });
                }}
                onMouseOut={() => {
                  setHoveredSpot(undefined);
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
