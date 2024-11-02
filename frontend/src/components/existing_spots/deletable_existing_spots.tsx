import '../../App.css';
import { DeleteSpotInput, Spot } from 'ww-3-models-tjb';
import { DeletableExistingSpotExtension } from './deletable_existing_spot_extension';
import { ExistingSpot } from './existing_spot';
import { ExistingSpotsHeader } from './header';

export interface DeletableExistingSpotsProps {
  existingSpots: Spot[];
  removeSpotFunc: (arg: DeleteSpotInput) => void;
  hoveredSpotId: number | undefined;
  setHoveredSpotId: (arg: number | undefined) => void;
}

export const DeletableExistingSpots = ({
  existingSpots,
  removeSpotFunc,
  hoveredSpotId,
  setHoveredSpotId,
}: DeletableExistingSpotsProps) => {
  return (
    <>
      <h3>Existing Spots</h3>
      <table>
        <ExistingSpotsHeader extraColumns={['Delete']} />
        <tbody>
          {existingSpots.map((existingSpot) => {
            const style = existingSpot.id === hoveredSpotId ? { backgroundColor: 'yellow' } : {};
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
                  <DeletableExistingSpotExtension
                    existingSpot={existingSpot}
                    removeSpotFunc={removeSpotFunc}
                  />
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
