import { useState, useEffect, useRef } from "react";

const DAYS = {
  day1: {
    label: "MON",
    full: "Lower Body",
    color: "#ff3b3b",
    exercises: [
      { id: "spanish_squat", name: "Spanish Squat", sets: 3, reps: "15", weight: "BW+Band", unit: "", rest: 60, tip: "Band behind knees, facing post. Shins vertical, sit back. Feel quads burning — NOT joint pain.", noWeight: true },
      { id: "bulgarian", name: "Bulgarian Split Squat", sets: 4, reps: "8 each", weight: "12", unit: "kg", rest: 120, tip: "Rear foot on bench. RIGHT leg FIRST every set. Knee tracks over toes. If right gets 6 clean reps and left can do 9, stop both at 6." },
      { id: "rdl", name: "Romanian Deadlift", sets: 3, reps: "10", weight: "50", unit: "kg", rest: 90, tip: "Hip-width stance, soft knee bend. Hinge hips back, lower to mid-shin. Back stays flat the whole time. Feel the hamstring stretch." },
      { id: "leg_press", name: "Single-Leg Leg Press", sets: 3, reps: "12 each", weight: "40", unit: "kg", rest: 90, tip: "Right leg first. Only go as deep as pain-free allows — even 60° is fine. Range will increase as tendon heals." },
      { id: "nordic", name: "Reverse Nordic Curl", sets: 3, reps: "6–8 each", weight: "BW", unit: "", rest: 60, tip: "Kneel, ankles anchored under bench. Hips stay straight. Lower forward SLOWLY — 5 sec descent. Start very shallow (20–30°). Right leg will feel brutally harder. That is expected.", noWeight: true },
      { id: "copenhagen", name: "Copenhagen Plank", sets: 3, reps: "20s each", weight: "BW", unit: "", rest: 45, tip: "Side plank, top leg on bench at knee height. Body straight. Hold completely still.", noWeight: true },
      { id: "hip_thrust", name: "Hip Thrust", sets: 3, reps: "10", weight: "40", unit: "kg", rest: 75, tip: "Upper back on bench, barbell across hips on pad. Drive hips up, 2 sec squeeze at top. Do NOT hyperextend lower back." },
    ]
  },
  day2: {
    label: "WED",
    full: "Upper Body + Core",
    color: "#3b8fff",
    exercises: [
      { id: "pullups", name: "Pull-Ups", sets: 4, reps: "6", weight: "+10", unit: "kg", rest: 120, tip: "Overhand grip, shoulder-width. Drive elbows toward hips. 2 sec up, 1 sec squeeze at top, 3 sec lowering. If all 6 easy in week 1, add 2.5 kg in week 3." },
      { id: "db_row", name: "Dumbbell Row", sets: 3, reps: "10 each", weight: "28", unit: "kg", rest: 90, tip: "Core braced the whole time. Pull elbow back past hip, 1 sec squeeze, 3 sec lower. Do NOT rotate torso to swing it up." },
      { id: "landmine", name: "Landmine Press", sets: 3, reps: "10 each", weight: "20", unit: "kg", rest: 75, tip: "Hold bar at shoulder height, press upward at an angle. Ribcage stays down — do not arch lower back." },
      { id: "face_pulls", name: "Face Pulls", sets: 3, reps: "15", weight: "15", unit: "kg", rest: 60, tip: "Rope at eye height, pull to face with elbows flaring high and wide. This is injury prevention — never go heavy." },
      { id: "dead_bug", name: "Dead Bug", sets: 3, reps: "10 each", weight: "BW", unit: "", rest: 60, tip: "On back, arms up, knees 90 degrees. Lower opposite arm and leg slowly. Lower back STAYS on floor the whole time. Reduce range if back lifts.", noWeight: true },
      { id: "woodchop", name: "Cable Woodchop", sets: 3, reps: "12 each", weight: "15", unit: "kg", rest: 75, tip: "Cable at highest setting. Pull diagonally high to low, pivot back foot. Power comes from hips rotating — not arms pulling." },
      { id: "farmers", name: "Farmer's Carry", sets: 3, reps: "40m", weight: "24", unit: "kg", rest: 90, tip: "Shoulders back, core braced, walk tall. Do not lean or let weights pull you sideways. If you drop before 40m, weight is too heavy.", noWeight: true },
    ]
  },
  day3: {
    label: "FRI",
    full: "Power + Explosiveness",
    color: "#2ecc71",
    exercises: [
      { id: "box_jump", name: "Box Jump", sets: 4, reps: "4", weight: "40cm", unit: "", rest: 120, tip: "Swing arms, explode up, land SOFT with knees bent. Always step down — never jump down. Increase height only after 3 sessions with zero knee reaction. If knee sore: do Broad Jump instead.", noWeight: true },
      { id: "trap_bar", name: "Trap Bar Deadlift ★", sets: 4, reps: "5", weight: "85", unit: "kg", rest: 180, tip: "WARM UP: 40kgx5, 60kgx3, 75kgx2 FIRST. Big breath, brace belly before every rep. Dead stop at bottom — no bouncing. Explosive up, 2 sec lowering. Add 2.5 kg every 3 weeks." },
      { id: "kb_swing", name: "Kettlebell Swing", sets: 4, reps: "10", weight: "24", unit: "kg", rest: 90, tip: "Power from hip snap — NOT arms pulling. It is a pendulum. Hinge back as it falls, snap hips forward as it rises to eye level." },
      { id: "single_hop", name: "Single-Leg Hop to Stick", sets: 3, reps: "5 each", weight: "BW", unit: "", rest: 90, tip: "Stand on one leg, hop forward ~50cm, land and FREEZE for 3 full seconds. Right leg first. Knee must track over toes on landing — no caving inward.", noWeight: true },
      { id: "med_slam", name: "Medicine Ball Slam", sets: 3, reps: "8", weight: "8", unit: "kg", rest: 60, tip: "Rise up onto tiptoes fully, slam as hard as you can. Breathe out on every slam. Full effort every rep." },
      { id: "sled", name: "Sled Push", sets: 4, reps: "20m", weight: "40", unit: "kg", rest: 120, tip: "Low body position. Drive with legs like finishing a takedown. Short powerful steps. No sled? 30 sec Assault Bike sprint, full effort.", noWeight: true },
      { id: "pallof", name: "Pallof Press", sets: 3, reps: "10 each", weight: "12", unit: "kg", rest: 60, tip: "Cable at belly height, stand sideways. Press straight out, hold 2 sec. Resist rotation completely — hips must not move at all." },
      { id: "calf_raise", name: "Seated Calf Raise", sets: 3, reps: "15", weight: "20", unit: "kg", rest: 60, tip: "2 sec up, 2 sec hold, 3 sec DOWN slowly. The slow lowering is the whole point — eccentric loading is what heals the tendon." },
    ]
  }
};

function fmt(s) {
  const m = Math.floor(s / 60), sec = s % 60;
  return m > 0 ? `${m}:${sec.toString().padStart(2, "0")}` : `${sec}s`;
}

export default function App() {
  const [tab, setTab] = useState("workout");
  const [dayKey, setDayKey] = useState("day1");
  const [weights, setWeights] = useState({});
  const [setsCompleted, setSetsCompleted] = useState({});
  const [expandedTip, setExpandedTip] = useState(null);
  const [restTimer, setRestTimer] = useState(null);
  const [sessions, setSessions] = useState({});
  const [histDay, setHistDay] = useState("day1");
  const [saved, setSaved] = useState(false);
  const [note, setNote] = useState("");
  const timerRef = useRef(null);

  const day = DAYS[dayKey];

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("wt_v3");
        if (r) setSessions(JSON.parse(r.value));
      } catch {}
    })();
  }, []);

  useEffect(() => {
    setSetsCompleted({});
    setExpandedTip(null);
    clearInterval(timerRef.current);
    setRestTimer(null);
    setSaved(false);
    setNote("");
  }, [dayKey]);

  useEffect(() => {
    if (!restTimer || restTimer.seconds <= 0) {
      clearInterval(timerRef.current);
      if (restTimer?.seconds <= 0) setRestTimer(null);
      return;
    }
    timerRef.current = setInterval(() => {
      setRestTimer(p => {
        if (!p || p.seconds <= 1) { clearInterval(timerRef.current); return null; }
        return { ...p, seconds: p.seconds - 1 };
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [restTimer !== null]);

  const getW = (ex) => weights[`${dayKey}_${ex.id}`] ?? ex.weight;
  const setW = (ex, v) => { setWeights(p => ({ ...p, [`${dayKey}_${ex.id}`]: v })); setSaved(false); };
  const nudge = (ex, d) => {
    const n = parseFloat(getW(ex));
    if (!isNaN(n)) setW(ex, String(+(Math.max(0, n + d)).toFixed(1)));
  };

  const getDone = (id) => setsCompleted[`${dayKey}_${id}`] ?? 0;
  const tapSet = (ex, idx) => {
    const key = `${dayKey}_${ex.id}`;
    const cur = getDone(ex.id);
    const nv = idx + 1 === cur ? idx : idx + 1;
    setSetsCompleted(p => ({ ...p, [key]: nv }));
    setSaved(false);
    if (nv > cur && nv < ex.sets) {
      clearInterval(timerRef.current);
      setRestTimer({ seconds: ex.rest, total: ex.rest });
    } else if (nv >= ex.sets) {
      setRestTimer(null);
    }
  };

  const saveSession = async () => {
    const date = new Date().toISOString().split("T")[0];
    const key = `${dayKey}_${Date.now()}`;
    const entry = { date, day: dayKey, weights: { ...weights }, note };
    const next = { ...sessions, [key]: entry };
    setSessions(next);
    try { await window.storage.set("wt_v3", JSON.stringify(next)); } catch {}
    setSaved(true);
  };

  const deleteSess = async (key) => {
    const next = { ...sessions };
    delete next[key];
    setSessions(next);
    try { await window.storage.set("wt_v3", JSON.stringify(next)); } catch {}
  };

  const accent = day.color;
  const totalSets = day.exercises.reduce((a, e) => a + e.sets, 0);
  const doneSets = day.exercises.reduce((a, e) => a + Math.min(getDone(e.id), e.sets), 0);
  const pct = totalSets > 0 ? doneSets / totalSets : 0;
  const histEntries = Object.entries(sessions).filter(([, s]) => s.day === histDay).sort((a, b) => b[1].date.localeCompare(a[1].date));

  return (
    <div style={{ background: "#07070f", minHeight: "100vh", maxWidth: 480, margin: "0 auto", fontFamily: "'Courier New', monospace", color: "#fff", paddingBottom: 80 }}>

      {/* STICKY HEADER */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "#07070f" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px 10px" }}>
          <div style={{ fontSize: 16, fontWeight: "bold", letterSpacing: 2 }}>
            <span style={{ color: accent }}>BJJ</span> <span style={{ color: "#222" }}>|</span> LOG
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["workout", "history"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? accent : "transparent", color: tab === t ? "#000" : "#333", border: `1px solid ${tab === t ? accent : "#1e1e2e"}`, padding: "6px 14px", borderRadius: 4, cursor: "pointer", fontSize: 9, letterSpacing: 3, fontFamily: "inherit", fontWeight: "bold" }}>
                {t === "workout" ? "LOG" : "HISTORY"}
              </button>
            ))}
          </div>
        </div>

        {tab === "workout" && (
          <>
            <div style={{ display: "flex", borderTop: "1px solid #111" }}>
              {Object.entries(DAYS).map(([k, d]) => (
                <button key={k} onClick={() => setDayKey(k)} style={{ flex: 1, padding: "11px 4px", background: dayKey === k ? "#0f0f1a" : "transparent", border: "none", borderBottom: `3px solid ${dayKey === k ? d.color : "transparent"}`, color: dayKey === k ? d.color : "#2a2a3a", fontSize: 11, letterSpacing: 2, cursor: "pointer", fontFamily: "inherit", fontWeight: "bold" }}>
                  {d.label}
                </button>
              ))}
            </div>
            <div style={{ padding: "10px 16px 0", display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontSize: 12, color: accent, fontWeight: "bold", letterSpacing: 1 }}>{day.full.toUpperCase()}</div>
              <div style={{ fontSize: 11, color: "#2a2a3a" }}>{doneSets} / {totalSets} sets</div>
            </div>
            <div style={{ height: 3, margin: "8px 0 0", background: "#0f0f1a" }}>
              <div style={{ height: "100%", width: `${pct * 100}%`, background: accent, transition: "width 0.4s" }} />
            </div>
          </>
        )}
      </div>

      {/* REST TIMER */}
      {restTimer && (
        <div onClick={() => { clearInterval(timerRef.current); setRestTimer(null); }} style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, zIndex: 200, background: "#07070fee", backdropFilter: "blur(12px)", padding: "18px 20px 16px", cursor: "pointer", borderBottom: `2px solid ${accent}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: 9, color: "#333", letterSpacing: 4, marginBottom: 2 }}>REST</div>
              <div style={{ fontSize: 58, fontWeight: "bold", color: accent, lineHeight: 1, letterSpacing: -3, fontVariantNumeric: "tabular-nums" }}>{fmt(restTimer.seconds)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 9, color: "#222", letterSpacing: 2, marginBottom: 6 }}>TAP TO SKIP</div>
              <div style={{ width: 100, height: 3, background: "#111", borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${(restTimer.seconds / restTimer.total) * 100}%`, background: accent, borderRadius: 2, transition: "width 1s linear" }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WORKOUT TAB */}
      {tab === "workout" && (
        <div style={{ padding: "14px 12px 0" }}>
          {day.exercises.map((ex, i) => {
            const done = getDone(ex.id);
            const complete = done >= ex.sets;
            const tipOpen = expandedTip === ex.id;

            return (
              <div key={ex.id} style={{ marginBottom: 8, borderRadius: 10, border: `1px solid ${complete ? accent + "40" : "#111120"}`, background: complete ? "#090f09" : "#0c0c1a", overflow: "hidden", transition: "all 0.2s" }}>

                {/* Top: name + tip button */}
                <div style={{ padding: "13px 14px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 9, letterSpacing: 3, color: complete ? "#2ecc71" : "#252535", marginBottom: 4 }}>
                      {complete ? "✓  COMPLETE" : `${i + 1} of ${day.exercises.length}`}
                    </div>
                    <div style={{ fontSize: 19, fontWeight: "bold", color: complete ? "#3a6e3a" : "#e8e8f0", lineHeight: 1.15 }}>{ex.name}</div>
                    <div style={{ fontSize: 10, color: "#252535", marginTop: 5, letterSpacing: 1 }}>
                      {ex.sets} sets × {ex.reps}&nbsp;&nbsp;·&nbsp;&nbsp;rest {fmt(ex.rest)}
                    </div>
                  </div>
                  <button onClick={() => setExpandedTip(tipOpen ? null : ex.id)} style={{ width: 34, height: 34, borderRadius: 6, border: `1px solid ${tipOpen ? accent : "#1a1a28"}`, background: tipOpen ? accent + "18" : "transparent", color: tipOpen ? accent : "#2a2a3a", cursor: "pointer", fontSize: 14, flexShrink: 0, marginLeft: 10, fontFamily: "inherit" }}>?</button>
                </div>

                {/* Tip box */}
                {tipOpen && (
                  <div style={{ margin: "10px 14px 6px", padding: "10px 12px", background: "#07070f", borderRadius: 6, borderLeft: `3px solid ${accent}` }}>
                    <div style={{ fontSize: 12, color: "#777", lineHeight: 1.65 }}>{ex.tip}</div>
                  </div>
                )}

                {/* Weight + set dots */}
                <div style={{ padding: "12px 14px 14px", display: "flex", alignItems: "center", gap: 10 }}>

                  {/* Weight */}
                  {!ex.noWeight ? (
                    <div style={{ display: "flex", alignItems: "center", background: "#07070f", borderRadius: 8, border: `1px solid #1a1a28`, overflow: "hidden", flexShrink: 0 }}>
                      <button onClick={() => nudge(ex, -2.5)} style={{ width: 40, height: 54, background: "transparent", border: "none", color: "#2a2a3a", fontSize: 22, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                      <div style={{ textAlign: "center", padding: "0 2px" }}>
                        <input value={getW(ex)} onChange={e => setW(ex, e.target.value)} style={{ background: "transparent", border: "none", color: accent, fontSize: 26, fontWeight: "bold", width: 68, textAlign: "center", fontFamily: "inherit", outline: "none", display: "block" }} />
                        <div style={{ fontSize: 8, color: "#252535", letterSpacing: 2, marginTop: -2 }}>{ex.unit || "kg"}</div>
                      </div>
                      <button onClick={() => nudge(ex, 2.5)} style={{ width: 40, height: 54, background: "transparent", border: "none", color: "#2a2a3a", fontSize: 22, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                    </div>
                  ) : (
                    <div style={{ background: "#07070f", borderRadius: 8, border: "1px solid #1a1a28", padding: "8px 14px", flexShrink: 0, textAlign: "center" }}>
                      <div style={{ fontSize: 16, fontWeight: "bold", color: "#252535" }}>{getW(ex)}</div>
                      <div style={{ fontSize: 8, color: "#1a1a28", letterSpacing: 2 }}>BW</div>
                    </div>
                  )}

                  {/* Set dots — big tap targets */}
                  <div style={{ flex: 1, display: "flex", gap: 7, justifyContent: "flex-end", flexWrap: "wrap" }}>
                    {Array.from({ length: ex.sets }).map((_, si) => {
                      const isDone = si < done;
                      return (
                        <button key={si} onClick={() => tapSet(ex, si)} style={{ width: 46, height: 46, borderRadius: 8, border: `2px solid ${isDone ? accent : "#1a1a28"}`, background: isDone ? accent : "transparent", color: isDone ? "#000" : "#252535", fontSize: 14, fontWeight: "bold", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", flexShrink: 0 }}>
                          {si + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Notes */}
          <div style={{ marginTop: 6 }}>
            <textarea value={note} onChange={e => { setNote(e.target.value); setSaved(false); }} placeholder="Pain? PRs? Notes for next time..." style={{ width: "100%", background: "#0c0c1a", border: "1px solid #111120", color: "#777", padding: "11px 12px", borderRadius: 8, fontFamily: "inherit", fontSize: 12, resize: "none", height: 60, boxSizing: "border-box", outline: "none" }} />
          </div>

          {/* Save */}
          <button onClick={saveSession} style={{ width: "100%", marginTop: 6, padding: "16px", background: saved ? "#0a140a" : accent, border: `2px solid ${saved ? "#2ecc71" : accent}`, color: saved ? "#2ecc71" : "#000", fontSize: 12, letterSpacing: 4, fontWeight: "bold", borderRadius: 8, cursor: "pointer", fontFamily: "inherit" }}>
            {saved ? "✓  SAVED" : "SAVE SESSION"}
          </button>

          {/* Post session reminder */}
          <div style={{ marginTop: 10, padding: "12px 14px", background: "#0c0c1a", borderRadius: 8, borderLeft: "3px solid #f39c12" }}>
            <div style={{ fontSize: 9, color: "#f39c12", letterSpacing: 3, marginBottom: 5 }}>AFTER EVERY SESSION</div>
            <div style={{ fontSize: 11, color: "#333", lineHeight: 1.8 }}>Hip flexors · 60s each side{"\n"}Quads · 60s each side{"\n"}Ice right knee 10 min if warm</div>
          </div>
          <div style={{ height: 24 }} />
        </div>
      )}

      {/* HISTORY TAB */}
      {tab === "history" && (
        <div>
          <div style={{ display: "flex", borderTop: "1px solid #111" }}>
            {Object.entries(DAYS).map(([k, d]) => (
              <button key={k} onClick={() => setHistDay(k)} style={{ flex: 1, padding: "12px 4px", background: histDay === k ? "#0f0f1a" : "transparent", border: "none", borderBottom: `3px solid ${histDay === k ? d.color : "transparent"}`, color: histDay === k ? d.color : "#2a2a3a", fontSize: 10, letterSpacing: 2, cursor: "pointer", fontFamily: "inherit", fontWeight: "bold" }}>
                {d.label}
              </button>
            ))}
          </div>

          <div style={{ padding: "12px" }}>
            <div style={{ fontSize: 9, color: "#1e1e2e", letterSpacing: 3, marginBottom: 10 }}>{histEntries.length} SESSION{histEntries.length !== 1 ? "S" : ""}</div>
            {histEntries.length === 0 && <div style={{ textAlign: "center", color: "#181828", fontSize: 12, padding: "60px 0", letterSpacing: 3 }}>NOTHING YET</div>}
            {histEntries.map(([key, session]) => {
              const d = DAYS[session.day];
              return (
                <div key={key} style={{ marginBottom: 10, background: "#0c0c1a", borderRadius: 8, border: "1px solid #111120", overflow: "hidden" }}>
                  <div style={{ padding: "10px 14px", background: "#090914", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #111120" }}>
                    <div style={{ fontSize: 13, color: d.color, fontWeight: "bold" }}>{new Date(session.date + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                    <button onClick={() => deleteSess(key)} style={{ background: "transparent", border: "1px solid #1a1a28", color: "#252535", padding: "4px 12px", borderRadius: 3, cursor: "pointer", fontSize: 9, fontFamily: "inherit", letterSpacing: 2 }}>DEL</button>
                  </div>
                  <div style={{ padding: "8px 14px 12px" }}>
                    {d.exercises.map(ex => {
                      const w = session.weights?.[`${session.day}_${ex.id}`] ?? ex.weight;
                      return (
                        <div key={ex.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #09091a" }}>
                          <div style={{ fontSize: 11, color: "#333" }}>{ex.name}</div>
                          <div style={{ fontSize: 16, color: d.color, fontWeight: "bold" }}>{w}<span style={{ fontSize: 9, color: "#252535", marginLeft: 3 }}>{ex.unit}</span></div>
                        </div>
                      );
                    })}
                    {session.note && <div style={{ marginTop: 8, padding: "8px 10px", background: "#07070f", borderRadius: 4, borderLeft: `2px solid ${d.color}`, fontSize: 11, color: "#444", fontStyle: "italic" }}>{session.note}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
