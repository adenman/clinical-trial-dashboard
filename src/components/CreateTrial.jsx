import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';

const InputField = ({ label, id, value, onChange, placeholder, required = true }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="text"
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500"
    />
  </div>
);

const CreateTrial = ({ onTrialCreate }) => {
  const [trialName, setTrialName] = useState('');
  const [description, setDescription] = useState('');
  const [outcomeMetric, setOutcomeMetric] = useState('');
  const [outcomeLabel, setOutcomeLabel] = useState('');
  const [csvData, setCsvData] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!csvData.trim()) {
      setError('CSV data cannot be empty.');
      return;
    }

    Papa.parse(csvData, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError('Error parsing CSV data. Please check the format.');
          console.error("CSV Parsing Errors:", results.errors);
          return;
        }

        if (results.data.length === 0) {
          setError('No valid data found in the CSV text.');
          return;
        }

        const newTrial = {
          id: `user-${Date.now()}`, // Unique ID for the new trial
          name: trialName,
          description,
          outcomeMetric,
          outcomeLabel,
          data: results.data, // Store the parsed data directly
        };

        onTrialCreate(newTrial);
        navigate('/'); // Redirect to the dashboard after creation
      },
      error: () => {
        setError('A critical error occurred while parsing the CSV data.');
      }
    });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Create a New Trial</h2>
      <p className="text-gray-600 mb-6">Define the trial parameters and paste your patient data in CSV format below.</p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Trial Name" id="trialName" value={trialName} onChange={(e) => setTrialName(e.target.value)} placeholder="e.g., PulmoGuard Efficacy Study" />
          <InputField label="Trial Description" id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., A study on a new asthma medication." />
          <InputField label="Outcome Metric (CSV Header)" id="outcomeMetric" value={outcomeMetric} onChange={(e) => setOutcomeMetric(e.target.value)} placeholder="e.g., fev1Change" />
          <InputField label="Outcome Label (Chart Title)" id="outcomeLabel" value={outcomeLabel} onChange={(e) => setOutcomeLabel(e.target.value)} placeholder="e.g., FEV1 Change (%)" />
        </div>
        
        <div>
          <label htmlFor="csvData" className="block text-sm font-medium text-gray-700 mb-1">Patient Data (CSV Format)</label>
          <textarea
            id="csvData"
            name="csvData"
            rows="10"
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
            placeholder={'patientID,age,gender,race,treatmentArm,visitDate,fev1Change,adverseEvent\n' +
                         'PG-001,45,Male,Caucasian,"PulmoGuard 2mg",2025-01-10,5.5,None'}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500 font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">The first line must be a header row containing column names like `patientID`, `age`, etc.</p>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            Create Trial and View Dashboard
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTrial;