import { useState, useCallback } from 'react';
import { NavBar } from '../nav_bar';
import { SelectedSpot } from '../map_stuff/selected_spot';
import { Spot } from 'ww-3-models-tjb';
import { LeafletMarkerColorOptions } from '../map_stuff/marker_color';
import { UserStatus } from '../user_status';
import { useNavigate } from 'react-router-dom';
import { MapContainerWrapper } from '../map_stuff/map_container_wrapper';

export function SpotSelectionScreen() {
  const navigate = useNavigate();

  const [checkedSpots, setCheckedSpots] = useState<number[]>([]);

  const toForecastPage = useCallback(() => {
    navigate('/forecast', { state: { selectedSpots: [checkedSpots] } });
  }, [checkedSpots, navigate]);

  const [existingSpots, setExistingSpots] = useState<Spot[]>([]);

  return (
    <div className='Home'>
      <NavBar />
      <UserStatus />
      <p>Select spots for which you would like a forecast.</p>
      <p>
        To create new spots, use the{' '}
        <a href={'localhost:3000/spot-creation'}> Spot Creation Page</a>
      </p>
      <p>
        Once all desired spots are selected, click the compare button to compare their forecasts.
      </p>
      <br />
      <p>
        Blue spots are existing spots which are not selected for comparison, while green spots are
        selected for comparison.
      </p>
      <br />

      <h3>Existing Spots</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Selected</th>
          </tr>
        </thead>
        <tbody>
          {existingSpots.map((existingSpot) => (
            <>
              <tr>
                <td>{existingSpot.name}</td>
                <td>{existingSpot.latitude}</td>
                <td>{existingSpot.longitude}</td>
                <td>
                  <input
                    type='checkbox'
                    id={existingSpot.id.toString()}
                    name='selected'
                    checked={!!checkedSpots.includes(existingSpot.id)}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      checkedSpots.includes(Number(event.target.id))
                        ? checkedSpots.splice(
                            checkedSpots.findIndex((spotId) => spotId === Number(event.target.id)),
                            1,
                          )
                        : checkedSpots.push(Number(event.target.id));

                      setCheckedSpots([...checkedSpots]);
                    }}
                  />
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>

      <button onClick={() => toForecastPage()}>Compare Forecasts</button>

      <MapContainerWrapper setExistingSpots={setExistingSpots} toggleToRefreshExistingSpots={true}>
        {existingSpots.map((existingSpot) => (
          <SelectedSpot
            key={existingSpot.id}
            latitude={existingSpot.latitude}
            longitude={existingSpot.longitude}
            name={existingSpot.name}
            color={
              checkedSpots.includes(existingSpot.id)
                ? LeafletMarkerColorOptions.Green
                : LeafletMarkerColorOptions.Blue
            }
          />
        ))}
      </MapContainerWrapper>
    </div>
  );
}
