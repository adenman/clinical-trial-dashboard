import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DemographicsCharts = ({ data }) => {
  // Age Distribution
  const ageData = data.reduce((acc, patient) => {
    const ageGroup = Math.floor(patient.age / 10) * 10;
    const existingGroup = acc.find(item => item.name === `${ageGroup}-${ageGroup + 9}`);
    if (existingGroup) {
      existingGroup.count++;
    } else {
      acc.push({ name: `${ageGroup}-${ageGroup + 9}`, count: 1 });
    }
    return acc;
  }, []).sort((a, b) => a.name.localeCompare(b.name));

  // Gender Distribution
  const genderData = data.reduce((acc, patient) => {
    const existingGender = acc.find(item => item.name === patient.gender);
    if (existingGender) {
      existingGender.value++;
    } else {
      acc.push({ name: patient.gender, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Race Distribution
    const raceData = data.reduce((acc, patient) => {
        const existingRace = acc.find(item => item.name === patient.race);
        if (existingRace) {
            existingRace.count++;
        } else {
            acc.push({ name: patient.race, count: 1 });
        }
        return acc;
    }, []);


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="p-4 bg-white shadow-md rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Age Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="p-4 bg-white shadow-md rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Gender Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
       <div className="p-4 bg-white shadow-md rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Race/Ethnicity Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={raceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DemographicsCharts;