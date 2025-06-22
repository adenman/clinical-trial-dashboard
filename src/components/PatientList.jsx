import React from 'react';
import PatientTable from './PatientTable';

// This component now primarily acts as a container for the PatientTable.
// It receives the filtered data from App.jsx and passes it down.
const PatientList = ({ data }) => {
  return (
    <div className="w-full">
      <PatientTable data={data} />
    </div>
  );
};

export default PatientList;