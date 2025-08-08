import React from 'react';
import './Navigation.css';

export default function Navigation({ searchResult }) {
  if (!searchResult) return null;

  const latitude = searchResult.Latitude;
  const longitude = searchResult.Longitude;

  const openGoogleMaps = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank');
  };

  const openWaze = () => {
    window.open(`https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`, '_blank');
  };

  return (
    <div className="navigation-container">
      {/* Map */}
      <div className="map-container">
        <iframe
          title="map"
          width="100%"
          height="250"
          style={{ borderRadius: '8px' }}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.002},${latitude-0.002},${longitude+0.002},${latitude+0.002}&layer=mapnik&marker=${latitude},${longitude}`}
        />
      </div>

      {/* Search Results */}
      <div className="search-results">
        <h2>Search Results</h2>
        <p><strong>Bus Stop Code:</strong> {searchResult['Bus Stop Code']}</p>
        <p><strong>Location:</strong> {searchResult.Location}</p>
        <p><strong>Viewer ID:</strong> {searchResult['Viewer ID']}</p>
        <p><strong>Panel Type:</strong> {searchResult['Panel Type']}</p>
        <p><strong>Road Name:</strong> {searchResult['Road Name']}</p>
        <p><strong>Description:</strong> {searchResult.Description}</p>
        <p><strong>Latitude:</strong> {latitude}</p>
        <p><strong>Longitude:</strong> {longitude}</p>

        {/* Navigation Buttons */}
        <div className="navigate-btns">
          <button className="navigate-btn google-btn" onClick={openGoogleMaps}>
            Google Maps
          </button>
          <button className="navigate-btn waze-btn" onClick={openWaze}>
            Waze
          </button>
        </div>
      </div>
    </div>
  );
}
