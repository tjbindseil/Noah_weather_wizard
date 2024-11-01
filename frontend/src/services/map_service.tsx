import Contextualizer from './contextualizer';
import ProvidedServices from './provided_services';

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
    zoom: 13,
    centerLat: 40.255014,
    centerLng: -105.615115,

    saveZoom(zoom: number) {
      this.zoom = zoom;
    },

    getZoom() {
      return this.zoom;
    },

    saveCenter(lat: number, lng: number) {
      this.centerLat = lat;
      this.centerLng = lng;
    },

    getCenterLat() {
      return this.centerLat;
    },

    getCenterLng() {
      return this.centerLng;
    },
  };

  return (
    <>
      <MapServiceContext.Provider value={mapService}>{children}</MapServiceContext.Provider>
    </>
  );
};

export default MapService;
