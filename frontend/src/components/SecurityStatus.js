// frontend/src/components/SecurityStatus.js
import React from 'react';
import PropTypes from 'prop-types';

const SecurityStatus = ({ scanCount, lastScanTime, onResetCounter }) => {
  const getSecurityLevel = () => {
    if (scanCount >= 4) return 'High Alert';
    if (scanCount >= 2) return 'Moderate';
    return 'Normal';
  };

  const getSecurityColor = () => {
    if (scanCount >= 4) return 'text-red-600';
    if (scanCount >= 2) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="mb-4 sm:mb-0">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Security Status</h3>
              <div className="flex items-center space-x-4 mt-1">
                <span className={`text-sm font-medium ${getSecurityColor()}`}>
                  Level: {getSecurityLevel()}
                </span>
                <span className="text-xs text-gray-500">
                  • Scans: {scanCount}/5 per minute
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Last scan</p>
            <p className="text-sm font-medium text-gray-800">
              {lastScanTime 
                ? new Date(lastScanTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Never'
              }
            </p>
          </div>
          <button
            onClick={onResetCounter}
            className="px-3 py-1 text-xs bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            title="Reset rate limit counter"
          >
            Reset
          </button>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-blue-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-xs text-gray-600">CSRF Protection</span>
          </div>
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-xs text-gray-600">Input Validation</span>
          </div>
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-xs text-gray-600">XSS Protection</span>
          </div>
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-xs text-gray-600">Rate Limiting</span>
          </div>
        </div>
      </div>
    </div>
  );
};

SecurityStatus.propTypes = {
  scanCount: PropTypes.number.isRequired,
  lastScanTime: PropTypes.instanceOf(Date),
  onResetCounter: PropTypes.func.isRequired
};

SecurityStatus.defaultProps = {
  lastScanTime: null
};

export default SecurityStatus;