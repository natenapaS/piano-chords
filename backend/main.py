import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Piano Chords API")
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CHROMATIC = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
KINDS = {
    "major": {"label": "Major", "symbol": "", "intervals": [0, 4, 7], "formula": "1 • 3 • 5"},
    "minor": {"label": "Minor", "symbol": "m", "intervals": [0, 3, 7], "formula": "1 • ♭3 • 5"},
    "seventh": {"label": "Dominant 7", "symbol": "7", "intervals": [0, 4, 7, 10], "formula": "1 • 3 • 5 • ♭7"},
    "maj7": {"label": "Major 7", "symbol": "maj7", "intervals": [0, 4, 7, 11], "formula": "1 • 3 • 5 • 7"},
    "min7": {"label": "Minor 7", "symbol": "m7", "intervals": [0, 3, 7, 10], "formula": "1 • ♭3 • 5 • ♭7"},
    "sus4": {"label": "Sus4", "symbol": "sus4", "intervals": [0, 5, 7], "formula": "1 • 4 • 5"},
    "dim": {"label": "Diminished", "symbol": "dim", "intervals": [0, 3, 6], "formula": "1 • ♭3 • ♭5"},
}

def make_chord(root: str, kind: str):
    if root not in CHROMATIC or kind not in KINDS:
        raise HTTPException(status_code=404, detail="Unknown chord")
    start = CHROMATIC.index(root)
    info = KINDS[kind]
    notes = [CHROMATIC[(start + interval) % 12] for interval in info["intervals"]]
    # Middle-register notes for the piano illustration, avoiding a cramped voicing.
    piano_notes = [{"name": note, "midi": 48 + start + interval} for note, interval in zip(notes, info["intervals"])]
    return {
        "name": f"{root}{info['symbol']}",
        "root": root,
        "kind": kind,
        "label": info["label"],
        "formula": info["formula"],
        "notes": notes,
        "pianoNotes": piano_notes,
    }

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.get("/api/chords")
def chords():
    return [make_chord(root, kind) for root in CHROMATIC for kind in KINDS]

@app.get("/api/chords/{root}/{kind}")
def chord(root: str, kind: str):
    return make_chord(root, kind)
