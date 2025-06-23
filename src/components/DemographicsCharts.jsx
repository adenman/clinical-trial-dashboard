import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const PIE_COLORS = [
  'rgb(0, 136, 254)',   // Blue
  'rgb(0, 196, 159)',   // Green
  'rgb(255, 187, 40)',  // Yellow
];

const DemographicsCharts = ({ data, onFilterChange, activeFilters }) => {
  // --- DATA PREPARATION ---
  const ageData = data.reduce((acc, patient) => {
    if (!patient.age) return acc;
    const ageGroup = `${Math.floor(patient.age / 10) * 10}s`;
    acc[ageGroup] = (acc[ageGroup] || 0) + 1;
    return acc;
  }, {});
  const ageChartData = {
    labels: Object.keys(ageData).sort(),
    datasets: [{
      data: Object.values(ageData),
      backgroundColor: 'rgba(136, 132, 216, 0.6)',
    }]
  };

  const genderData = data.reduce((acc, patient) => {
    const gender = patient.gender || 'Unknown';
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {});
  const genderChartData = {
    labels: Object.keys(genderData),
    datasets: [{
      data: Object.values(genderData),
      backgroundColor: PIE_COLORS,
    }]
  };
  
  const raceData = data.reduce((acc, patient) => {
    const race = patient.race || 'Unknown';
    acc[race] = (acc[race] || 0) + 1;
    return acc;
  }, {});
  const raceChartData = {
    labels: Object.keys(raceData),
    datasets: [{
        data: Object.values(raceData),
        backgroundColor: 'rgba(130, 202, 157, 0.6)',
    }]
  };

  // --- CHART OPTIONS ---
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
  };
  
  const pieOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } }
  };

  return (
    <div className="w-full h-full grid grid-cols-1 grid-rows-2 gap-4">
        {/* Top row with Age and Gender */}
        <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
                <h4 className="text-center text-sm font-medium text-gray-600 mb-2">Age Distribution</h4>
                <div className="relative flex-grow">
                    <Bar options={barOptions} data={ageChartData} />
                </div>
            </div>
            <div className="flex flex-col">
                <h4 className="text-center text-sm font-medium text-gray-600 mb-2">Gender Distribution</h4>
                <div className="relative flex-grow">
                    <Pie options={pieOptions} data={genderChartData} />
                </div>
            </div>
        </div>
        {/* Bottom row with Race/Ethnicity */}
        <div className="flex flex-col">
            <h4 className="text-center text-sm font-medium text-gray-600 mb-2">Race/Ethnicity</h4>
            <div className="relative flex-grow">
                <Bar options={barOptions} data={raceChartData} />
            </div>
        </div>
    </div>
  );
};

export default DemographicsCharts;