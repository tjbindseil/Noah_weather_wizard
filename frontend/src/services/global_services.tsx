import ForecastService from './forecast_service';
import SpotService from './spot_service';
import UserService from './user_service';

export function GlobalServices({ children }: any) {
  return (
    <>
      <UserService>
        <SpotService>
          <ForecastService>{children}</ForecastService>
        </SpotService>
      </UserService>
    </>
  );
}
