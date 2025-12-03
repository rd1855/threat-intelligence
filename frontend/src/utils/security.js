// frontend/src/utils/security.js
import DOMPurify from 'dompurify';

// Domain validation regex - OWASP compliant
const DOMAIN_REGEX = /^(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,})$/;
const MAX_DOMAIN_LENGTH = 253;

// Blacklisted domains and patterns
const BLACKLISTED_PATTERNS = [
  // Local addresses
  /^localhost$/i,
  /^127\.\d+\.\d+\.\d+$/,
  /^0\.\d+\.\d+\.\d+$/,
  /^::1$/,
  
  // Private network addresses
  /^10\.\d+\.\d+\.\d+$/,
  /^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/,
  /^192\.168\.\d+\.\d+$/,
  
  // Test domains
  /^test\./i,
  /^example\./i,
  /\.test$/i,
  /\.example$/i,
  
  // Malicious patterns
  /\.(local|lan|home)$/i,
  /\.(php|asp|aspx|jsp|pl)$/i,
  /\.(exe|bat|cmd|sh|js|vbs)$/i,
];

// Injection patterns to block
const INJECTION_PATTERNS = [
  /[<>"'`]/,
  /javascript:/i,
  /data:/i,
  /vbscript:/i,
  /on\w+=/i,
  /expression\(/i,
  /url\(/i,
  /@import/i,
  /\\x[0-9a-f]{2}/i,
  /\\u[0-9a-f]{4}/i,
  /&[#\w]+;/,
];

// Configure DOMPurify for maximum security
DOMPurify.setConfig({
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed', 'link'],
  FORBID_ATTR: ['style', 'onerror', 'onload', 'onclick', 'onmouseover'],
  USE_PROFILES: { html: false, svg: false, svgFilters: false },
});

/**
 * Validate a domain name with OWASP security checks
 * @param {string} domain - Domain to validate
 * @param {boolean} showErrors - Whether to return detailed errors
 * @returns {Object} Validation result
 */
export const validateDomain = (domain, showErrors = true) => {
  if (typeof domain !== 'string') {
    return {
      valid: false,
      error: showErrors ? 'Invalid input type' : 'Invalid domain'
    };
  }

  const trimmedDomain = domain.trim().toLowerCase();
  
  // Check length
  if (trimmedDomain.length === 0) {
    return {
      valid: false,
      error: showErrors ? 'Domain cannot be empty' : 'Invalid domain'
    };
  }

  if (trimmedDomain.length > MAX_DOMAIN_LENGTH) {
    return {
      valid: false,
      error: showErrors ? `Domain too long (max ${MAX_DOMAIN_LENGTH} characters)` : 'Invalid domain'
    };
  }

  // Check for blacklisted patterns
  for (const pattern of BLACKLISTED_PATTERNS) {
    if (pattern.test(trimmedDomain)) {
      return {
        valid: false,
        error: showErrors ? 'This domain is not allowed for scanning' : 'Invalid domain'
      };
    }
  }

  // Check for injection patterns
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(trimmedDomain)) {
      return {
        valid: false,
        error: showErrors ? 'Domain contains potentially malicious content' : 'Invalid domain'
      };
    }
  }

  // Validate domain structure
  if (!DOMAIN_REGEX.test(trimmedDomain)) {
    return {
      valid: false,
      error: showErrors ? 'Invalid domain format. Use example.com format' : 'Invalid domain'
    };
  }

  // Check for consecutive dots or hyphens
  if (trimmedDomain.includes('..') || trimmedDomain.includes('.-') || 
      trimmedDomain.includes('-.') || trimmedDomain.includes('--')) {
    return {
      valid: false,
      error: showErrors ? 'Invalid domain format' : 'Invalid domain'
    };
  }

  // Check TLD length (2-63 characters)
  const tld = trimmedDomain.split('.').pop();
  if (tld.length < 2 || tld.length > 63) {
    return {
      valid: false,
      error: showErrors ? 'Invalid top-level domain' : 'Invalid domain'
    };
  }

  // Check each label length (1-63 characters)
  const labels = trimmedDomain.split('.');
  for (const label of labels) {
    if (label.length < 1 || label.length > 63) {
      return {
        valid: false,
        error: showErrors ? 'Domain segment too long or too short' : 'Invalid domain'
      };
    }
  }

  return { valid: true };
};

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - Input to sanitize
 * @param {Object} options - Sanitization options
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input, options = {}) => {
  if (input === null || input === undefined) {
    return '';
  }

  if (typeof input !== 'string') {
    // Convert to string if not already
    try {
      input = String(input);
    } catch {
      return '';
    }
  }

  const config = {
    maxLength: options.maxLength || 10000,
    allowHtml: options.allowHtml || false,
    allowScripts: options.allowScripts || false,
    ...options
  };

  // Apply DOMPurify with appropriate config
  const purifyConfig = {
    ALLOWED_TAGS: config.allowHtml ? ['b', 'i', 'em', 'strong', 'a'] : [],
    ALLOWED_ATTR: config.allowHtml ? ['href', 'title', 'target'] : [],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
  };

  if (config.allowScripts) {
    purifyConfig.ALLOWED_TAGS.push('script');
    purifyConfig.ALLOWED_ATTR.push('src', 'async', 'defer');
  }

  let sanitized = DOMPurify.sanitize(input, purifyConfig);

  // Trim and limit length
  sanitized = sanitized.trim();
  if (sanitized.length > config.maxLength) {
    sanitized = sanitized.substring(0, config.maxLength);
  }

  // Remove control characters (except tab, newline, carriage return)
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  return sanitized;
};

/**
 * Generate and manage CSRF tokens
 * @returns {string} CSRF token
 */
export const getCsrfToken = () => {
  try {
    // Check if token exists
    let token = localStorage.getItem('csrf_token') || 
                sessionStorage.getItem('csrf_token');

    if (!token || token.length < 32) {
      // Generate secure random token using Web Crypto API
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
      
      // Store in both localStorage and sessionStorage for redundancy
      localStorage.setItem('csrf_token', token);
      sessionStorage.setItem('csrf_token', token);
      
      // Set expiration (24 hours)
      localStorage.setItem('csrf_token_expires', (Date.now() + 24 * 60 * 60 * 1000).toString());
    }

    // Check expiration
    const expires = localStorage.getItem('csrf_token_expires');
    if (expires && Date.now() > parseInt(expires)) {
      // Token expired, generate new one
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
      
      localStorage.setItem('csrf_token', token);
      sessionStorage.setItem('csrf_token', token);
      localStorage.setItem('csrf_token_expires', (Date.now() + 24 * 60 * 60 * 1000).toString());
    }

    return token;
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    // Fallback to less secure random string
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
};

/**
 * Validate CSRF token
 * @param {string} token - Token to validate
 * @returns {boolean} Whether token is valid
 */
export const validateCsrfToken = (token) => {
  try {
    const storedToken = localStorage.getItem('csrf_token') || 
                       sessionStorage.getItem('csrf_token');
    
    if (!storedToken || !token) return false;
    
    // Use timing-safe comparison
    const encoder = new TextEncoder();
    const storedBuffer = encoder.encode(storedToken);
    const tokenBuffer = encoder.encode(token);
    
    if (storedBuffer.length !== tokenBuffer.length) return false;
    
    let result = 0;
    for (let i = 0; i < storedBuffer.length; i++) {
      result |= storedBuffer[i] ^ tokenBuffer[i];
    }
    
    return result === 0;
  } catch (error) {
    console.error('Error validating CSRF token:', error);
    return false;
  }
};

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  return text.replace(/[&<>"'`=\/]/g, char => map[char]);
};

/**
 * Validate URL for safe usage
 * @param {string} url - URL to validate
 * @returns {boolean} Whether URL is safe
 */
export const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);
    
    // Allow only HTTP/HTTPS
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }
    
    // Validate hostname
    return validateDomain(parsed.hostname, false).valid;
  } catch {
    return false;
  }
};

export const validateDateRange = (dateRange) => {
  if (!dateRange.start || !dateRange.end) {
    return { valid: true }; // Both dates optional
  }

  const startDate = new Date(dateRange.start);
  const endDate = new Date(dateRange.end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return {
      valid: false,
      error: 'Invalid date format'
    };
  }

  if (startDate > endDate) {
    return {
      valid: false,
      error: 'Start date cannot be after end date'
    };
  }

  // Limit to past dates only (no future dates)
  const today = new Date();
  if (startDate > today || endDate > today) {
    return {
      valid: false,
      error: 'Cannot select future dates'
    };
  }

  // Limit range to 1 year max
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  if (startDate < oneYearAgo) {
    return {
      valid: false,
      error: 'Date range cannot exceed 1 year'
    };
  }

  return { valid: true };
};