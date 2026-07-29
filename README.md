# Keyscape — Piano Chord Explorer

Interactive web app for exploring piano chords. The Next.js interface works immediately with local chord formulas and synchronizes with FastAPI when its API is running.

## Run locally

1. API: `cd backend; python -m venv .venv; .venv\\Scripts\\pip install -r requirements.txt; .venv\\Scripts\\uvicorn main:app --reload --port 8000`
2. Web: `cd frontend; npm install; npm run dev`

Open http://localhost:3000. API documentation is at http://localhost:8000/docs.

## Deploy

Deploy the backend and frontend as separate services. This lets the Next.js site use a fast CDN while FastAPI remains available as a standalone API.

### 1. Deploy the FastAPI backend on Render

Create a **Web Service** from this Git repository with these settings:

| Setting | Value |
| --- | --- |
| Root Directory | `backend` |
| Language | Python 3 |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |

After it is live, copy its public URL, for example `https://piano-chords-api.onrender.com`. Verify the API at `https://YOUR_API_URL/docs`.

### 2. Deploy the Next.js frontend on Vercel

Import the same repository into Vercel and set **Root Directory** to `frontend`. Add this environment variable before deploying:

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Your Render API URL, without a trailing `/` |

For example: `NEXT_PUBLIC_API_URL=https://piano-chords-api.onrender.com`

### 3. Allow the deployed frontend in the API

After Vercel supplies your production URL, add this environment variable to the Render service and redeploy it:

| Name | Value |
| --- | --- |
| `ALLOWED_ORIGINS` | Your Vercel URL, e.g. `https://piano-chords.vercel.app` |

This setting permits the browser-based frontend to call the API. Multiple origins can be supplied as a comma-separated list.

### Updating a deployment

Push changes to the connected branch and both services redeploy automatically. Keep Next.js updated with security patches before publishing a new version.
