 CI/CD Pipeline Guide – Threat Intelligence Dashboard

This document explains the Continuous Integration and Continuous Deployment (CI/CD) setup used for the **Threat Intelligence Dashboard** project.

The goal of this pipeline is to automatically build and deploy the application whenever changes are pushed to the GitHub repository.

---

## 📌 What is CI/CD in this Project?

### Continuous Integration (CI)
CI ensures that:
- The latest code is always pulled from GitHub
- Docker images for backend and frontend are built consistently
- Build failures are detected early

### Continuous Deployment (CD)
CD ensures that:
- The application is deployed using Docker Compose
- Existing containers are safely replaced
- The latest version is always running after a successful build

---

## 🧰 Tools Used

| Tool | Purpose |
|----|----|
| GitHub | Source code repository |
| Jenkins | CI/CD automation server |
| Docker | Containerization of services |
| Docker Compose | Multi-container application orchestration |
| FastAPI | Backend API |
| React | Frontend UI |
| MongoDB | Database |

---

## 🏗️ CI/CD Architecture Overview

Developer Pushes Code
↓
GitHub
↓
Jenkins
↓
Docker Build (Frontend + Backend)
↓
Docker Compose Deployment
↓
Running Application

yaml
Copy code

---

## 📁 Required Files for CI/CD

The following files must exist in the repository for CI/CD to work correctly:

threat-intelligence/
├── backend/
│ └── Dockerfile
├── frontend/
│ └── Dockerfile
├── docker-compose.yml
├── .env.example
└── Jenkinsfile

yaml
Copy code

---

## 🔐 Environment Variable Handling

- **`.env` is NOT stored in GitHub**
- **`.env.example` IS stored in GitHub**
- Jenkins dynamically creates `.env` from `.env.example` during deployment

This approach:
- Prevents secret leakage
- Keeps the pipeline secure
- Follows industry best practices

---

## ⚙️ Pipeline Workflow (High Level)

1. Jenkins cleans the workspace
2. Source code is cloned from GitHub
3. Environment file is prepared
4. Docker images are built
5. Existing containers are stopped (if running)
6. Application is deployed using Docker Compose

---

## 📜 Jenkins Pipeline Strategy

- The pipeline is defined in a **`Jenkinsfile`**
- Jenkins uses **Pipeline from SCM**
- This keeps CI/CD logic version-controlled
- Any pipeline change is tracked via Git history

---

## 🔁 Pipeline Trigger

Current trigger:
- Manual execution from Jenkins

Possible extensions:
- GitHub Webhook for automatic deployment on push
- Scheduled builds
- Branch-based pipelines

---

## 🧪 Build & Deployment Behavior

- The pipeline is **idempotent**
- Running the pipeline multiple times does not break the deployment
- Containers are recreated safely on every run
- Failed stages stop the deployment immediately

---

## 🚨 Common Failure Scenarios

| Issue | Cause | Resolution |
|----|----|----|
| `.env not found` | `.env.example` missing | Ensure `.env.example` exists in repo |
| Docker daemon error | Docker Desktop not running | Start Docker Desktop |
| Port already in use | Existing containers running | Pipeline handles shutdown automatically |
| Build failure | Code or dependency issue | Check Jenkins console logs |

---

## 🔒 Security Considerations

- Secrets are never committed to GitHub
- Environment files are created at runtime
- Jenkins access should be restricted in production
- Docker images should be scanned for vulnerabilities in future improvements

---

## 📈 Future Improvements

- GitHub Webhook for auto-trigger
- Multi-branch pipeline support
- Security scanning (OWASP, Trivy)
- Image versioning and tagging
- Deployment to cloud infrastructure

---

## ✅ Summary

This CI/CD pipeline ensures:
- Reliable builds
- Consistent deployments
- Secure environment handling
- Scalable automation practices

The setup follows real-world DevOps standards and can be extended easily for production use.

---

**CI/CD is not a one-time task — it is a continuous improvement process.**