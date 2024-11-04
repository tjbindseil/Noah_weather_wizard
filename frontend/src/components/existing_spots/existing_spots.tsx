import { useEffect, useRef } from 'react';
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
  const tableRef = useRef<HTMLTableElement>(null);

  const extraColumnNames = Array.from(customizations.keys());

  const makeExistingSpotRowId = (existingSpotId: number) => `existing_spot_id_${existingSpotId}`;

  useEffect(() => {
    const handleScroll = () => {
      console.log('@@ @@ @@');
      setHoveredSpotId(undefined);
    };

    if (tableRef.current) {
      tableRef.current.addEventListener('scroll', handleScroll);
    } else {
      console.log('ELSE');
    }

    return () => {
      if (tableRef.current) {
        tableRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    // interesting, causes difficulty scrolling
    // maybe, on scroll, clear hovered spot
    if (hoveredSpotId) {
      const existingSpotRowId = makeExistingSpotRowId(hoveredSpotId);
      const existingSpotRowElement = document.getElementById(existingSpotRowId);
      existingSpotRowElement?.scrollIntoView();
    }
  }, [hoveredSpotId]);

  return (
    <div className={'ExistingSpots'}>
      <p style={{ margin: 2 }}>
        <em>Existing Spots</em>
      </p>
      <table ref={tableRef}>
        <ExistingSpotsHeader extraColumns={extraColumnNames} />
        <tbody>
          {existingSpots.map((existingSpot) => {
            const style = existingSpot.id == hoveredSpotId ? { backgroundColor: 'yellow' } : {};

            const extraColumns = Array.from(customizations.values()).map((extensionFactory) =>
              extensionFactory(existingSpot),
            );

            return (
              <tr
                key={existingSpot.id}
                id={makeExistingSpotRowId(existingSpot.id)}
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
