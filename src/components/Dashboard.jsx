import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Papa from 'papaparse';

import DemographicsCharts from './DemographicsCharts';
import OutcomesCharts from './OutcomesCharts';
import KpiCard from './KpiCard';
import { Users, User, Frown, Download, Camera } from 'lucide-react';

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col h-full">
    <h3 className="text-xl font-bold text-gray-800 mb-4 shrink-0">{title}</h3>
    {/* This div allows the child charts to fill the card's remaining space */}
    <div className="flex-grow w-full h-full">
        {children}
    </div>
  </div>
);

const Dashboard = ({ data, trial, onFilterChange, activeFilters }) => {
  const dashboardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const totalPatients = data.length;
  const avgAge = totalPatients > 0 
    ? (data.reduce((sum, p) => sum + p.age, 0) / totalPatients).toFixed(1)
    : 0;
  const totalAdverseEvents = data.filter(p => p.adverseEvent && p.adverseEvent !== 'None').length;
  
  const handleDownloadCSV = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const filename = `${trial.id.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_data.csv`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    if (!dashboardRef.current) return;
    setIsExporting(true);

    html2canvas(dashboardRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const filename = `${trial.id.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_dashboard.pdf`;
      pdf.save(filename);
      setIsExporting(false);
    });
  };

  return (
    <div ref={dashboardRef} className="flex flex-col h-full gap-6">
      {/* Header Section */}
      <div className="shrink-0">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{trial.name}</h2>
            <p className="text-gray-600 mt-1 max-w-2xl">{trial.description}</p>
          </div>
          <div className="flex gap-2">
              <button onClick={handleDownloadCSV} className="inline-flex items-center gap-2 py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <Download size={16} /> Download CSV
              </button>
              <button onClick={handleExportPDF} disabled={isExporting} className="inline-flex items-center gap-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300">
                  <Camera size={16} /> {isExporting ? 'Exporting...' : 'Export PDF'}
              </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="Total Participants" value={totalPatients} icon={Users} />
        <KpiCard title="Average Age" value={avgAge} icon={User} />
        <KpiCard title="Adverse Events" value={totalAdverseEvents} icon={Frown} />
      </div>

      {/* --- THIS IS THE FIX --- */}
      {/* This flex container will grow to fill the screen and hold the two main chart cards. */}
      {/* min-h-0 is a crucial flexbox trick to make this work correctly. */}
      <div className="flex-1 flex gap-6 min-h-0">
        <div className="w-1/2">
            <ChartCard title="Demographics">
                <DemographicsCharts data={data} onFilterChange={onFilterChange} activeFilters={activeFilters} />
            </ChartCard>
        </div>
        <div className="w-1/2">
            <ChartCard title="Outcomes & Events">
                <OutcomesCharts data={data} trial={trial} />
            </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;