import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Details = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state?.item;

  if (!item) {
    navigate('/list');
    return null;
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Details</h1>
        <div className="header-buttons">
          <button className="back-btn" onClick={() => navigate('/list')}>← Back to List</button>
          <button className="photo-btn" onClick={() => navigate('/photos', { state: { item, captureMode: true } })}>📷 Capture Photo</button>
        </div>
      </header>
      <div className="details-card">
        {Object.entries(item).map(([key, value], i) => (
          <div key={i} className="detail-row">
            <span className="detail-label">{key}:</span>
            <span className="detail-value">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Details;
