# Automated Contract Generator

A web application for creating service contracts from validated client, provider, and contract details. The FastAPI backend renders the contract template to a downloadable PDF, while the React frontend provides the form and PDF preview.

## ✨ Features

- **Runtime validation**: Pydantic validates email addresses, required fields, positive contract amounts, three-character currency codes, and expiration dates that must follow the effective date.
- **HTML-to-PDF generation**: Jinja2 renders contract data into an HTML template; WeasyPrint converts it to PDF with A4 pagination and page numbering.
- **Separate client and server**: The Vite/React frontend lives in `Client/`; the FastAPI backend lives in `server/`.
- **Responsive dark interface**: Tailwind CSS and Lucide React icons.
- **Dockerized PDF backend**: The server image installs the native Cairo, Pango, and GdkPixbuf libraries required by WeasyPrint.

## 🛠️ Tech Stack

- **Backend**: Python 3.11, FastAPI, Pydantic v2, Jinja2, WeasyPrint, Uvicorn.
- **Frontend**: React 18, Vite 5, Tailwind CSS 3, Lucide React.
- **Containerization/deployment**: Docker and Render Blueprint (API and client).

## ☁️ Deploy the full app to Render

The repository includes a `render.yaml` Blueprint that creates both services:

- `contractforge-api`: Docker web service built from `server/`, with `/health` as its health check.
- `contractforge-web`: static site built from `Client/`; its `VITE_API_URL` points to the API service.

Both services are configured for Render's free offering: static sites have no compute charge, and the API uses the `free` web-service plan. The free API has 512 MB RAM and spins down after 15 minutes without traffic; its first request after that can take about a minute while it starts. Free services also have monthly bandwidth and build-minute limits, so check the Render dashboard's usage and billing settings if you need to ensure you never exceed included usage.

To deploy, create a new Blueprint in Render, connect the `richardblancodev/ContractForge` GitHub repository, and select the branch to deploy. Render will read `render.yaml` and provision both services. The frontend is configured for `https://contractforge-web.onrender.com`, and the API CORS policy permits that origin.

If Render assigns a different public hostname, update the frontend `VITE_API_URL` and the backend `ALLOWED_ORIGIN_REGEX` environment variable in the Render dashboard to match the actual service URLs, then redeploy.

The backend may take a short time to respond after inactivity on plans that suspend idle services. During that time the frontend request can appear to be loading while the API starts.

## 🚀 Local Development

### Prerequisites

- Git
- Docker Desktop with the Linux container engine enabled (recommended for the backend PDF dependencies)
- Node.js 18 or newer and npm
- Python 3.11+ only if running the backend directly outside Docker

### 1. Start the backend with Docker

Run these commands from the repository root:

```bash
docker build -t automated-contract-generator-server -f server/Dockerfile server
docker run --rm --name automated-contract-generator-api -p 8000:8000 automated-contract-generator-server
```

The API will be available at `http://localhost:8000`. Interactive API documentation is at `http://localhost:8000/docs`, and the health check is at `http://localhost:8000/health`.

To run the backend in the background and have Docker restart it automatically:

```bash
docker run -d --restart unless-stopped --name automated-contract-generator-api -p 8000:8000 automated-contract-generator-server
```

Stop that background container with:

```bash
docker stop automated-contract-generator-api
```

### 2. Start the frontend

Open a second terminal and run:

```bash
cd Client
npm install
npm run dev
```

Vite prints the local URL, normally `http://localhost:5173`. The frontend calls the API at `http://localhost:8000/api/v1` by default.

To use a different API base URL, create `Client/.env.local` with:

```dotenv
VITE_API_URL=http://localhost:8000/api/v1
```

### 3. Build the frontend

From `Client/`:

```bash
npm run build
```

The generated production files are written to `Client/dist/` and are intentionally excluded from version control.

## 📡 API Endpoints

- `GET /health` — returns API health and version.
- `POST /api/v1/contracts/generate` — accepts a JSON contract payload and responds with an `application/pdf` file.
- `GET /docs` — interactive Swagger UI.
- `GET /redoc` — ReDoc API reference.

## 🧰 Running the backend directly

Direct local execution requires the native libraries used by WeasyPrint to be installed on your operating system. Docker avoids that system-specific setup and is the recommended option, especially on Windows.

From the repository root, after installing the native dependencies for your OS:

```bash
cd server
python -m venv venv
```

Activate the environment:

```bash
# Windows PowerShell
.\venv\Scripts\Activate.ps1

# macOS/Linux
source venv/bin/activate
```

Then install packages and start the API:

```bash
pip install -r requirements.txt
uvicorn App.main:app --reload --port 8000
```

Note: the import path is `App.main:app` (capital `A`), matching the actual server package directory.
