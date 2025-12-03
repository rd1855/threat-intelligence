🛡️ Threat Intelligence Dashboard
A modern Threat Intelligence Dashboard with comprehensive security features, built with React frontend and FastAPI backend. Scan domains for threats, generate security reports, and manage intelligence data with enterprise-grade security.

✨ Key Features
🔍 Core Functionality
Domain Threat Scanning - Scan domains using VirusTotal and AlienVault OTX APIs

Real-time Analytics - Visual threat statistics and dashboards

Report Generation - Generate detailed security reports in multiple formats

Threat Management - Track and manage security incidents

System Configuration - Manage API keys and application settings

🔒 OWASP Security Implementation
A01: Broken Access Control - Role-based access control (RBAC), JWT authentication

A02: Cryptographic Failures - HTTPS enforcement, secure password hashing, encrypted data storage

A03: Injection Prevention - Input validation, parameterized queries, NoSQL injection protection

A04: Insecure Design - Secure by design principles, threat modeling

A05: Security Misconfiguration - Security headers, CORS policies, environment-based configurations

A06: Vulnerable Components - Dependency scanning, regular updates

A07: Authentication Failures - Multi-factor authentication, session management, password policies

A08: Software Integrity - Code signing, integrity checks

A09: Security Logging - Comprehensive audit logging, monitoring

A10: Server-Side Request Forgery - URL validation, request whitelisting

🚀 Quick Start
Prerequisites
Python 3.8+ and Node.js 16+

MongoDB (local installation or Atlas cloud)

API Keys (optional for enhanced features):

VirusTotal API Key

AlienVault OTX Key

Installation & Execution
1. Clone the Repository
bash
git clone https://github.com/yourusername/threat-intelligence.git
cd threat-intelligence
2. Backend Setup & Execution
bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and API keys

# Run backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
3. Frontend Setup & Execution
bash
cd frontend

# Install Node.js dependencies
npm install

# Start development server
npm start
4. Access the Application
Frontend Dashboard: http://localhost:3000

Backend API: http://localhost:8000

API Documentation: http://localhost:8000/docs

📁 Project Structure
text
threat-intelligence/
├── backend/                           # FastAPI Backend
│   ├── main.py                       # Main application with security middleware
│   ├── .env                          # Environment variables (MongoDB, API keys)
│   ├── requirements.txt              # Python dependencies with security packages
│   ├── security/                     # Security modules
│   │   ├── authentication.py         # JWT authentication
│   │   ├── validation.py             # Input validation schemas
│   │   └── middleware.py             # Security middleware
│   └── tests/                        # Security test cases
│
├── frontend/                         # React Frontend
│   ├── public/                       # Static assets
│   └── src/
│       ├── components/               # Reusable UI components
│       │   ├── ErrorBoundary.js     # Error boundary for security
│       │   └── SecurityStatus.js    # Security status display
│       ├── hooks/                    # Custom React hooks
│       │   └── useRateLimit.js      # Client-side rate limiting
│       ├── pages/                    # Application pages
│       │   ├── Dashboard/           # Main threat scanning dashboard
│       │   ├── Threats/             # Threat management interface
│       │   ├── Reports/             # Report generation system
│       │   └── Settings/            # Security configurations
│       ├── services/                 # API services
│       │   └── api.js               # Secure Axios configuration
│       ├── utils/                    # Utility functions
│       │   └── security.js          # Frontend security utilities
│       ├── App.js                    # Main application with routing
│       └── index.js                  # Application entry point
│
├── .env.example                      # Environment template
├── .gitignore                       # Git ignore rules
├── docker-compose.yml               # Docker setup for production
└── README.md                        # This documentation
🔧 API Usage
Base URL: http://localhost:8000
🔍 Scan Endpoints
text
GET  /                      # Health check and system status
GET  /health               # API health status
GET  /scan?domain=example.com  # Scan domain for threats
📊 Report Endpoints
text
GET     /reports           # List all security reports
POST    /reports/generate  # Generate new threat report
GET     /reports/{id}      # Get specific report details
DELETE  /reports/{id}      # Delete security report
⚙️ System Endpoints
text
GET  /system/status        # System health and metrics
GET  /security/config      # Security configuration
GET  /audit/logs          # Security audit logs
POST /auth/login          # User authentication
📝 Example Requests
bash
# Scan a domain
curl "http://localhost:8000/scan?domain=google.com"

# Check system health
curl "http://localhost:8000/health"

# Get API documentation
curl "http://localhost:8000/openapi.json"
🔐 Security Configuration
Backend Security Features
Input Validation: Pydantic models with regex validation

Rate Limiting: Request throttling per IP/endpoint

CORS Protection: Whitelisted origins only

Security Headers: CSP, HSTS, X-Frame-Options

Audit Logging: Comprehensive activity tracking

Error Handling: Generic error messages (no info disclosure)

Frontend Security Features
XSS Protection: DOMPurify for input sanitization

CSRF Tokens: Token-based request validation

Content Security Policy: Restricted resource loading

Secure Storage: Encrypted localStorage usage

Error Boundaries: Graceful error handling

🐳 Docker Deployment
Quick Deployment with Docker Compose
bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
Services Included:
MongoDB: Database server

Backend: FastAPI application

Frontend: React application

Nginx: Reverse proxy with SSL (production)

📈 Production Deployment Checklist
Pre-Deployment
Update all environment variables for production

Configure HTTPS with valid SSL certificates

Set up firewall rules and security groups

Configure database backups and monitoring

Set up CI/CD pipeline with security scans

Security Hardening
Enable all security headers

Configure proper CORS policies

Set up rate limiting appropriate for production

Enable audit logging and monitoring

Regular dependency vulnerability scanning

Monitoring
Application performance monitoring

Security event logging (SIEM integration)

Error tracking and alerting

Usage analytics and reporting

🧪 Testing
Security Testing
bash
# Run security tests
cd backend
pytest tests/security/

# Dependency vulnerability scan
npm audit  # Frontend
pip-audit  # Backend

# OWASP ZAP scan (optional)
docker run -v $(pwd):/zap/wrk -t owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:3000 -r security-report.html
Performance Testing
bash
# Load test the API
k6 run --vus 10 --duration 30s tests/load-test.js
🤝 Contributing
Development Workflow
Fork the repository

Create a feature branch (git checkout -b feature/security-enhancement)

Implement changes with security considerations

Add/update security tests

Create Pull Request with security review checklist

Security Review Checklist
Input validation implemented

Output encoding applied

Authentication checks in place

Authorization verified

Error handling secure

No sensitive data exposure

Dependencies updated

Security headers configured

📚 Documentation
Additional Resources
API Documentation - Interactive Swagger UI

Security Guidelines - Detailed security implementation

Deployment Guide - Production deployment instructions

Troubleshooting Guide - Common issues and solutions

Learning Resources
OWASP Top 10

FastAPI Security

React Security

🚨 Troubleshooting
Common Issues & Solutions
Issue	Solution
Backend not starting	Check MongoDB connection, port 8000 availability
Frontend connection errors	Verify CORS settings, backend is running
Scan requests failing	Check API keys in .env, network connectivity
Database connection issues	Verify MongoDB service is running
Debug Mode
bash
# Backend with detailed logging
cd backend
python -m debugpy --listen 0.0.0.0:5678 -m uvicorn main:app --reload

# Frontend development
cd frontend
npm start --verbose
📄 License
MIT License - See LICENSE file for details.

🙏 Acknowledgments
Security Frameworks: OWASP, NIST Cybersecurity Framework

APIs: VirusTotal, AlienVault OTX

Libraries: FastAPI, React, MongoDB

Security Tools: Bandit, npm audit, OWASP ZAP

📞 Support
Issues: GitHub Issues

Security Reports: security@example.com

Documentation: Project Wiki

⭐ Star this repository if you find it useful!

🔒 Security is a journey, not a destination. Stay vigilant!

🎯 Quick Reference
Command	Description
cd backend && uvicorn main:app --reload	Start backend server
cd frontend && npm start	Start frontend development
docker-compose up -d	Start with Docker
pytest tests/	Run security tests
npm audit	Check frontend vulnerabilities
Last Updated: December 2024
Version: 1.0.0
Status: Production Ready 🟢