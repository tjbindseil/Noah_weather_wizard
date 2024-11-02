import '../../App.css';
import { Spot } from 'ww-3-models-tjb';
import { CheckedExistingSpotExtension } from './checked_existing_spot_extension';
import { ExistingSpot } from './existing_spot';
import { ExistingSpotsHeader } from './header';

export interface ExistingSpotsProps {
  checkedSpots: number[];
  setCheckedSpots: (arg: number[]) => void;
  existingSpots: Spot[];
  hoveredSpotId: number | undefined;
  setHoveredSpotId: (arg: number | undefined) => void;
}

// need to pass in a map of:
// <
// string (ie extra column name)
// and
// function that returns a react element given... an existing spot and some other stuff?
//
// or, we don't have to get hella generic, and can just make a delete existing spots and a check existing spots and
// a favorite existing spots
//
// i like that best
//
// middle path

export const CheckedExistingSpots = ({
  checkedSpots,
  setCheckedSpots,
  existingSpots,
  hoveredSpotId,
  setHoveredSpotId,
}: ExistingSpotsProps) => {
  return (
    <>
      <h3>Existing Spots</h3>
      <table>
        <ExistingSpotsHeader extraColumns={['Selected']} />
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
                  <CheckedExistingSpotExtension
                    existingSpot={existingSpot}
                    checkedSpots={checkedSpots}
                    setCheckedSpots={setCheckedSpots}
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
