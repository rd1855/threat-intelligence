// frontend/src/pages/Report/components/SecurityAuditLog.js
import React from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

const SecurityAuditLog = ({ logs }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getActionIcon = (action) => {
    if (action.includes('DELETE')) return '🗑️';
    if (action.includes('DOWNLOAD')) return '📥';
    if (action.includes('GENERATE')) return '⚡';
    if (action.includes('EXPORT')) return '📤';
    if (action.includes('ERROR')) return '❌';
    return '📝';
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Security Audit Log
          </h3>
          <span className="text-sm text-gray-500">
            {logs.length} activities logged
          </span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Severity
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(log.timestamp), 'HH:mm:ss')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="mr-2">{getActionIcon(log.action)}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {log.action}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.user}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {log.details}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex text-xs px-2 py-1 rounded-full ${getSeverityColor(log.severity)}`}>
                    {log.severity.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {logs.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          No audit logs available
        </div>
      )}
      
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500">
          🔒 Audit logs are security-critical and cannot be modified. All activities are logged with timestamps and user information.
        </p>
      </div>
    </div>
  );
};

SecurityAuditLog.propTypes = {
  logs: PropTypes.array.isRequired
};

export default SecurityAuditLog;