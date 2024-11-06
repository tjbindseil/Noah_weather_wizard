import { LeafletEventHandlerFn } from 'leaflet';
import { useState } from 'react';
import { Popup, Marker, useMapEvent } from 'react-leaflet';
import { PostSpotInput, PostSpotOutput } from 'ww-3-models-tjb';
import { LeafletMarkerColorOptions, makeColoredIcon } from './marker_color';

export interface MapClickControllerProps {
  saveSelectedSpot: (selectedSpot: PostSpotInput) => Promise<PostSpotOutput>;
  color: LeafletMarkerColorOptions;
}

export function MapClickController({ saveSelectedSpot, color }: MapClickControllerProps) {
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupLat, setPopupLat] = useState(0);
  const [popupLong, setPopupLong] = useState(0);
  const [popupName, setPopupName] = useState('');

  useMapEvent('click', (e) => {
    console.log('@@@@@@@@ HERERERERERE');
    setPopupOpen(true);
    setPopupLat(e.latlng.lat);
    setPopupLong(e.latlng.lng);
  });

  const openPopup: LeafletEventHandlerFn = (e) => {
    e.target.openPopup();
  };

  const coloredIcon = makeColoredIcon(color);

  return popupOpen ? (
    <Marker position={[popupLat, popupLong]} icon={coloredIcon} eventHandlers={{ add: openPopup }}>
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
          onClick={async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            await saveSelectedSpot({
              latitude: popupLat,
              longitude: popupLong,
              name: popupName,
            });
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
