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
      console.log(`MapService.saveZoom @@ @@ zoom is: ${zoom}`);
      this.zoom = zoom;
      console.log(`MapService.saveZoom @@ @@ this.zoom is: ${this.zoom}`);
    },

    getZoom() {
      console.log(`getting zoom and zoom is: ${this.zoom}`);
      return this.zoom;
    },

    saveCenter(lat: number, lng: number) {
      // console.log(`saving center as: ${lat}, ${lng}`);
      this.centerLat = lat;
      this.centerLng = lng;
    },

    getCenterLat() {
      // console.log(`getting centerLat and centerLat is: ${this.centerLat}`);
      return this.centerLat;
    },

    getCenterLng() {
      // console.log(`getting centerLng and centerLng is: ${this.centerLng}`);
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
