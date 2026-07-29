# Keyscape — Piano Chord Explorer

Interactive web app for exploring piano chords. The Next.js interface works immediately with local chord formulas and synchronizes with FastAPI when its API is running.

## Run locally

1. API: `cd backend; python -m venv .venv; .venv\\Scripts\\pip install -r requirements.txt; .venv\\Scripts\\uvicorn main:app --reload --port 8000`
2. Web: `cd frontend; npm install; npm run dev`

Open http://localhost:3000. API documentation is at http://localhost:8000/docs.

## Deploy

Deploy `backend` as a Render Web Service: build command `pip install -r requirements.txt`, start command `uvicorn main:app --host 0.0.0.0 --port $PORT`, and set `ALLOWED_ORIGINS` to the frontend URL. Deploy `frontend` to Vercel, use `frontend` as the Root Directory, and set `NEXT_PUBLIC_API_URL` to the Render API URL.
