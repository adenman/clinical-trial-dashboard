import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// A color palette for our dynamic lines
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

const OutcomesCharts = ({ data, trial }) => {
  const [transformedLineData, setTransformedLineData] = useState([]);
  const [treatmentArms, setTreatmentArms] = useState([]);

  useEffect(() => {
    // This effect will run when the component gets new data or a new trial
    // --- 1. Get all unique treatment arms from the data ---
    const arms = [...new Set(data.map(item => item.treatmentArm))];
    setTreatmentArms(arms);

    // --- 2. Transform the data for the Line Chart ---
    // We want to change the data from a "long" format to a "wide" format.
    // From: { visitDate, treatmentArm, value }
    // To:   { visitDate, "Arm A": value, "Arm B": value, "Placebo": value }
    const groupedByDate = data.reduce((acc, item) => {
      const date = new Date(item.visitDate).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { visitDate: date };
      }
      // Use the dynamic outcomeMetric from the trial object
      acc[date][item.treatmentArm] = item[trial.outcomeMetric];
      return acc;
    }, {});
    
    const transformed = Object.values(groupedByDate);
    
    // --- THE FIX ---
    // This line sorts the data chronologically to ensure lines connect correctly.
    transformed.sort((a, b) => new Date(a.visitDate) - new Date(b.visitDate));
    
    setTransformedLineData(transformed);

  }, [data, trial]); // Re-run this logic if the data or trial changes

  // Adverse Events Frequency (this logic can remain the same)
  const adverseEventsData = data.reduce((acc, patient) => {
    if (patient.adverseEvent && patient.adverseEvent !== 'None') {
      const existingEvent = acc.find(item => item.name === patient.adverseEvent);
      if (existingEvent) {
        existingEvent.count++;
      } else {
        acc.push({ name: patient.adverseEvent, count: 1 });
      }
    }
    return acc;
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Adverse Events Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Adverse Events Frequency</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={adverseEventsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Outcome Trend Chart (New and Improved) */}
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-700">{trial.outcomeLabel} by Treatment Arm</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={transformedLineData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="visitDate" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* --- 3. Dynamically create a Line for each treatment arm --- */}
            {treatmentArms.map((arm, index) => (
              <Line
                key={arm}
                type="monotone"
                dataKey={arm} // The dataKey is now the name of the arm itself!
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                connectNulls // This is a useful prop to connect lines even if there's a missing data point
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OutcomesCharts;