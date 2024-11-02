import { Spot } from 'ww-3-models-tjb';
import { ExistingSpot } from './existing_spot';
import { ExistingSpotsHeader } from './header';

export interface ExistingSpotsProps {
  existingSpots: Spot[];
  hoveredSpotId: number | undefined;
  setHoveredSpotId: (arg: number | undefined) => void;
  customizations: Map<string, (existingSpot: Spot) => React.ReactNode>; // column name to factory
}

export const ExistingSpots = ({
  existingSpots,
  hoveredSpotId,
  setHoveredSpotId,
  customizations,
}: ExistingSpotsProps) => {
  const extraColumnNames = Array.from(customizations.keys());

  return (
    <>
      <h3>Existing Spots</h3>
      <table>
        <ExistingSpotsHeader extraColumns={extraColumnNames} />
        <tbody>
          {existingSpots.map((existingSpot) => {
            const style = existingSpot.id === hoveredSpotId ? { backgroundColor: 'yellow' } : {};

            const extraColumns = Array.from(customizations.values()).map((extensionFactory) =>
              extensionFactory(existingSpot),
            );

            return (
              <>
                <tr
                  onMouseOver={() => {
                    setHoveredSpotId(existingSpot.id);
                  }}
                  onMouseOut={() => {
                    setHoveredSpotId(undefined);
                  }}
                  style={style}
                >
                  <ExistingSpot existingSpot={existingSpot} />
                  {extraColumns}
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
