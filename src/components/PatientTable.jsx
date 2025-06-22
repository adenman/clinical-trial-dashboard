import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ArrowUpDown, Search } from 'lucide-react';

const PatientTable = ({ data }) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);

  const columns = useMemo(() => [
    {
      accessorKey: 'patientID',
      header: 'Patient ID',
      cell: info => <div className="font-medium text-gray-900">{info.getValue()}</div>,
    },
    {
      accessorKey: 'age',
      header: ({ column }) => (
        <button className="flex items-center gap-2" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Age
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
    },
    {
      accessorKey: 'treatmentArm',
      header: 'Treatment Arm',
    },
    {
      id: 'actions',
      header: 'Details',
      cell: ({ row }) => (
        <Link 
          to={`/patient/${row.original.patientID}`}
          className="text-violet-600 hover:text-violet-800 font-semibold"
        >
          View Details
        </Link>
      ),
    }
  ], []);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">All Trial Participants</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="Search all columns..."
            className="w-full max-w-xs pl-10 pr-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left table-auto">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="py-3 px-4 text-gray-600 uppercase text-sm font-semibold">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="text-gray-700">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="py-3 px-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientTable;