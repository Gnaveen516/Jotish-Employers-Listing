import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const MapView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const allData = location.state?.data || [];
  const [cityData, setCityData] = useState([]);

  const cityCoordinates = {
    'New York': { lat: 40.7128, lng: -74.0060, emoji: '🗽' },
    'London': { lat: 51.5074, lng: -0.1278, emoji: '🇬🇧' },
    'Tokyo': { lat: 35.6762, lng: 139.6503, emoji: '🗾' },
    'Edinburgh': { lat: 55.9533, lng: -3.1883, emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
    'San Francisco': { lat: 37.7749, lng: -122.4194, emoji: '🌉' },
    'Singapore': { lat: 1.3521, lng: 103.8198, emoji: '🇸🇬' },
    'Sidney': { lat: -33.8688, lng: 151.2093, emoji: '🦘' }
  };

  useEffect(() => {
    if (allData.length > 0) {
      const cities = {};
      allData.forEach(emp => {
        if (!cities[emp.office]) {
          cities[emp.office] = { count: 0, employees: [] };
        }
        cities[emp.office].count++;
        cities[emp.office].employees.push(emp.name);
      });

      const cityArr = Object.entries(cities).map(([city, data]) => ({
        city,
        count: data.count,
        employees: data.employees,
        ...cityCoordinates[city]
      })).filter(c => c.lat);

      setCityData(cityArr);
    }
  }, [allData]);

  return (
    <div className="map-container">
      <header className="dashboard-header">
        <h1>🗺️ Global Office Locations</h1>
        <button className="back-btn" onClick={() => navigate('/list')}>← Back to List</button>
      </header>

      <div className="map-wrapper">
        <div className="world-map">
          {cityData.map((city, i) => (
            <div
              key={i}
              className="map-marker"
              style={{
                left: `${((city.lng + 180) / 360) * 100}%`,
                top: `${((90 - city.lat) / 180) * 100}%`
              }}
              title={`${city.city}: ${city.count} employees`}
            >
              <div className="marker-pin">
                <span className="marker-emoji">{city.emoji}</span>
                <span className="marker-count">{city.count}</span>
              </div>
              <div className="marker-tooltip">
                <h4>{city.city}</h4>
                <p>{city.count} Employees</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="city-cards">
        {cityData.map((city, i) => (
          <div key={i} className="city-card">
            <div className="city-header">
              <span className="city-emoji">{city.emoji}</span>
              <h3>{city.city}</h3>
            </div>
            <div className="city-count">{city.count} Employees</div>
            <div className="city-employees">
              {city.employees.slice(0, 3).map((emp, j) => {
                const employee = allData.find(e => e.name === emp);
                return (
                  <div 
                    key={j} 
                    className="employee-tag clickable"
                    onClick={() => navigate('/details', { state: { item: employee } })}
                    title="Click to view details"
                  >
                    {emp}
                  </div>
                );
              })}
              {city.employees.length > 3 && (
                <div className="employee-tag more">
                  +{city.employees.length - 3} more
                </div>
              )}
            </div>
            <button 
              className="view-all-btn"
              onClick={() => navigate('/list', { state: { filterCity: city.city } })}
            >
              View All in {city.city}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapView;
