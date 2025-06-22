import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// We now accept onFilterChange and activeFilters as props
const DemographicsCharts = ({ data, onFilterChange, activeFilters }) => {

  // Age Distribution Logic (no changes needed)
  const ageData = data.reduce((acc, patient) => {
    if (!patient.age) return acc;
    const ageGroup = Math.floor(patient.age / 10) * 10;
    const groupName = `${ageGroup}-${ageGroup + 9}`;
    const existingGroup = acc.find(item => item.name === groupName);
    if (existingGroup) {
      existingGroup.count++;
    } else {
      acc.push({ name: groupName, count: 1 });
    }
    return acc;
  }, []).sort((a, b) => a.name.localeCompare(b.name));

  // Gender Distribution Logic
  const genderData = data.reduce((acc, patient) => {
    const gender = patient.gender || 'Unknown';
    const existingGender = acc.find(item => item.name === gender);
    if (existingGender) {
      existingGender.value++;
    } else {
      acc.push({ name: gender, value: 1 });
    }
    return acc;
  }, []);
  const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  // Race Distribution Logic (no changes needed)
  const raceData = data.reduce((acc, patient) => {
    const race = patient.race || 'Unknown';
    const existingRace = acc.find(item => item.name === race);
    if (existingRace) {
      existingRace.count++;
    } else {
      acc.push({ name: race, count: 1 });
    }
    return acc;
  }, []);

  // Click handler for the pie chart
  const handleGenderClick = (entry) => {
    // If the clicked gender is already the active filter, clear it. Otherwise, set it.
    const newFilter = activeFilters.gender === entry.name ? null : entry.name;
    onFilterChange('gender', newFilter);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div className="h-full">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Age Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="h-full">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Gender Distribution</h3>
            {activeFilters.gender && (
                <button onClick={() => onFilterChange('gender', null)} className="text-xs text-violet-600 hover:underline">
                    Clear Filter
                </button>
            )}
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {genderData.map((entry, index) => (
                    <Cell 
                        key={`cell-${index}`} 
                        fill={PIE_COLORS[index % PIE_COLORS.length]} 
                        onClick={() => handleGenderClick(entry)}
                        className="cursor-pointer"
                        stroke={activeFilters.gender === entry.name ? '#000000' : '#ffffff'}
                        strokeWidth={activeFilters.gender === entry.name ? 3 : 1}
                    />
                ))}
            </Pie>
            <Tooltip />
            <Legend onClick={handleGenderClick} wrapperStyle={{cursor: 'pointer'}} />
          </PieChart>
        </ResponsiveContainer>
      </div>
       <div className="h-full">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Race/Ethnicity Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={raceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DemographicsCharts;