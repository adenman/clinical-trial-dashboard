import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Papa from 'papaparse'; // Kept for the "Create Trial" feature

// We no longer need to import the static trials file from the project.
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PatientList from './components/PatientList';
import PatientDetail from './components/PatientDetail';
import CreateTrial from './components/CreateTrial';

// Define the base URL for your single API endpoint
const API_URL = 'https://adenneal.com/ClinicalTrial/api/api.php';

function App() {
  const [allTrials, setAllTrials] = useState([]);
  const [currentTrial, setCurrentTrial] = useState(null);
  const [trialData, setTrialData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  // Effect 1: Fetch the list of all available trials when the app first loads.
  useEffect(() => {
    const fetchTrialsList = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch the list of trials from the API.');
        }
        const trialsList = await response.json();
        
        setAllTrials(trialsList);
        
        // Automatically select the first trial in the list as the default.
        if (trialsList.length > 0) {
          setCurrentTrial(trialsList[0]);
        } else {
          setLoading(false); // No trials to load
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchTrialsList();
  }, []); // The empty dependency array means this runs only once.

  // Effect 2: Fetch the patient data for the currently selected trial.
  // This runs whenever `currentTrial` changes.
  useEffect(() => {
    const loadTrialData = async () => {
      // Don't run if there is no current trial selected.
      // Also, skip if it's a user-created trial (which has its data embedded).
      if (!currentTrial || currentTrial.data) {
        if (currentTrial?.data) {
            setTrialData(currentTrial.data);
        }
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch patient data for the specific trial ID.
        const response = await fetch(`${API_URL}?trial_id=${currentTrial.id}`);
        if (!response.ok) {
          throw new Error(`Network response was not ok for trial ${currentTrial.id}`);
        }
        const data = await response.json();
        setTrialData(data);
      } catch (err) {
        setError(err.message);
        setTrialData([]); // Clear data on error
      } finally {
        setLoading(false);
      }
    };

    loadTrialData();
  }, [currentTrial]); // This effect depends on 'currentTrial'.

  const handleFilterChange = (key, value) => {
    setFilters(prevFilters => {
      if (value === null) {
        const { [key]: _, ...rest } = prevFilters;
        return rest;
      }
      return { ...prevFilters, [key]: value };
    });
  };

  const filteredData = useMemo(() => {
    if (Object.keys(filters).length === 0) return trialData;
    return trialData.filter(item => {
      return Object.entries(filters).every(([key, value]) => item[key] === value);
    });
  }, [trialData, filters]);

  const handleTrialCreate = (newTrial) => {
    // Add the user-created trial to the list and set it as current.
    const fullNewTrial = { ...newTrial, id: newTrial.id || `user-${Date.now()}` };
    setAllTrials(prevTrials => [...prevTrials, fullNewTrial]);
    setCurrentTrial(fullNewTrial);
  };
  
  const basename = import.meta.env.DEV ? '/' : '/ClinicalTrial/';

  // Main render logic
  const renderContent = () => {
    if (loading && allTrials.length === 0) return <p className="text-center text-gray-500">Loading available trials...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;
    if (!currentTrial) return <p className="text-center text-gray-500">No trials available to display.</p>;

    return (
      <Routes>
        <Route path="/" element={
          <Dashboard 
            trial={currentTrial} 
            data={filteredData}
            onFilterChange={handleFilterChange} 
            activeFilters={filters}
          />} 
        />
        <Route path="/patients" element={ <PatientList data={trialData} /> } />
        <Route path="/patient/:patientId" element={
          <PatientDetail 
            trial={currentTrial} 
            data={trialData} 
          />} 
        />
        <Route path="/create-trial" element={ <CreateTrial onTrialCreate={handleTrialCreate} /> } />
      </Routes>
    );
  };

  return (
    <Router basename={basename}>
      <div className="flex bg-gray-100 min-h-screen font-sans">
        <Sidebar 
          trials={allTrials} 
          currentTrial={currentTrial} 
          setCurrentTrial={setCurrentTrial} 
        />
        <main className="flex-1 p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </Router>
  );
}

export default App;