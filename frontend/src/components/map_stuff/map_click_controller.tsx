import { LeafletEventHandlerFn } from 'leaflet';
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

  return popupOpen ? (
    <Marker position={[popupLat, popupLong]} eventHandlers={{ add: openPopup }}>
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
