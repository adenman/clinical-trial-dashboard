import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const COLORS = [
    'rgb(136, 132, 216)', 'rgb(130, 202, 157)', 'rgb(255, 198, 88)',
    'rgb(255, 128, 66)',  'rgb(0, 136, 254)',   'rgb(0, 196, 159)',
];

const OutcomesCharts = ({ data, trial }) => {
  const [lineChartData, setLineChartData] = useState({ datasets: [] });
  const [barChartData, setBarChartData] = useState({ datasets: [] });

  useEffect(() => {
    if (!data || data.length === 0) return;

    // --- Data Preparation ---
    const lineLabels = [...new Set(data.map(item => new Date(item.visitDate).toLocaleDateString()))]
                        .sort((a, b) => new Date(a) - new Date(b));
    const arms = [...new Set(data.map(item => item.treatmentArm))];
    const lineDatasets = arms.map((arm, index) => {
      const armData = lineLabels.map(label => {
        const found = data.find(d => new Date(d.visitDate).toLocaleDateString() === label && d.treatmentArm === arm);
        return found ? found.outcomeValue : null;
      });
      return {
        label: arm,
        data: armData,
        borderColor: COLORS[index % COLORS.length],
        backgroundColor: COLORS[index % COLORS.length] + '80',
        tension: 0.1,
        spanGaps: true,
      };
    });
    setLineChartData({ labels: lineLabels, datasets: lineDatasets });

    const adverseEvents = data.reduce((acc, patient) => {
      if (patient.adverseEvent && patient.adverseEvent !== 'None') {
        acc[patient.adverseEvent] = (acc[patient.adverseEvent] || 0) + 1;
      }
      return acc;
    }, {});
    const barLabels = Object.keys(adverseEvents);
    const barDataPoints = Object.values(adverseEvents);
    setBarChartData({
        labels: barLabels,
        datasets: [{
            data: barDataPoints,
            backgroundColor: 'rgba(255, 198, 88, 0.6)',
        }]
    })
  }, [data, trial]);

  // --- Chart Options ---
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } },
    scales: { x: { grid: { display: false } } }
  };
  
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
  };

  return (
    // This grid lays out the two charts vertically, each taking up half the height.
    <div className="w-full h-full grid grid-cols-1 grid-rows-2 gap-4">
        {/* Top row for Adverse Events */}
        <div className="flex flex-col">
            <h4 className="text-center text-sm font-medium text-gray-600 mb-2">Adverse Events Frequency</h4>
            <div className="relative flex-grow">
              <Bar options={barOptions} data={barChartData} />
            </div>
        </div>
        {/* Bottom row for Outcome Trend */}
        <div className="flex flex-col">
            <h4 className="text-center text-sm font-medium text-gray-600 mb-2">{trial.outcomeLabel}</h4>
            <div className="relative flex-grow">
              <Line options={lineOptions} data={lineChartData} />
            </div>
        </div>
    </div>
  );
};

export default OutcomesCharts;