import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import Pagination from './Pagination';

const List = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/');
      return;
    }
    fetchData();
    
    // Check if coming from map with city filter
    if (location.state?.filterCity) {
      setCityFilter(location.state.filterCity);
    }
  }, [navigate, location]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://backend.jotish.in/backend_dev/gettabledata.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'test',
          password: '123456'
        }),
      });
      const result = await response.json();
      
      if (result.TABLE_DATA && result.TABLE_DATA.data) {
        const apiData = result.TABLE_DATA.data.map((row, index) => ({
          id: index + 1,
          name: row[0],
          position: row[1],
          office: row[2],
          extn: row[3],
          startDate: row[4],
          salary: row[5]
        }));
        setData(apiData);
        setFilteredData(apiData);
        setLoading(false);
      } else {
        useMockData();
      }
    } catch (err) {
      useMockData();
    }
  };

  const useMockData = () => {
    const mockData = getMockData();
    setData(mockData);
    setFilteredData(mockData);
    setLoading(false);
  };

  const getMockData = () => [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', city: 'New York', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '234-567-8901', city: 'Los Angeles', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '345-678-9012', city: 'Chicago', status: 'Inactive' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', phone: '456-789-0123', city: 'Houston', status: 'Active' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', phone: '567-890-1234', city: 'Phoenix', status: 'Active' },
    { id: 6, name: 'Diana Davis', email: 'diana@example.com', phone: '678-901-2345', city: 'Philadelphia', status: 'Inactive' },
    { id: 7, name: 'Edward Miller', email: 'edward@example.com', phone: '789-012-3456', city: 'San Antonio', status: 'Active' },
    { id: 8, name: 'Fiona Wilson', email: 'fiona@example.com', phone: '890-123-4567', city: 'San Diego', status: 'Active' },
    { id: 9, name: 'George Moore', email: 'george@example.com', phone: '901-234-5678', city: 'Dallas', status: 'Inactive' },
    { id: 10, name: 'Hannah Taylor', email: 'hannah@example.com', phone: '012-345-6789', city: 'San Jose', status: 'Active' },
    { id: 11, name: 'Ian Anderson', email: 'ian@example.com', phone: '123-456-7891', city: 'Austin', status: 'Active' },
    { id: 12, name: 'Julia Thomas', email: 'julia@example.com', phone: '234-567-8902', city: 'Jacksonville', status: 'Inactive' },
    { id: 13, name: 'Kevin Jackson', email: 'kevin@example.com', phone: '345-678-9013', city: 'Fort Worth', status: 'Active' },
    { id: 14, name: 'Laura White', email: 'laura@example.com', phone: '456-789-0124', city: 'Columbus', status: 'Active' },
    { id: 15, name: 'Michael Harris', email: 'michael@example.com', phone: '567-890-1235', city: 'Charlotte', status: 'Inactive' },
    { id: 16, name: 'Nancy Martin', email: 'nancy@example.com', phone: '678-901-2346', city: 'San Francisco', status: 'Active' },
    { id: 17, name: 'Oliver Thompson', email: 'oliver@example.com', phone: '789-012-3457', city: 'Indianapolis', status: 'Active' },
    { id: 18, name: 'Patricia Garcia', email: 'patricia@example.com', phone: '890-123-4568', city: 'Seattle', status: 'Inactive' },
    { id: 19, name: 'Quincy Martinez', email: 'quincy@example.com', phone: '901-234-5679', city: 'Denver', status: 'Active' },
    { id: 20, name: 'Rachel Robinson', email: 'rachel@example.com', phone: '012-345-6780', city: 'Washington', status: 'Active' },
  ];

  useEffect(() => {
    let filtered = data;
    
    // Apply city filter first
    if (cityFilter) {
      filtered = filtered.filter(item => item.office === cityFilter);
    }
    
    // Then apply search
    if (searchTerm) {
      filtered = filtered.filter(item =>
        Object.values(item).some(value =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, cityFilter, data]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  const handleRowClick = (item) => {
    navigate('/details', { state: { item } });
  };

  if (loading) return <div className="container"><div className="loading">Loading...</div></div>;

  return (
    <div className="container">
      <header className="header">
        <h1>Data List</h1>
        <div className="header-buttons">
          <button className="dashboard-btn" onClick={() => navigate('/dashboard', { state: { data: filteredData } })}>📊 Dashboard</button>
          <button className="map-btn" onClick={() => navigate('/map', { state: { data: filteredData } })}>🗺️ Map View</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      {cityFilter && (
        <div className="filter-badge">
          <span>📍 Filtered by: <strong>{cityFilter}</strong></span>
          <button onClick={() => setCityFilter('')} className="remove-filter">✕ Remove Filter</button>
        </div>
      )}
      
      <div className="results-info">
        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {currentItems.length > 0 && Object.keys(currentItems[0]).map((key, i) => <th key={i}>{key}</th>)}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((row, i) => (
              <tr key={i} onClick={() => handleRowClick(row)} style={{ cursor: 'pointer' }}>
                {Object.values(row).map((val, j) => <td key={j}>{val}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default List;
