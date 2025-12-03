// frontend/src/pages/Report/components/ReportGenerator.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { sanitizeInput, validateDateRange } from '../../../utils/security';

const ReportGenerator = ({ onGenerate, generating, scanCount }) => {
  const [reportConfig, setReportConfig] = useState({
    title: '',
    type: 'summary',
    description: '',
    dateRange: { start: '', end: '' },
    includeThreats: true,
    includeRecommendations: true,
    format: 'pdf'
  });
  const [validationError, setValidationError] = useState('');

  const handleInputChange = (field, value) => {
    const sanitizedValue = field === 'title' || field === 'description' 
      ? sanitizeInput(value, { maxLength: field === 'title' ? 200 : 1000 })
      : value;
    
    setReportConfig(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));
    
    // Clear validation error when user types
    if (validationError) setValidationError('');
  };

  const handleDateChange = (field, value) => {
    setReportConfig(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    if (!reportConfig.title.trim()) {
      setValidationError('Report title is required');
      return false;
    }

    if (reportConfig.title.length > 200) {
      setValidationError('Title must be less than 200 characters');
      return false;
    }

    if (reportConfig.dateRange.start && reportConfig.dateRange.end) {
      const validation = validateDateRange(reportConfig.dateRange);
      if (!validation.valid) {
        setValidationError(validation.error);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Check rate limit
    if (scanCount >= 5) {
      setValidationError('Rate limit exceeded. Please wait before generating another report.');
      return;
    }
    
    onGenerate(reportConfig);
    
    // Reset form after successful submission
    setReportConfig({
      title: '',
      type: 'summary',
      description: '',
      dateRange: { start: '', end: '' },
      includeThreats: true,
      includeRecommendations: true,
      format: 'pdf'
    });
  };

  const reportTypes = [
    { value: 'summary', label: 'Executive Summary', icon: '📊' },
    { value: 'detailed', label: 'Detailed Analysis', icon: '🔍' },
    { value: 'incident', label: 'Incident Report', icon: '🚨' },
    { value: 'trend', label: 'Trend Analysis', icon: '📈' },
    { value: 'compliance', label: 'Compliance Report', icon: '📋' }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Generate New Report
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Report Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Title *
            </label>
            <input
              type="text"
              value={reportConfig.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter report title"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
              maxLength="200"
              required
            />
          </div>
          
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {reportTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleInputChange('type', type.value)}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    reportConfig.type === type.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-lg mb-1">{type.icon}</div>
                  <div className="text-sm font-medium">{type.label}</div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Report Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Output Format
            </label>
            <div className="flex space-x-3">
              {['pdf', 'json', 'csv'].map((format) => (
                <button
                  key={format}
                  type="button"
                  onClick={() => handleInputChange('format', format)}
                  className={`px-4 py-2 border rounded-lg transition-colors ${
                    reportConfig.format === format
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={reportConfig.dateRange.start}
                onChange={(e) => handleDateChange('start', e.target.value)}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
                max={new Date().toISOString().split('T')[0]}
              />
              <input
                type="date"
                value={reportConfig.dateRange.end}
                onChange={(e) => handleDateChange('end', e.target.value)}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
                max={new Date().toISOString().split('T')[0]}
                min={reportConfig.dateRange.start}
              />
            </div>
          </div>
          
          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Options
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={reportConfig.includeThreats}
                  onChange={(e) => handleInputChange('includeThreats', e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <span className="ml-2 text-gray-700">Include Threat Details</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={reportConfig.includeRecommendations}
                  onChange={(e) => handleInputChange('includeRecommendations', e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <span className="ml-2 text-gray-700">Include Recommendations</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={reportConfig.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter report description..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
            rows="3"
            maxLength="1000"
          />
        </div>
        
        {/* Validation Error */}
        {validationError && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{validationError}</p>
          </div>
        )}
        
        {/* Rate Limit Warning */}
        {scanCount >= 3 && (
          <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700 text-sm">
              ⚠️ You have generated {scanCount} reports recently. Limit is 5 per minute.
            </p>
          </div>
        )}
        
        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Reports are generated with maximum security and audit logging enabled.
          </div>
          <button
            type="submit"
            disabled={generating || !reportConfig.title.trim()}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              generating || !reportConfig.title.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {generating ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : 'Generate Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

ReportGenerator.propTypes = {
  onGenerate: PropTypes.func.isRequired,
  generating: PropTypes.bool.isRequired,
  scanCount: PropTypes.number.isRequired
};

export default ReportGenerator;