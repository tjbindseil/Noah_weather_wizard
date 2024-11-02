import Contextualizer from './contextualizer';
import ProvidedServices from './provided_services';
import Cookies from 'js-cookie';

const defaultZoom = 13;
const longsPeakLatLng = {
  lat: 40.255014,
  lng: -105.615115,
};

const ZOOM_KEY = 'ZOOM_KEY';
const CENTER_LAT_KEY = 'CENTER_LAT_KEY';
const CENTER_LNG_KEY = 'CENTER_LNG_KEY';

export interface IMapService {
  saveZoom: (zoom: number) => void;
  getZoom: () => number;
  saveCenter: (lat: number, lng: number) => void;
  getCenterLat: () => number;
  getCenterLng: () => number;
}

export const MapServiceContext = Contextualizer.createContext(ProvidedServices.MapService);
export const useMapService = (): IMapService =>
  Contextualizer.use<IMapService>(ProvidedServices.MapService);

/* eslint-disable  @typescript-eslint/no-explicit-any */
const MapService = ({ children }: any) => {
  const mapService = {
    zoom: Number(Cookies.get(ZOOM_KEY)) ?? defaultZoom,
    centerLat: Number(Cookies.get(CENTER_LAT_KEY)) ?? longsPeakLatLng.lat,
    centerLng: Number(Cookies.get(CENTER_LNG_KEY)) ?? longsPeakLatLng.lng,

    saveZoom(zoom: number) {
      this.zoom = zoom;
      this.saveNumberToCookies(ZOOM_KEY, this.zoom);
    },

    getZoom() {
      return this.zoom;
    },

    saveCenter(lat: number, lng: number) {
      this.centerLat = lat;
      this.centerLng = lng;
      this.saveNumberToCookies(CENTER_LAT_KEY, this.centerLat);
      this.saveNumberToCookies(CENTER_LNG_KEY, this.centerLng);
    },

    getCenterLat() {
      return this.centerLat;
    },

    getCenterLng() {
      return this.centerLng;
    },

    saveNumberToCookies(key: string, num: number) {
      Cookies.set(key, num.toString());
    },
  };

  return (
    <>
      <MapServiceContext.Provider value={mapService}>{children}</MapServiceContext.Provider>
    </>
  );
};

export default MapService;
