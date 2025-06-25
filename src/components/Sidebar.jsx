import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the auth hook
import { LayoutDashboard, Users, TestTube2, ChevronsUpDown, PlusCircle, LogOut } from 'lucide-react';

const Sidebar = ({ trials, currentTrial, setCurrentTrial }) => {
  const { user, logout } = useAuth(); // Get user and logout function from context

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
            {/* Add a check to ensure trials is not undefined before mapping */}
            {trials && trials.map(trial => (
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
        <NavLink to="/create-trial" className={navLinkClasses}>
          <PlusCircle className="mr-3" size={20} />
          <span>Create Trial</span>
        </NavLink>
      </nav>
      
      {/* User profile and logout button at the bottom */}
      <div className="mt-auto px-2">
        <div className="pt-4 border-t border-gray-700">
            <div className="text-sm text-gray-400 mb-2">Signed in as:</div>
            <div className="text-lg font-semibold text-white mb-4">{user?.username || 'Guest'}</div>
            <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
                <LogOut size={16} />
                Logout
            </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;