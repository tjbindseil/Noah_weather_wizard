import ForecastService from './forecast_service';
import MapService from './map_service';
import SpotService from './spot_service';
import UserService from './user_service';

export function GlobalServices({ children }: any) {
  return (
    <>
      <UserService>
        <MapService>
          <SpotService>
            <ForecastService>{children}</ForecastService>
          </SpotService>
        </MapService>
      </UserService>
    </>
  );
}
