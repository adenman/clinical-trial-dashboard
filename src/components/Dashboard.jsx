import React, { useRef, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Papa from 'papaparse';

import DemographicsCharts from './DemographicsCharts';
import OutcomesCharts from './OutcomesCharts';
import KpiCard from './KpiCard';
import { Users, User, Frown, Download, Camera } from 'lucide-react';

// Required styles for react-grid-layout
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const ChartCard = React.forwardRef(({ title, children, className }, ref) => (
  <div ref={ref} className={`bg-white p-6 rounded-lg shadow-lg ${className}`}>
    <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
));

const Dashboard = ({ data, trial, onFilterChange, activeFilters }) => {
  const dashboardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  // Define the initial layout of the dashboard items
  const initialLayouts = {
    lg: [
      { i: 'kpi-total', x: 0, y: 0, w: 1, h: 1 },
      { i: 'kpi-age', x: 1, y: 0, w: 1, h: 1 },
      { i: 'kpi-events', x: 2, y: 0, w: 1, h: 1 },
      { i: 'demographics', x: 0, y: 1, w: 3, h: 2.5 },
      { i: 'outcomes', x: 0, y: 2, w: 3, h: 2.5 },
    ],
  };
  
  // Calculate KPIs
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
    setIsExporting(true); // Show loading state on button

    html2canvas(dashboardRef.current, {
      scale: 2, // Increase scale for better resolution
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
      setIsExporting(false); // Hide loading state
    });
  };

  return (
    <div className="space-y-8">
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
      
      <div ref={dashboardRef}>
          <ResponsiveGridLayout 
            className="layout" 
            layouts={initialLayouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 3, md: 2, sm: 1, xs: 1, xxs: 1 }}
            rowHeight={150}
            isDraggable={true}
            isResizable={true}
          >
            <div key="kpi-total" className="bg-white p-6 rounded-lg shadow-lg flex items-center">
              <KpiCard title="Total Participants" value={totalPatients} icon={Users} />
            </div>
            <div key="kpi-age" className="bg-white p-6 rounded-lg shadow-lg flex items-center">
              <KpiCard title="Average Age" value={avgAge} icon={User} />
            </div>
            <div key="kpi-events" className="bg-white p-6 rounded-lg shadow-lg flex items-center">
              <KpiCard title="Adverse Events" value={totalAdverseEvents} icon={Frown} />
            </div>
            <div key="demographics">
                <ChartCard title="Demographics">
                    <DemographicsCharts data={data} onFilterChange={onFilterChange} activeFilters={activeFilters} />
                </ChartCard>
            </div>
            <div key="outcomes">
                <ChartCard title="Outcomes & Events">
                    <OutcomesCharts data={data} trial={trial} />
                </ChartCard>
            </div>
          </ResponsiveGridLayout>
        </div>
    </div>
  );
};

export default Dashboard;