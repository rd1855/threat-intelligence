import axios from 'axios';

const API_BASE = "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000, // Increased timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`📤 Making request to: ${config.baseURL}${config.url}`);
    console.log(`📤 Params:`, config.params);
    return config;
  },
  (error) => {
    console.error('📤 Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`📥 Response from: ${response.config.url}`);
    console.log(`📥 Status: ${response.status}`);
    return response;
  },
  (error) => {
    console.error('📥 Response error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

export async function scanDomain(domain) {
  try {
    console.log(`🔍 Starting scan for domain: ${domain}`);
    
    // Test if backend is reachable first
    try {
      await api.get('/health');
      console.log('✅ Backend health check passed');
    } catch (healthError) {
      console.error('❌ Backend health check failed:', healthError.message);
      throw new Error(`Cannot connect to backend at ${API_BASE}. Make sure it's running.`);
    }
    
    const response = await api.get('/scan', {
      params: { domain }
    });
    
    console.log('✅ Scan successful');
    return response.data;
    
  } catch (error) {
    console.error('❌ Scan failed with details:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    
    // Enhanced error handling
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout after 15 seconds. Backend might be slow or unresponsive.');
    }
    
    if (error.code === 'ERR_NETWORK') {
      throw new Error(`Network error. Cannot connect to ${API_BASE}. Is the backend running?`);
    }
    
    if (!error.response) {
      throw new Error(`No response from backend. Check if it's running at ${API_BASE}`);
    }
    
    // Handle specific HTTP status codes
    switch (error.response.status) {
      case 400:
        throw new Error(error.response.data?.detail || 'Invalid request. Please check domain format.');
      case 429:
        throw new Error('Rate limit exceeded. Please wait 1 minute before trying again.');
      case 500:
        console.error('Backend 500 error details:', error.response.data);
        throw new Error('Backend server error. The scan endpoint crashed. Check backend logs.');
      case 502:
      case 503:
      case 504:
        throw new Error('Backend service unavailable. Please try again later.');
      default:
        throw new Error(error.response.data?.detail || `Scan failed with status ${error.response.status}`);
    }
  }
}

export async function checkBackendHealth() {
  try {
    const response = await api.get('/health', { timeout: 5000 });
    return {
      status: 'healthy',
      data: response.data,
      responseTime: response.headers['x-response-time']
    };
  } catch (error) {
    console.error('Health check failed:', error.message);
    return {
      status: 'unhealthy',
      error: error.message,
      code: error.code
    };
  }
}

// Test connection with detailed diagnostics
export async function testConnection() {
  try {
    console.log(`Testing connection to ${API_BASE}...`);
    
    // Try multiple endpoints
    const endpoints = ['/', '/health', '/scan?domain=test.com'];
    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        const response = await api.get(endpoint, { timeout: 5000 });
        results.push({
          endpoint,
          status: 'success',
          statusCode: response.status,
          data: endpoint === '/' ? response.data.message : 'OK'
        });
      } catch (err) {
        results.push({
          endpoint,
          status: 'failed',
          error: err.message,
          statusCode: err.response?.status
        });
      }
    }
    
    return {
      connected: results.some(r => r.status === 'success'),
      results,
      baseUrl: API_BASE
    };
    
  } catch (error) {
    return {
      connected: false,
      error: error.message,
      baseUrl: API_BASE
    };
  }
}

// Simple test scan with mock data as fallback
export async function safeScanDomain(domain) {
  try {
    const result = await scanDomain(domain);
    return result;
  } catch (error) {
    console.error('Scan failed, using mock data as fallback:', error.message);
    
    // Return mock data if backend fails
    return {
      domain: domain,
      timestamp: new Date().toISOString(),
      reputation: 75,
      last_analysis_stats: {
        harmless: 65,
        malicious: 3,
        suspicious: 5,
        undetected: 7
      },
      categories: {
        security: "clean",
        reputation: "good"
      },
      whois: `Domain: ${domain}\nStatus: Mock data (Backend: ${error.message})`,
      alienvault_otx: {
        domain: domain,
        otx_pulse_count: 0,
        related_pulses: [],
        reputation: "N/A"
      },
      scan_id: `mock_${Date.now()}`,
      _mock_data: true,
      _error: error.message
    };
  }
}

// Report functions (keep as is)
export async function getReports() {
  try {
    // Mock data for now - replace with actual API call later
    return [
      {
        id: "1",
        title: "Weekly Security Report",
        description: "Weekly summary of security threats and incidents",
        severity: "medium",
        status: "completed",
        createdAt: new Date().toISOString(),
        generatedBy: "System",
        findings: ["Phishing attempt detected", "Malware scan completed"],
        recommendations: ["Update firewall rules", "Review access logs"]
      },
      {
        id: "2",
        title: "Incident Report #245",
        description: "Detailed report on security incident from Jan 15",
        severity: "high",
        status: "completed",
        createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        generatedBy: "Admin",
        findings: ["Unauthorized access attempt", "Failed login attempts"],
        recommendations: ["Implement 2FA", "Review user permissions"]
      },
      {
        id: "3",
        title: "Threat Analysis - Q1",
        description: "Quarterly threat analysis report",
        severity: "low",
        status: "pending",
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        generatedBy: "Analyst",
        findings: ["Increased scanning activity", "New malware variants"],
        recommendations: ["Update antivirus signatures", "Conduct security training"]
      }
    ];
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
}

export async function generateReport(config) {
  try {
    // Mock response for now
    const newReport = {
      id: `report_${Date.now()}`,
      title: config.title || "Untitled Report",
      description: config.description || "",
      severity: config.severity || "medium",
      status: "completed",
      createdAt: new Date().toISOString(),
      generatedBy: "User",
      findings: ["Sample finding 1", "Sample finding 2"],
      recommendations: ["Sample recommendation 1", "Sample recommendation 2"]
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return newReport;
  } catch (error) {
    console.error("Error generating report:", error);
    throw new Error("Failed to generate report");
  }
}

export async function downloadReport(reportId, format = 'pdf') {
  try {
    // Mock download - replace with actual API call later
    const content = `Report ID: ${reportId}\nFormat: ${format}\nGenerated: ${new Date().toISOString()}\n\nThis is a mock report for testing.`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    return blob;
  } catch (error) {
    console.error("Error downloading report:", error);
    throw new Error("Failed to download report");
  }
}

export async function deleteReport(reportId) {
  try {
    // Mock deletion - replace with actual API call later
    console.log(`Mock deleting report: ${reportId}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { success: true, message: "Report deleted successfully" };
  } catch (error) {
    console.error("Error deleting report:", error);
    throw new Error("Failed to delete report");
  }
}

export default api;