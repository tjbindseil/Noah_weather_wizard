import { Icon } from 'leaflet';

export enum LeafletMarkerColorOptions {
  Blue = 'blue',
  Gold = 'gold',
  Red = 'red',
  Green = 'green',
  Orange = 'orange',
  Yellow = 'yellow',
  Violet = 'violet',
  Grey = 'grey',
  Black = 'black',
}

export const makeColoredIcon = (color: LeafletMarkerColorOptions) =>
  new Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
