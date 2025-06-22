import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const DetailItem = ({ label, value }) => (
  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value}</dd>
  </div>
);

const PatientDetail = ({ data }) => {
  const { patientId } = useParams();
  const patient = data.find(p => p.patientID === patientId);

  if (!patient) {
    return <div>Patient not found.</div>;
  }

  return (
    <div>
       <Link to="/patients" className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-800 mb-4">
        <ArrowLeft size={16} />
        Back to Patient List
      </Link>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-xl leading-6 font-bold text-gray-900">
            Patient Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Details for Patient ID: {patient.patientID}
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <DetailItem label="Age" value={patient.age} />
            <DetailItem label="Gender" value={patient.gender} />
            <DetailItem label="Race" value={patient.race} />
            <DetailItem label="Treatment Arm" value={patient.treatmentArm} />
            <DetailItem label="Last Visit Date" value={new Date(patient.visitDate).toLocaleDateString()} />
            <DetailItem label="Outcome 1 Value" value={patient.outcome1} />
            <DetailItem label="Adverse Event" value={patient.adverseEvent} />
          </dl>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;