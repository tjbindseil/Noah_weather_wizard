import SpotService from './spot_service';

export function GlobalServices({ children }: any) {
  return (
    <>
      <SpotService>{children}</SpotService>
    </>
  );
}
