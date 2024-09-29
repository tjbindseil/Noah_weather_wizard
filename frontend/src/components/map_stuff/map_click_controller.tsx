import { Icon, LeafletEventHandlerFn } from 'leaflet';
import { useState } from 'react';
import { Popup, Marker, useMapEvent } from 'react-leaflet';
import { SelectedSpotProps } from './selected_spot';

export interface MapClickControllerProps {
  saveSelectedSpot: (selectedSpot: SelectedSpotProps) => void;
}

export function MapClickController({ saveSelectedSpot }: MapClickControllerProps) {
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupLat, setPopupLat] = useState(0);
  const [popupLong, setPopupLong] = useState(0);
  const [popupName, setPopupName] = useState('');

  useMapEvent('click', (e) => {
    setPopupOpen(true);
    setPopupLat(e.latlng.lat);
    setPopupLong(e.latlng.lng);
  });

  const openPopup: LeafletEventHandlerFn = (e) => {
    e.target.openPopup();
  };

  const greenIcon = new Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return popupOpen ? (
    <Marker position={[popupLat, popupLong]} icon={greenIcon} eventHandlers={{ add: openPopup }}>
      <Popup>
        <label htmlFor='popupName'>Name:</label>
        <input
          type='text'
          id='popupName'
          value={popupName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPopupName(event.target.value);
          }}
        />
        <button
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            saveSelectedSpot({ latitude: popupLat, longitude: popupLong, name: popupName });
            setPopupOpen(false);
            event.stopPropagation();
          }}
        >
          Save Spot
        </button>
      </Popup>
    </Marker>
  ) : (
    <></>
  );
}
