🛡️ Threat Intelligence Dashboard

A modern, full-stack Threat Intelligence Dashboard built with React (Frontend) and FastAPI (Backend).
Scan domains, analyze threats, generate security reports, and manage intelligence data — all with enterprise-grade OWASP-aligned security.

✨ Key Features
🔍 Core Functionality

Domain Threat Scanning
Scan domains using VirusTotal and AlienVault OTX APIs.

Real-time Analytics
Visual dashboards and live threat statistics.

Report Generation
Create detailed security reports in multiple formats.

Threat Management
Track, archive, and manage security incidents.

System Configuration
Manage application settings and API keys.

🔒 OWASP Security Implementation
OWASP Risk	Implementation
A01: Broken Access Control	RBAC, JWT authentication
A02: Cryptographic Failures	HTTPS, secure password hashing, encrypted storage
A03: Injection Prevention	Input validation, parameterized queries, NoSQL protection
A04: Insecure Design	Threat modeling, secure-by-design workflows
A05: Security Misconfiguration	Security headers, environment configs, CORS
A06: Vulnerable Components	Dependency scanning & updates
A07: Identification & Authentication Failures	MFA, session security
A08: Software Integrity Failures	Code signing & integrity checks
A09: Security Logging & Monitoring	Audit logs, monitoring
A10: SSRF Protection	URL validation, request whitelisting
🚀 Quick Start Guide
Prerequisites

Python 3.8+

Node.js 16+

MongoDB (Local or Atlas)

Optional API Keys:

VirusTotal API Key

AlienVault OTX Key

📦 Installation & Execution
1. Clone Repository
git clone https://github.com/yourusername/threat-intelligence.git
cd threat-intelligence

2. Backend Setup (FastAPI)
cd backend

# Install dependencies
pip install -r requirements.txt

# Environment setup
cp .env.example .env
# Add MongoDB URI & API keys inside .env

# Run server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

3. Frontend Setup (React)
cd frontend
npm install
npm start

4. Access Application

Frontend Dashboard: http://localhost:3000

Backend API: http://localhost:8000

API Docs: http://localhost:8000/docs

📁 Project Structure
threat-intelligence/
├── backend/
│   ├── main.py
│   ├── .env
│   ├── requirements.txt
│   ├── security/
│   │   ├── authentication.py
│   │   ├── validation.py
│   │   └── middleware.py
│   └── tests/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── ErrorBoundary.js
│       │   └── SecurityStatus.js
│       ├── hooks/
│       │   └── useRateLimit.js
│       ├── pages/
│       ├── services/api.js
│       ├── utils/security.js
│       ├── App.js
│       └── index.js
│
├── .env.example
├── docker-compose.yml
└── README.md

🔧 API Usage
Base URL:

http://localhost:8000

🔍 Scan Endpoints
Method	Endpoint	Description
GET	/	Health check
GET	/health	API status
GET	/scan?domain=example.com	Scan domain
📊 Report Endpoints
Method	Endpoint	Description
GET	/reports	List all reports
POST	/reports/generate	Create a new report
GET	/reports/{id}	Get report details
DELETE	/reports/{id}	Delete report
⚙️ System Endpoints
Method	Endpoint	Description
GET	/system/status	System metrics
GET	/security/config	Security configuration
GET	/audit/logs	Audit logs
POST	/auth/login	User login
📝 Example Requests
curl "http://localhost:8000/scan?domain=google.com"
curl "http://localhost:8000/health"
curl "http://localhost:8000/openapi.json"

🔐 Security Configuration
Backend Security

Pydantic-based input validation

Rate limiting per IP

Security headers: CSP, HSTS, etc.

CORS protection

Encrypted data storage

Secure error handling

Frontend Security

DOMPurify input sanitization

CSRF token authentication

Content Security Policy

Encrypted localStorage

Error boundaries for secure fallback

🐳 Docker Deployment
Quick Start
docker-compose up -d
docker-compose logs -f
docker-compose down

Included Services:

MongoDB

FastAPI backend

React frontend

NGINX reverse proxy with SSL

📈 Production Deployment Checklist
Pre-Deployment

✔ Update environment variables
✔ Enable HTTPS (SSL)
✔ Configure firewall rules
✔ Set up backups
✔ CI/CD + security scanning

Security Hardening

✔ Rate limiting
✔ Verified CORS
✔ Audit logs
✔ Dependency scanning
✔ Security headers

Monitoring

✔ SIEM integration
✔ Performance monitoring
✔ Error tracking
✔ Usage analytics

🧪 Testing
Security Tests
cd backend
pytest tests/security/
npm audit
pip-audit

OWASP ZAP Scan
docker run -v $(pwd):/zap/wrk -t owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:3000 -r security-report.html

Performance Test
k6 run --vus 10 --duration 30s tests/load-test.js

🤝 Contributing
Workflow

Fork repo

Create feature branch

Implement securely

Add/update security tests

Create PR with security checklist

Security Checklist

Input validation

Output encoding

Authentication

Authorization

Secure error handling

No sensitive exposure

Updated dependencies

Security headers enabled

📚 Documentation
Additional Resources:

OWASP Top 10

FastAPI Security

React Security

Project Wiki

🚨 Troubleshooting
Issue	Solution
Backend not starting	Check MongoDB & port 8000
Frontend errors	Check CORS, backend status
API scan failing	Check API keys
Database issues	Ensure MongoDB service is running
Debug Mode
# Backend
python -m debugpy --listen 0.0.0.0:5678 -m uvicorn main:app --reload

# Frontend
npm start --verbose

📄 License

MIT License — See LICENSE.

🙏 Acknowledgments

OWASP & NIST Frameworks

VirusTotal & AlienVault OTX APIs

FastAPI, React, MongoDB

Bandit, npm audit, OWASP ZAP

⭐ Support

Issues: GitHub Issues

Security Reports: security@example.com

Wiki: Project documentation

🔒 Security is a journey — stay vigilant!