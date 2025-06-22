import React from 'react';
import { Link } from 'react-router-dom';

const PatientList = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">All Trial Participants</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
              <th className="py-3 px-4 font-semibold">Patient ID</th>
              <th className="py-3 px-4 font-semibold">Age</th>
              <th className="py-3 px-4 font-semibold">Gender</th>
              <th className="py-3 px-4 font-semibold">Treatment Arm</th>
              <th className="py-3 px-4 font-semibold"></th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {data.map((patient) => (
              <tr key={patient.patientID} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4">{patient.patientID}</td>
                <td className="py-3 px-4">{patient.age}</td>
                <td className="py-3 px-4">{patient.gender}</td>
                <td className="py-3 px-4">{patient.treatmentArm}</td>
                <td className="py-3 px-4">
                  <Link 
                    to={`/patient/${patient.patientID}`}
                    className="text-violet-600 hover:text-violet-800 font-semibold"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientList;