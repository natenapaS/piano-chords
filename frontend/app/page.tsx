"use client";

import { useEffect, useMemo, useState } from "react";

const roots = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const kinds = [
  { id: "major", label: "Major", symbol: "" }, { id: "minor", label: "Minor", symbol: "m" },
  { id: "seventh", label: "7th", symbol: "7" }, { id: "maj7", label: "Maj7", symbol: "maj7" },
  { id: "min7", label: "Min7", symbol: "m7" }, { id: "sus4", label: "Sus4", symbol: "sus4" },
];
const chromatic = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const intervals: Record<string, number[]> = { major: [0, 4, 7], minor: [0, 3, 7], seventh: [0, 4, 7, 10], maj7: [0, 4, 7, 11], min7: [0, 3, 7, 10], sus4: [0, 5, 7] };
const formulas: Record<string, string> = { major: "1 • 3 • 5", minor: "1 • ♭3 • 5", seventh: "1 • 3 • 5 • ♭7", maj7: "1 • 3 • 5 • 7", min7: "1 • ♭3 • 5 • ♭7", sus4: "1 • 4 • 5" };

type Chord = { name: string; label: string; formula: string; notes: string[]; pianoNotes: { name: string; midi: number }[] };

function fallback(root: string, kind: string): Chord {
  const index = chromatic.indexOf(root);
  const notes = intervals[kind].map((n) => chromatic[(index + n) % 12]);
  const symbol = kinds.find((item) => item.id === kind)?.symbol ?? "";
  return { name: root + symbol, label: kinds.find((item) => item.id === kind)?.label ?? kind, formula: formulas[kind], notes, pianoNotes: notes.map((name, i) => ({ name, midi: 48 + index + intervals[kind][i] })) };
}

function Piano({ notes }: { notes: string[] }) {
  const keys = Array.from({ length: 22 }, (_, i) => ({ midi: 48 + i, note: chromatic[i % 12] }));
  return <div className="piano" aria-label="Piano keyboard">
    {keys.map((key) => {
      const black = [1, 3, 6, 8, 10].includes(key.midi % 12);
      const active = notes.includes(key.note);
      return <div key={key.midi} className={`key ${black ? "black" : "white"} ${active ? "active" : ""}`}>
        {active && <span>{key.note}</span>}
      </div>;
    })}
  </div>;
}

export default function Home() {
  const [root, setRoot] = useState("C");
  const [kind, setKind] = useState("major");
  const [chord, setChord] = useState<Chord>(() => fallback("C", "major"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const local = fallback(root, kind);
    setChord(local);
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
    fetch(`${apiUrl}/api/chords/${encodeURIComponent(root)}/${kind}`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then(setChord).catch(() => undefined).finally(() => setLoading(false));
  }, [root, kind]);

  const subtitle = useMemo(() => `${chord.label} chord • ${chord.formula}`, [chord]);
  return <main>
    <nav><div className="brand"><i>♫</i> Keyscape</div><span>PIANO CHORD EXPLORER</span><button className="about">About chords</button></nav>
    <section className="hero">
      <p className="eyebrow">FIND YOUR SOUND</p>
      <h1>เห็นคอร์ด <em>ได้ในทันที</em></h1>
      <p className="intro">เลือกโน้ตและประเภทคอร์ด แล้วดูตำแหน่งนิ้วบนเปียโน<br />เหมาะสำหรับฝึก เล่น และแต่งเพลง</p>
    </section>
    <section className="explorer">
      <div className="controls">
        <div className="control"><label>ROOT NOTE</label><div className="root-grid">{roots.map((item) => <button className={root === item ? "selected" : ""} onClick={() => setRoot(item)} key={item}>{item}</button>)}</div></div>
        <div className="control"><label>CHORD TYPE</label><div className="kind-list">{kinds.map((item) => <button className={kind === item.id ? "selected" : ""} onClick={() => setKind(item.id)} key={item.id}><b>{item.symbol || "△"}</b>{item.label}</button>)}</div></div>
      </div>
      <article className="chord-card">
        <div className="card-heading"><div><p className="eyebrow">NOW PLAYING {loading && "• SYNCING"}</p><h2>{chord.name}</h2><p>{subtitle}</p></div><div className="badge">{chord.notes.length}<small>NOTES</small></div></div>
        <Piano notes={chord.notes} />
        <div className="notes"><span>NOTES IN THIS CHORD</span><div>{chord.notes.map((note, i) => <b key={note}>{note}<small>{["ROOT", "THIRD", "FIFTH", "SEVENTH"][i]}</small></b>)}</div></div>
      </article>
    </section>
    <section className="tip"><div>✦</div><p><strong>เคล็ดลับ:</strong> เริ่มจากคอร์ด Major และ Minor ก่อน แล้วสังเกตว่าโน้ตตัวที่ 3 เปลี่ยนความรู้สึกของคอร์ดได้อย่างไร</p></section>
  </main>;
}
