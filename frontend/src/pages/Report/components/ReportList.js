// frontend/src/pages/Report/components/ReportList.js
import React from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { sanitizeInput } from '../../../utils/security';

const ReportList = ({ reports, onDownload, onDelete }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'pending': return '⏳';
      case 'failed': return '❌';
      default: return '📄';
    }
  };

  const truncateText = (text, length = 100) => {
    if (!text) return '';
    const sanitized = sanitizeInput(text);
    return sanitized.length > length 
      ? sanitized.substring(0, length) + '...' 
      : sanitized;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">
          Security Reports ({reports.length})
        </h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {reports.map((report) => (
          <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex-1 mb-4 md:mb-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-medium text-gray-800">
                    {sanitizeInput(report.title)}
                  </h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(report.severity)}`}>
                    {report.severity.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {getStatusIcon(report.status)} {report.status}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3">
                  {truncateText(report.description, 150)}
                </p>
                
                <div className="flex flex-wrap items-center text-sm text-gray-500 space-x-4">
                  <span>ID: {report.id.substring(0, 8)}...</span>
                  <span>•</span>
                  <span>Created: {format(new Date(report.createdAt), 'MMM dd, yyyy')}</span>
                  <span>•</span>
                  <span>By: {sanitizeInput(report.generatedBy)}</span>
                </div>
                
                {report.findings && report.findings.length > 0 && (
                  <div className="mt-3">
                    <span className="text-sm font-medium text-gray-700">Findings:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {report.findings.slice(0, 3).map((finding, index) => (
                        <span 
                          key={index} 
                          className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                        >
                          {truncateText(finding, 30)}
                        </span>
                      ))}
                      {report.findings.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{report.findings.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => onDownload(report.id, 'pdf')}
                  className="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                  title="Download PDF"
                >
                  PDF
                </button>
                <button
                  onClick={() => onDownload(report.id, 'json')}
                  className="px-4 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100"
                  title="Download JSON"
                >
                  JSON
                </button>
                <button
                  onClick={() => onDelete(report.id)}
                  className="px-4 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                  title="Delete Report"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {reports.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          No reports match your filters
        </div>
      )}
    </div>
  );
};

ReportList.propTypes = {
  reports: PropTypes.array.isRequired,
  onDownload: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default ReportList;