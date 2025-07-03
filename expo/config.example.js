// Configuration file for Complaints Analyzer mobile app
// Copy this file to config.js and update the values according to your setup

export const CONFIG = {
  // Backend server URL - Update this with your backend server IP address
  // Examples:
  // - Local development: 'http://localhost:5000'
  // - Network access (replace with your IP): 'http://192.168.1.100:5000'
  // - Production: 'https://your-domain.com'
  BACKEND_URL: 'http://192.168.1.100:5000',
  
  // Maximum characters allowed in text input
  MAX_CHARACTERS: 10000,
  
  // API endpoints (relative to BACKEND_URL)
  ENDPOINTS: {
    ANALYZE: '/analyze',
    FEEDBACK: '/feedback'
  },
  
  // Request timeout in milliseconds
  REQUEST_TIMEOUT: 30000,
  
  // UI Configuration
  UI: {
    PRIMARY_COLOR: '#2196F3',
    SUCCESS_COLOR: '#4CAF50',
    WARNING_COLOR: '#FF9800',
    ERROR_COLOR: '#F44336',
    NEUTRAL_COLOR: '#757575'
  }
};

// Network utility functions
export const NetworkUtils = {
  // Helper function to get local IP address instruction
  getIPAddressInstructions: () => {
    return {
      windows: 'Run "ipconfig" in Command Prompt and look for IPv4 Address',
      mac: 'Run "ifconfig" in Terminal and look for inet under en0',
      linux: 'Run "ifconfig" in Terminal and look for inet under eth0/wlan0'
    };
  },
  
  // Test if backend URL is reachable
  testConnection: async (url) => {
    try {
      const response = await fetch(`${url}/health`, { 
        method: 'GET',
        timeout: 5000 
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
};