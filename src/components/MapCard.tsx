import { useState, useEffect, useRef } from 'react';

const BASE_FACTOR = 3887.053672855942;
const BASE_ZOOM   = 0;

function buildSrc(zoom: number) {
  const factor = BASE_FACTOR / Math.pow(2, zoom);
  return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d${factor}!2d80.17816267507753!3d13.032254087288711!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5266d11f9ca625%3A0xf77d1733be7b5b74!2sSRM%20Institute%20Of%20Science%20And%20Technology!5e0!3m2!1sen!2sin!4v1782686145388!5m2!1sen!2sin`;
}

export default function MapCard() {
  const [zoom, setZoom]           = useState(BASE_ZOOM);

  return (
    <div className="map-card">
      {/* Dark-themed iframe */}
      <iframe
        src={buildSrc(zoom)}
        width="100%"
        height="100%"
        style={{
          border: 0,
          filter: 'invert(0.9) hue-rotate(180deg) contrast(1.2) brightness(0.9)',
          opacity: 0.85,
          width:  'calc(100% + 140px)',
          height: 'calc(100% + 140px)',
          position: 'absolute',
          top: '-70px',
          left: '-70px',
        }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      {/* Zoom controls */}
      <div className="map-camera-controls">
        <button
          className="map-control-btn"
          title="Zoom In"
          aria-label="Zoom In"
          onClick={() => setZoom(z => z + 1)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          className="map-control-btn"
          title="Zoom Out"
          aria-label="Zoom Out"
          onClick={() => setZoom(z => Math.max(0, z - 1))}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
