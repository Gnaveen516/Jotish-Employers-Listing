import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import List from './components/List';
import Details from './components/Details';
import Photos from './components/Photos';
import Dashboard from './components/Dashboard';
import MapView from './components/MapView';
import './styles/App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/list" element={<List />} />
        <Route path="/details" element={<Details />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/map" element={<MapView />} />
      </Routes>
    </Router>
  );
};

export default App;
