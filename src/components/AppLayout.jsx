import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import PatientList from './PatientList';
import PatientDetail from './PatientDetail';
import CreateTrial from './CreateTrial';

const API_URL = 'https://adenneal.com/ClinicalTrial/api/api.php';
const PATIENT_DATA_URL = 'https://adenneal.com/ClinicalTrial/api/patients.php';

export  function AppLayout() {
    const { user } = useAuth();
    const [allTrials, setAllTrials] = useState([]);
    const [currentTrial, setCurrentTrial] = useState(null);
    const [trialData, setTrialData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) return;
        setLoading(true);
        
        const fetchTrials = async () => {
            try {
                const response = await fetch(API_URL, { credentials: 'include' });
                if (!response.ok) throw new Error('Could not fetch trials.');
                const trialsList = await response.json();
                setAllTrials(trialsList);
                if (trialsList.length > 0) {
                    setCurrentTrial(trialsList[0]);
                } else {
                    setLoading(false);
                }
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchTrials();
    }, [user]);

    useEffect(() => {
        if (!currentTrial) return;
        if (currentTrial.data) {
            setTrialData(currentTrial.data);
            setLoading(false);
            return;
        }
        
        const fetchPatientData = async () => {
            setLoading(true);
            try {
                 const response = await fetch(`${PATIENT_DATA_URL}?trial_id=${currentTrial.id}`, { credentials: 'include' });
                 if(!response.ok) throw new Error("Could not fetch patient data.");
                 const patientList = await response.json();
                 setTrialData(patientList);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPatientData();
    }, [currentTrial]);

    const handleTrialCreate = (newTrial) => {
        const fullNewTrial = { ...newTrial, id: `user-${user.id}-${Date.now()}` };
        setAllTrials(prev => [...prev, fullNewTrial]);
        setCurrentTrial(fullNewTrial);
    };

    const [filters, setFilters] = useState({});
    const handleFilterChange = (key, value) => {
      setFilters(prev => value === null ? (({ [key]: _, ...rest }) => rest)(prev) : { ...prev, [key]: value });
    };
    const filteredData = useMemo(() => {
      if (Object.keys(filters).length === 0) return trialData;
      return trialData.filter(item => Object.entries(filters).every(([key, value]) => item[key] === value));
    }, [trialData, filters]);

    const renderContent = () => {
        if (loading) return <p className="text-center text-gray-500">Loading your trials...</p>;
        if (error) return <p className="text-center text-red-500">Error: {error}</p>;
        if (allTrials.length === 0 && !loading) return <CreateTrial onTrialCreate={handleTrialCreate} />;
        if (!currentTrial) return <p className="text-center text-gray-500">Select a trial to begin.</p>;
      
        return (
            <Routes>
                <Route path="/" element={<Dashboard trial={currentTrial} data={filteredData} onFilterChange={handleFilterChange} activeFilters={filters} />} />
                <Route path="/patients" element={<PatientList data={trialData} />} />
                <Route path="/create-trial" element={<CreateTrial onTrialCreate={handleTrialCreate} />} />
                <Route path="/patient/:patientId" element={<PatientDetail trial={currentTrial} data={trialData} />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        );
    };

    return (
        <div className="flex bg-gray-100 min-h-screen font-sans">
            <Sidebar trials={allTrials} currentTrial={currentTrial} setCurrentTrial={setCurrentTrial} />
            <main className="flex-1 p-8 overflow-y-auto">{renderContent()}</main>
        </div>
    );
};

export default AppLayout;
