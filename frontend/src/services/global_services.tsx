import ForecastService from './forecast_service';
import SpotService from './spot_service';

export function GlobalServices({ children }: any) {
  return (
    <>
      <SpotService>
        <ForecastService>{children}</ForecastService>
      </SpotService>
    </>
  );
}
