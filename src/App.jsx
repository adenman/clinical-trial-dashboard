import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Papa from 'papaparse';

import { trials as initialTrials } from './data/trials.js'; // Import our static trials
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PatientList from './components/PatientList';
import PatientDetail from './components/PatientDetail';
import CreateTrial from './components/CreateTrial'; // Import the new component

function App() {
  const [allTrials, setAllTrials] = useState(initialTrials);
  const [currentTrial, setCurrentTrial] = useState(initialTrials[0]);
  const [trialData, setTrialData] = useState([]);
  const [loading, setLoading] = useState(true);

  // This effect runs whenever the 'currentTrial' changes.
  // It handles fetching data for static trials and loading data for user-created trials.
  useEffect(() => {
    const loadTrialData = async () => {
      if (!currentTrial) return;

      setLoading(true);

      // If the trial has a filePath, it's a static trial that needs to be fetched.
      if (currentTrial.filePath) {
        try {
          const response = await fetch(currentTrial.filePath);
          const reader = response.body.getReader();
          const result = await reader.read();
          const decoder = new TextDecoder('utf-8');
          const csv = decoder.decode(result.value);
          Papa.parse(csv, {
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
      } 
      // Otherwise, it's a user-created trial and the data is already in the object.
      else if (currentTrial.data) {
        setTrialData(currentTrial.data);
        setLoading(false);
      }
    };

    loadTrialData();
  }, [currentTrial]);

  // This function is passed to the CreateTrial component.
  const handleTrialCreate = (newTrial) => {
    // Add the new trial to our list of all trials
    setAllTrials(prevTrials => [...prevTrials, newTrial]);
    // Automatically switch to view the newly created trial
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
              <Route path="/" element={<Dashboard trial={currentTrial} data={trialData} />} />
              <Route path="/patients" element={<PatientList trial={currentTrial} data={trialData} />} />
              <Route path="/patient/:patientId" element={<PatientDetail trial={currentTrial} data={trialData} />} />
              {/* --- NEW ROUTE --- */}
              <Route path="/create-trial" element={<CreateTrial onTrialCreate={handleTrialCreate} />} />
            </Routes>
          )}
        </main>
      </div>
    </Router>
  );
}

export default App;