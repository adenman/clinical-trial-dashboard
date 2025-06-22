import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Papa from 'papaparse';

import { trials as initialTrials } from './data/trials.js';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PatientList from './components/PatientList';
import PatientDetail from './components/PatientDetail';
import CreateTrial from './components/CreateTrial';

function App() {
  const [allTrials, setAllTrials] = useState(initialTrials);
  const [currentTrial, setCurrentTrial] = useState(initialTrials[0]);
  const [trialData, setTrialData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({}); // State for our cross-filters

  useEffect(() => {
    const loadTrialData = async () => {
      if (!currentTrial) return;
      setLoading(true);
      setFilters({}); // Reset filters when trial changes

      if (currentTrial.filePath) {
        try {
          const response = await fetch(currentTrial.filePath);
          const text = await response.text();
          Papa.parse(text, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => {
              setTrialData(results.data);
              setLoading(false);
            }
          });
        } catch (error) {
          console.error("Failed to fetch trial data:", error);
          setLoading(false);
        }
      } else if (currentTrial.data) {
        setTrialData(currentTrial.data);
        setLoading(false);
      }
    };
    loadTrialData();
  }, [currentTrial]);

  // This function updates the filter state for the dashboard
  const handleFilterChange = (key, value) => {
    setFilters(prevFilters => {
      if (value === null) {
        const { [key]: _, ...rest } = prevFilters;
        return rest;
      }
      return { ...prevFilters, [key]: value };
    });
  };

  // This memoized data is ONLY for the main dashboard to react to cross-filtering
  const filteredData = useMemo(() => {
    if (Object.keys(filters).length === 0) {
      return trialData;
    }
    return trialData.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        return item[key] === value;
      });
    });
  }, [trialData, filters]);

  const handleTrialCreate = (newTrial) => {
    setAllTrials(prevTrials => [...prevTrials, newTrial]);
    setCurrentTrial(newTrial);
  };

  return (
    <Router>
      <div className="flex bg-gray-100 min-h-screen font-sans">
        <Sidebar 
          trials={allTrials} 
          currentTrial={currentTrial} 
          setCurrentTrial={setCurrentTrial} 
        />
        <main className="flex-1 p-8 overflow-y-auto">
          {loading ? (
             <p className="text-center text-gray-500">Loading trial data...</p>
          ) : (
            <Routes>
              <Route path="/" element={
                <Dashboard 
                  trial={currentTrial} 
                  data={filteredData}
                  onFilterChange={handleFilterChange} 
                  activeFilters={filters}
                />} 
              />
              {/* --- THIS IS THE FIX --- */}
              {/* The PatientList now receives the complete, unfiltered 'trialData' */}
              <Route path="/patients" element={
                <PatientList 
                  data={trialData}
                />} 
              />
              <Route path="/patient/:patientId" element={
                <PatientDetail 
                  trial={currentTrial} 
                  data={trialData} // PatientDetail also needs the full dataset to find patients by ID
                />} 
              />
              <Route path="/create-trial" element={
                <CreateTrial onTrialCreate={handleTrialCreate} />} 
              />
            </Routes>
          )}
        </main>
      </div>
    </Router>
  );
}

export default App;