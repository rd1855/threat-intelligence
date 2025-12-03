// frontend/src/pages/Report/components/ReportFilters.js
import React, { useState } from 'react';
import { sanitizeInput } from '../../../utils/security';
import PropTypes from 'prop-types';

const ReportFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  onExportAll,
  exportDisabled 
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (field, value) => {
    const updated = {
      ...localFilters,
      [field]: field === 'searchQuery' ? sanitizeInput(value, { maxLength: 100 }) : value
    };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const handleDateChange = (field, value) => {
    const updated = {
      ...localFilters,
      dateRange: {
        ...localFilters.dateRange,
        [field]: value
      }
    };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const handleClear = () => {
    const cleared = {
      dateRange: { start: '', end: '' },
      severity: 'all',
      status: 'all',
      searchQuery: ''
    };
    setLocalFilters(cleared);
    onClearFilters();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 md:mb-0">
          Filter Reports
        </h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </button>
          <button
            onClick={onExportAll}
            disabled={exportDisabled}
            className={`px-4 py-2 text-sm rounded-lg ${
              exportDisabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Export All
          </button>
        </div>
      </div>

      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Reports
          </label>
          <input
            type="text"
            value={localFilters.searchQuery}
            onChange={(e) => handleInputChange('searchQuery', e.target.value)}
            placeholder="Search by title, description..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
            maxLength="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Severity
          </label>
          <select
            value={localFilters.severity}
            onChange={(e) => handleInputChange('severity', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="all">All Severities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={localFilters.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-gray-200 pt-6 mb-6">
          <h3 className="text-md font-semibold text-gray-700 mb-4">
            Advanced Filters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={localFilters.dateRange.start}
                onChange={(e) => handleDateChange('start', e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={localFilters.dateRange.end}
                onChange={(e) => handleDateChange('end', e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
                max={new Date().toISOString().split('T')[0]}
                min={localFilters.dateRange.start}
              />
            </div>
          </div>
        </div>
      )}

      {/* Filter Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleClear}
          className="px-4 py-2 text-sm text-red-600 hover:text-red-800"
        >
          Clear All Filters
        </button>
        <div className="text-sm text-gray-500">
          Showing {localFilters.searchQuery || localFilters.severity !== 'all' || localFilters.status !== 'all' ? 'filtered' : 'all'} reports
        </div>
      </div>
    </div>
  );
};

ReportFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  onExportAll: PropTypes.func.isRequired,
  exportDisabled: PropTypes.bool
};

export default ReportFilters;