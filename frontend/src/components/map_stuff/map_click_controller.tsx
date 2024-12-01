import { LeafletEventHandlerFn } from 'leaflet';
import { useState } from 'react';
import { Popup, Marker, useMapEvent } from 'react-leaflet';
import { useSpotService } from '../../services/spot_service';
import { LeafletMarkerColorOptions, makeColoredIcon } from './marker_color';

export interface MapClickControllerProps {
  color: LeafletMarkerColorOptions;
}

export function MapClickController({ color }: MapClickControllerProps) {
  const spotService = useSpotService();

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
          disabled={popupName === ''}
          onClick={async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            await spotService.createSpot({
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
