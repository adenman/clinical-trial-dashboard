import React from 'react';
import Papa from 'papaparse';
import DemographicsCharts from './DemographicsCharts';
import OutcomesCharts from './OutcomesCharts';
import KpiCard from './KpiCard';
import { Users, User, Frown, Download } from 'lucide-react';

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
);

const Dashboard = ({ data, trial }) => {
  const totalPatients = data.length;
  const avgAge = totalPatients > 0 
    ? (data.reduce((sum, p) => sum + p.age, 0) / totalPatients).toFixed(1)
    : 0;
  const totalAdverseEvents = data.filter(p => p.adverseEvent && p.adverseEvent !== 'None').length;
  
  // --- NEW DOWNLOAD FUNCTION ---
  const handleDownload = () => {
    // Convert the JSON data back to a CSV string
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    // Sanitize the trial name to create a valid filename
    const filename = `${trial.id.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_data.csv`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{trial.name}</h2>
          <p className="text-gray-600 mt-1">{trial.description}</p>
        </div>
        {/* --- NEW DOWNLOAD BUTTON --- */}
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
        >
          <Download size={16} />
          Download CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KpiCard title="Total Participants" value={totalPatients} icon={Users} />
        <KpiCard title="Average Age" value={avgAge} icon={User} />
        <KpiCard title="Adverse Events" value={totalAdverseEvents} icon={Frown} />
      </div>

      <div className="space-y-8">
          <ChartCard title="Demographics">
            <DemographicsCharts data={data} />
          </ChartCard>
          <ChartCard title="Outcomes & Events">
            <OutcomesCharts data={data} trial={trial} />
          </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;