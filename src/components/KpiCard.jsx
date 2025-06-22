import React from 'react';

const KpiCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
      <div className="bg-violet-100 text-violet-600 p-3 rounded-full mr-4">
        <Icon size={24} />
      </div>
      <div>
        <h4 className="text-gray-500 text-sm font-medium">{title}</h4>
        <p className="text-gray-900 text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default KpiCard;