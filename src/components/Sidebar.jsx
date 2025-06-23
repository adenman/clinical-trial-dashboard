import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, TestTube2, ChevronsUpDown, PlusCircle } from 'lucide-react';

const Sidebar = ({ trials, currentTrial, setCurrentTrial }) => {
  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors duration-200 ${
      isActive ? 'bg-gray-900 font-semibold' : ''
    }`;

  const handleTrialChange = (e) => {
    const trialId = e.target.value;
    const newTrial = trials.find(t => t.id === trialId);
    if (newTrial) {
      setCurrentTrial(newTrial);
    }
  };

  return (
    <aside className="w-64 min-h-screen bg-gray-800 text-white p-4 flex flex-col">
      <div className="flex items-center mb-6">
        <TestTube2 size={32} className="text-violet-400 mr-3" />
        <h1 className="text-xl font-bold">Clinical Trials</h1>
      </div>

      <div className="mb-6 px-2">
        <label htmlFor="trial-select" className="text-sm font-semibold text-gray-400 mb-2 block">
          Select Trial
        </label>
        <div className="relative">
          <select
            id="trial-select"
            value={currentTrial?.id || ''}
            onChange={handleTrialChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-3 pr-8 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {trials.map(trial => (
              <option key={trial.id} value={trial.id}>
                {trial.name}
              </option>
            ))}
          </select>
          <ChevronsUpDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <nav className="flex flex-col space-y-2 px-2">
        <NavLink to="/" className={navLinkClasses} end>
          <LayoutDashboard className="mr-3" size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/patients" className={navLinkClasses}>
          <Users className="mr-3" size={20} />
          <span>Patients</span>
        </NavLink>
        {/* --- NEW LINK --- */}
        <NavLink to="/create-trial" className={navLinkClasses}>
          <PlusCircle className="mr-3" size={20} />
          <span>Create Trial</span>
        </NavLink>
      </nav>
      
    </aside>
  );
};

export default Sidebar;