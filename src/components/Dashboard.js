import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const allData = location.state?.data || [];
  
  const [chartData, setChartData] = useState([]);
  const [officeData, setOfficeData] = useState([]);
  const [positionData, setPositionData] = useState([]);

  useEffect(() => {
    if (allData.length > 0) {
      // Top 10 salaries
      const top10 = allData.slice(0, 10).map(emp => ({
        name: emp.name.split(' ')[0],
        salary: parseInt(emp.salary.replace(/[$,]/g, ''))
      }));
      setChartData(top10);

      // Office distribution
      const offices = {};
      allData.forEach(emp => {
        offices[emp.office] = (offices[emp.office] || 0) + 1;
      });
      const officeArr = Object.entries(offices).map(([name, value]) => ({ name, value }));
      setOfficeData(officeArr);

      // Position distribution (top 5)
      const positions = {};
      allData.forEach(emp => {
        positions[emp.position] = (positions[emp.position] || 0) + 1;
      });
      const posArr = Object.entries(positions)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value]) => ({ name, value }));
      setPositionData(posArr);
    }
  }, [allData]);

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a', '#fee140'];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>📊 Analytics Dashboard</h1>
        <button className="back-btn" onClick={() => navigate('/list')}>← Back to List</button>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{allData.length}</h3>
            <p>Total Employees</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-info">
            <h3>{officeData.length}</h3>
            <p>Office Locations</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💼</div>
          <div className="stat-info">
            <h3>{positionData.length}+</h3>
            <p>Job Positions</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>${(chartData.reduce((sum, d) => sum + d.salary, 0) / 1000).toFixed(0)}K</h3>
            <p>Top 10 Total Salary</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h2>💵 Top 10 Employee Salaries</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="salary" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>🏢 Employees by Office</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={officeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {officeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card full-width">
          <h2>📈 Top 5 Job Positions</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={positionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#764ba2" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
