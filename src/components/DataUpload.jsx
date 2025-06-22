import React from 'react';
import Papa from 'papaparse';

const DataUpload = ({ setData }) => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          setData(results.data);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          alert("Error parsing CSV file. Please check the console for details.");
        }
      });
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Upload Clinical Trial Data</h2>
      <input
        type="file"
        accept=".csv, .json"
        onChange={handleFileUpload}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
      />
    </div>
  );
};

export default DataUpload;