# Threat Intelligence Dashboard

A modern **Threat Intelligence Dashboard** with a **React frontend** and **FastAPI backend**.  
Manage threats, reports, and system settings through an interactive web interface while the backend handles API requests and data management.

---

## Project Structure

```

threat-intelligence/
├── backend/
│   ├── main.py            # FastAPI backend code
│   ├── .env               # Environment variables (MongoDB URI, API keys)
│   ├── requirements.txt   # Python dependencies
│   └── any other backend files/modules
├── frontend/
│   ├── node_modules/      # Installed packages
│   ├── public/            # Public assets (index.html, favicon, etc.)
│   └── src/
│       ├── pages/         # Dashboard, Threats, Reports, Settings pages
│       ├── services/      # api.js for Axios calls
│       ├── App.css
│       ├── App.js
│       ├── App.test.js
│       ├── index.css
│       ├── index.js
│       ├── logo.svg
│       ├── reportWebVitals.js
│       └── setupTests.js
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── tailwind.config.js
└── README.md             # Root-level README

````

---

## Features

- Dashboard to visualize threats and reports.
- Manage system settings and configurations.
- FastAPI backend for API management.
- Responsive React frontend with Tailwind CSS styling.
- Axios services for frontend-backend communication.

---

## Tech Stack

- **Frontend:** React.js, Tailwind CSS, Axios
- **Backend:** FastAPI, Python
- **Database:** MongoDB (configure via `.env`)
- **Others:** Node.js, npm, Uvicorn

---

## Backend Setup

1. Navigate to the backend folder:

```bash
cd threat-intelligence/backend
````

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the FastAPI server:

```bash
uvicorn main:app --reload --port 8000
```

* The backend will run at: `http://localhost:8000`
* `--reload` enables auto-reload on code changes.

---

## Frontend Setup

1. Navigate to the frontend folder:

```bash
cd threat-intelligence/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

* The frontend will run at: `http://localhost:3000`
* Changes automatically reload the page.

---

## Available Scripts (Frontend)

* **`npm start`**: Runs the app in development mode.
* **`npm test`**: Launches the test runner in interactive watch mode.
* **`npm run build`**: Builds the app for production to the `build` folder.
* **`npm run eject`**: Exposes configuration files for full control (one-way operation).

---

## Notes

* Ensure the backend is running before using the frontend.
* Set environment variables in `.env` (e.g., MongoDB URI, API keys).
* Tailwind CSS is used for responsive styling.
* For production deployment, build the frontend using `npm run build`.

---

## Learn More

* [React documentation](https://reactjs.org/)
* [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
* [FastAPI documentation](https://fastapi.tiangolo.com/)

