import { useState, useEffect } from "react";

// ── STORAGE KEY ────────────────────────────────────────
const STORAGE_KEY = "built40_data_v1";

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { workoutLog: {}, recoveryLog: {} };
  } catch { return { workoutLog: {}, recoveryLog: {} }; }
}
function saveToStorage(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

// ── PHASE DATA ─────────────────────────────────────────
const PHASES = [
  {
    weeks: [1, 2], name: "Foundation", color: "#4a8fa6",
    sets: 3, reps: "12–15", rpe: "RPE 6–7", rest: "60–90 sec",
    focus: "Build your base. Learn the movements. Own your form.",
    fullDesc: "The most important phase of the program — and the most underestimated. This is where you build the movement patterns your body will rely on for the next 6 weeks. Higher reps at lower intensity means your nervous system is learning, your joints are adapting, and your connective tissue is getting stronger.",
    expect: [
      "You will feel like you could do more. That's intentional.",
      "Mild soreness after sessions 1 and 2, then your body adapts fast.",
      "Don't chase load here — chase technique. Perfect reps now = heavier weights later.",
    ],
    mindset: "Master the movement. The weight will come.",
  },
  {
    weeks: [3, 4], name: "Build", color: "#C9A84C",
    sets: 4, reps: "10–12", rpe: "RPE 7–8", rest: "90 sec",
    focus: "Progressive overload begins. You're getting stronger.",
    fullDesc: "Now we add a set and bring the reps down. Your body has learned the movements — now we give it a reason to grow. This is where progressive overload kicks in for real. You should be adding weight when you hit the top of your rep range. Expect to feel noticeably stronger than Week 1.",
    expect: [
      "More pronounced soreness as volume increases — that's normal.",
      "Better mind-muscle connection. You'll feel muscles you didn't feel in Phase I.",
      "Your first PRs. Log everything — these numbers matter.",
    ],
    mindset: "Add weight. Track everything. Trust the numbers.",
  },
  {
    weeks: [5, 6], name: "Drive", color: "#3d7a8a",
    sets: 4, reps: "8–10", rpe: "RPE 8–9", rest: "2 min",
    focus: "Push harder. Your body is ready for this.",
    fullDesc: "The hardest block in the program. Volume is at its peak, intensity is high. RPE 8–9 means you finish each set with 1–2 reps left — no more. This phase will test your mental game as much as your physical one. This is where the real transformation happens.",
    expect: [
      "This phase tests your mental game as much as your body.",
      "Fatigue will accumulate — sleep and recovery matter more than ever.",
      "You will surprise yourself. Push through the doubt.",
    ],
    mindset: "Embrace the discomfort. This is where you change.",
  },
  {
    weeks: [7, 8], name: "Peak", color: "#E2C472",
    sets: "5→3", reps: "6–8 → 10–12", rpe: "RPE 9 → 6", rest: "2 min → 90s",
    focus: "Week 7 max effort. Week 8 deload. Finish what you started.",
    fullDesc: "Two very different weeks. Week 7 is your heaviest session of the entire program — 5 sets at near-max effort. Go for PRs. Leave everything in the gym. Then Week 8 flips to a deload. Volume drops, intensity drops, your body absorbs 7 weeks of hard work. Don't skip the deload.",
    expect: [
      "Week 7: go for PRs on every lift. This is your victory lap.",
      "Week 8: lighter weights, more energy, body quietly getting stronger.",
      "Don't skip the deload — it's the most common mistake.",
    ],
    mindset: "Week 7: leave everything in the gym. Week 8: let it land.",
  },
];

const WEEK_PHASE = { 1:0,2:0,3:1,4:1,5:2,6:2,7:3,8:3 };
const WEEK_SETS  = { 1:3,2:3,3:4,4:4,5:4,6:4,7:5,8:3 };
const WEEK_REPS  = { 1:"12–15",2:"12–15",3:"10–12",4:"10–12",5:"8–10",6:"8–10",7:"6–8",8:"10–12" };
const WEEK_REST  = { 1:"60–90s",2:"60–90s",3:"90s",4:"90s",5:"2 min",6:"2 min",7:"2 min",8:"90s" };
const WEEK_RPE   = { 1:"RPE 6–7",2:"RPE 6–7",3:"RPE 7–8",4:"RPE 7–8",5:"RPE 8–9",6:"RPE 8–9",7:"RPE 9",8:"RPE 6" };

const WORKOUTS = {
  A: {
    label: "Day A — Lower Body",
    exercises: [
      { id: "goblet",  name: "Goblet Squat",     cue: "Hold the weight at your chest, sit tall, drive those knees out — you've got this" },
      { id: "rdl",     name: "Romanian Deadlift", cue: "Hinge at your hips, feel the stretch in your hamstrings, control the return" },
      { id: "lunge",   name: "Reverse Lunge",     cue: "Step back with control, back knee hovers, front shin stays vertical" },
      { id: "glute",   name: "Glute Bridge",      cue: "Drive through your heels, squeeze at the top — feel those glutes working" },
      { id: "deadbug", name: "Dead Bug",          cue: "Lower back stays pressed to the floor. Slow and controlled wins every time" },
    ],
  },
  B: {
    label: "Day B — Upper Push",
    exercises: [
      { id: "bench",   name: "DB Bench Press",    cue: "Feet flat, slight arch, lower with control — you're stronger than you think" },
      { id: "ohp",     name: "DB Shoulder Press", cue: "Core braced, press overhead, bring it back with intention — not gravity" },
      { id: "incline", name: "Incline DB Press",  cue: "45 degree bench, elbows at 45 degrees — protect those shoulders" },
      { id: "lateral", name: "Lateral Raise",     cue: "Lead with your elbows, slight lean forward — light weight, perfect form" },
      { id: "tricep",  name: "Tricep Pushdown",   cue: "Elbows stay pinned, full extension — feel the back of those arms working" },
    ],
  },
  C: {
    label: "Day C — Upper Pull",
    exercises: [
      { id: "deadlift",name: "Dumbbell Deadlift", cue: "Neutral spine, push the floor away — powerful and controlled" },
      { id: "row",     name: "Seated Cable Row",  cue: "Sit tall, pull to your lower chest, squeeze your shoulder blades together" },
      { id: "pulldown",name: "Lat Pulldown",      cue: "Lean back slightly, pull to upper chest — feel your lats, not your arms" },
      { id: "facepull",name: "Face Pull",         cue: "Pull to your ears, rotate out at the end — your shoulders will thank you later" },
      { id: "curl",    name: "DB Hammer Curl",    cue: "Neutral grip, no swinging — slow up, slow down, every rep counts" },
    ],
  },
};

const RECOVERY_ACTIVITIES = [
  { id: "walk",  name: "Walking",        icon: "🚶", cal: "120–200", tip: "Conversational pace — if you can't talk, slow down" },
  { id: "cycle", name: "Cycling",        icon: "🚴", cal: "150–250", tip: "Keep resistance easy — this is recovery, not cardio" },
  { id: "swim",  name: "Swimming",       icon: "🏊", cal: "180–300", tip: "Relaxed pace — let the water do the work" },
  { id: "hike",  name: "Hiking",         icon: "🥾", cal: "200–350", tip: "Varied terrain engages stabilizers — bonus strength work" },
  { id: "yoga",  name: "Yoga / Mobility",icon: "🧘", cal: "80–150",  tip: "Focus on hips, hamstrings and shoulders after BUILT 40 sessions" },
  { id: "row",   name: "Light Rowing",   icon: "🚣", cal: "150–220", tip: "18–22 strokes per minute — smooth and controlled" },
];

const ENERGY_LEVELS = [
  { val: 1, label: "Exhausted",  color: "#8B1A1A" },
  { val: 2, label: "Tired",      color: "#C44B3A" },
  { val: 3, label: "OK",         color: "#C9A84C" },
  { val: 4, label: "Good",       color: "#4a8fa6" },
  { val: 5, label: "Great",      color: "#7a9e6e" },
];

const SCHEDULE = [
  { day: "Mon", workout: "A" },
  { day: "Tue", active: true },
  { day: "Wed", workout: "B" },
  { day: "Thu", active: true },
  { day: "Fri", workout: "C" },
  { day: "Sat", active: true },
  { day: "Sun", rest: true },
];

// ── COLORS ─────────────────────────────────────────────
const CLR = {
  bg: "#0d1117", dark1: "#111820", dark2: "#141d27", dark3: "#1a2535",
  gold: "#C9A84C", goldLt: "#E2C472", goldDim: "#8a6f2e",
  cream: "#F2ECD8", tan: "#d4c49a", muted: "#7a8fa6",
  dim: "#3a5068", dim2: "#253545", teal: "#4a8fa6",
};

function getPhase(week) { return PHASES[WEEK_PHASE[week]]; }
function recKey(week, day) { return `rec_w${week}_${day}`; }
function wkKey(week, day) { return `wk_w${week}_${day}`; }

// ── TIMER HOOK ─────────────────────────────────────────
function useTimer() {
  const [val, setVal] = useState(0);
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (!active || val <= 0) return;
    const iv = setInterval(() => setVal(v => v - 1), 1000);
    return () => clearInterval(iv);
  }, [active, val]);
  useEffect(() => { if (val === 0) setActive(false); }, [val]);
  return {
    val, active,
    start: (s) => { setVal(s); setActive(true); },
    skip:  () => { setVal(0); setActive(false); },
  };
}

// ── SHARED COMPONENTS ──────────────────────────────────
function PhaseCard({ week }) {
  const p = getPhase(week);
  const roman = ["I","II","III","IV"][WEEK_PHASE[week]];
  return (
    <div style={{ margin: "8px 16px", borderRadius: 4, overflow: "hidden", border: `1px solid ${CLR.dim2}` }}>
      <div style={{ padding: "12px 14px", background: p.color }}>
        <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, color: "#0d1117", marginBottom: 3 }}>Phase {roman} — {p.name}</div>
        <div style={{ fontSize: 12, fontStyle: "italic", color: "#111", opacity: 0.8, lineHeight: 1.5 }}>{p.focus}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, padding: "8px 14px", background: CLR.dark1, borderTop: `1px solid ${CLR.dim2}` }}>
        {[["Sets", WEEK_SETS[week]], ["Reps", WEEK_REPS[week]], ["Rest", WEEK_REST[week]], ["RPE", WEEK_RPE[week]]].map(([l, v]) => (
          <div key={l} style={{ background: CLR.dark3, padding: "7px 8px", borderRadius: 3, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: CLR.dim, letterSpacing: "0.08em", textTransform: "uppercase" }}>{l}</div>
            <div style={{ fontSize: 13, color: CLR.goldLt, fontWeight: 700, marginTop: 2 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RestTimer({ val, active, skip }) {
  if (!active || val <= 0) return null;
  const pct = Math.round((val / 90) * 100);
  return (
    <div style={{ background: CLR.dark2, border: `1px solid ${CLR.gold}`, borderRadius: 40, padding: "9px 18px", display: "flex", alignItems: "center", gap: 12, margin: "0 16px 10px" }}>
      <div>
        <div style={{ fontSize: 10, letterSpacing: "0.12em", color: CLR.dim, textTransform: "uppercase" }}>Rest</div>
        <div style={{ fontSize: 22, fontFamily: "monospace", color: CLR.gold, fontWeight: 700, lineHeight: 1 }}>{val}s</div>
      </div>
      <div style={{ flex: 1, height: 3, background: CLR.dark3, borderRadius: 2 }}>
        <div style={{ height: "100%", background: CLR.gold, width: `${pct}%`, transition: "width 1s linear", borderRadius: 2 }} />
      </div>
      <button onClick={skip} style={{ padding: "5px 10px", background: "transparent", border: `1px solid ${CLR.dim2}`, borderRadius: 20, color: CLR.tan, fontSize: 11, cursor: "pointer", fontFamily: "Georgia, serif" }}>Skip</button>
    </div>
  );
}

function SavedBadge() {
  return (
    <span style={{ fontSize: 10, color: "#7a9e6e", letterSpacing: "0.08em", marginLeft: 8, verticalAlign: "middle" }}>✓ Saved</span>
  );
}

// ── TODAY TAB ──────────────────────────────────────────
function TodayTab({ week, setWeek, setTab, appData }) {
  const phase = getPhase(week);
  return (
    <div>
      <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: CLR.dim, padding: "14px 16px 6px" }}>Current Week</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, padding: "0 16px 4px" }}>
        {Array.from({ length: 8 }, (_, i) => i + 1).map(w => {
          const p = getPhase(w); const sel = w === week;
          return (
            <div key={w} onClick={() => setWeek(w)} style={{ padding: "8px 3px", textAlign: "center", borderRadius: 3, cursor: "pointer", background: sel ? CLR.dark3 : CLR.dark1, border: `1px solid ${sel ? p.color : CLR.dim2}` }}>
              <div style={{ fontSize: 12, color: sel ? p.color : CLR.dim }}>W{w}</div>
              <div style={{ fontSize: 10, color: CLR.dim2, marginTop: 1 }}>{p.name.slice(0,3)}</div>
            </div>
          );
        })}
      </div>
      <PhaseCard week={week} />
      <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: CLR.dim, padding: "14px 16px 6px" }}>This Week</div>
      {SCHEDULE.map((d, i) => {
        const hasWkLog = d.workout && appData.workoutLog[wkKey(week, d.workout)];
        const hasRecLog = d.active && appData.recoveryLog[recKey(week, d.day)];
        return (
          <div key={i} onClick={() => { if (d.workout) setTab("train"); else if (d.active) setTab("recover"); }}
            style={{ margin: "0 16px 7px", padding: "11px 13px", background: CLR.dark1, border: `1px solid ${d.workout || d.active ? CLR.dim : CLR.dim2}`, borderRadius: 4, display: "flex", alignItems: "center", gap: 12, cursor: d.workout || d.active ? "pointer" : "default" }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, background: d.workout ? CLR.dark3 : CLR.bg, border: `1px solid ${d.workout ? phase.color : d.active ? CLR.teal : CLR.dim2}`, color: d.workout ? phase.color : d.active ? CLR.teal : CLR.dim }}>
              {d.day}
            </div>
            <div style={{ flex: 1 }}>
              {d.workout ? (
                <>
                  <div style={{ fontSize: 13, color: CLR.cream, display: "flex", alignItems: "center" }}>
                    {WORKOUTS[d.workout].label}
                    {hasWkLog && <SavedBadge />}
                  </div>
                  <div style={{ fontSize: 11, color: CLR.dim, marginTop: 2 }}>{WEEK_SETS[week]} sets · {WEEK_REPS[week]} reps · {WEEK_RPE[week]}</div>
                </>
              ) : d.active ? (
                <>
                  <div style={{ fontSize: 13, color: CLR.teal, display: "flex", alignItems: "center" }}>
                    Active Recovery
                    {hasRecLog && <SavedBadge />}
                  </div>
                  <div style={{ fontSize: 11, color: CLR.teal, marginTop: 2, opacity: 0.7 }}>Walk · Cycle · Yoga · Hike</div>
                </>
              ) : (
                <div style={{ fontSize: 13, color: CLR.dim }}>Full Rest</div>
              )}
            </div>
            {(d.workout || d.active) && <div style={{ fontSize: 18, color: CLR.dim }}>›</div>}
          </div>
        );
      })}
    </div>
  );
}

// ── TRAIN TAB ──────────────────────────────────────────
function TrainTab({ week, appData, updateAppData }) {
  const [activeWk, setActiveWk] = useState(null);
  const [expandedEx, setExpandedEx] = useState(null);
  const [doneSets, setDoneSets] = useState({});
  const [inputs, setInputs] = useState({});
  const timer = useTimer();
  const phase = getPhase(week);
  const workout = activeWk ? WORKOUTS[activeWk] : null;
  const totalSets = workout ? workout.exercises.length * WEEK_SETS[week] : 0;
  const doneCount = Object.values(doneSets).filter(Boolean).length;
  const progress = totalSets > 0 ? Math.round((doneCount / totalSets) * 100) : 0;

  function getPR(id) {
    let best = null;
    Object.values(appData.workoutLog).forEach(day => {
      if (day[id]) day[id].forEach(s => {
        const v = parseFloat(s?.weight);
        if (!isNaN(v) && (best === null || v > best)) best = v;
      });
    });
    return best;
  }

  function logAndSaveSet(id, si, weight, reps) {
    const key = wkKey(week, activeWk);
    const existing = appData.workoutLog[key] || {};
    const exSets = existing[id] ? [...existing[id]] : [];
    exSets[si] = { weight, reps, ts: Date.now() };
    const updated = {
      ...appData,
      workoutLog: {
        ...appData.workoutLog,
        [key]: { ...existing, [id]: exSets },
      },
    };
    updateAppData(updated);
  }

  function markDone(id, si) {
    const k = `${id}_${si}`;
    const inp = inputs[k] || {};
    logAndSaveSet(id, si, inp.weight || "", inp.reps || "");
    setDoneSets(p => ({ ...p, [k]: true }));
    timer.start(90);
  }

  function getHistory(id) {
    const res = [];
    for (let w = 1; w <= 8; w++) {
      ["A","B","C"].forEach(k => {
        const day = appData.workoutLog[wkKey(w, k)];
        if (day?.[id]?.length) res.push({ week: w, phase: PHASES[WEEK_PHASE[w]].name.slice(0,3), sets: day[id] });
      });
    }
    return res.slice(-3);
  }

  function openWorkout(k) { setActiveWk(k); setDoneSets({}); setInputs({}); setExpandedEx(null); }
  function back() { setActiveWk(null); setDoneSets({}); setInputs({}); setExpandedEx(null); }

  if (!workout) {
    return (
      <div>
        <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: CLR.dim, padding: "14px 16px 6px" }}>Select Workout</div>
        <PhaseCard week={week} />
        {["A","B","C"].map((k, i) => {
          const saved = !!appData.workoutLog[wkKey(week, k)];
          return (
            <div key={k} onClick={() => openWorkout(k)} style={{ margin: "0 16px 8px", padding: "12px 13px", background: CLR.dark1, border: `1px solid ${CLR.dim2}`, borderRadius: 4, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, background: CLR.dark3, border: `1px solid ${phase.color}`, color: phase.color }}>
                {["Mon","Wed","Fri"][i]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: CLR.cream, display: "flex", alignItems: "center" }}>
                  {WORKOUTS[k].label}{saved && <SavedBadge />}
                </div>
                <div style={{ fontSize: 11, color: CLR.dim, marginTop: 2 }}>{WEEK_SETS[week]} sets · {WEEK_REPS[week]} reps</div>
              </div>
              <div style={{ fontSize: 18, color: CLR.dim }}>›</div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      <div style={{ padding: "13px 16px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 10, color: CLR.dim, letterSpacing: "0.08em", textTransform: "uppercase" }}>Week {week} · {phase.name} · {WEEK_RPE[week]}</div>
          <div style={{ fontSize: 15, color: CLR.gold, marginTop: 3 }}>{workout.label}</div>
          <div style={{ fontSize: 11, color: CLR.muted, marginTop: 2, fontStyle: "italic" }}>{WEEK_SETS[week]} sets · {WEEK_REPS[week]} reps · {WEEK_REST[week]} rest</div>
        </div>
        <button onClick={back} style={{ padding: "7px 12px", background: "transparent", border: `1px solid ${CLR.dim2}`, borderRadius: 3, color: CLR.tan, fontSize: 11, cursor: "pointer", fontFamily: "Georgia, serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>← Back</button>
      </div>
      <div style={{ height: 3, background: CLR.dark2, margin: "0 16px 3px", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", background: `linear-gradient(90deg, ${phase.color}, ${CLR.goldLt})`, width: `${progress}%`, transition: "width 0.4s", borderRadius: 2 }} />
      </div>
      <div style={{ padding: "2px 16px 10px", fontSize: 11, color: CLR.dim }}>{doneCount} / {totalSets} sets complete — auto-saved as you go</div>
      <RestTimer val={timer.val} active={timer.active} skip={timer.skip} />
      <div style={{ margin: "0 16px 12px", background: CLR.dark2, border: `1px solid ${CLR.dim2}`, borderRadius: 4, overflow: "hidden" }}>
        {workout.exercises.map(ex => {
          const isExp = expandedEx === ex.id;
          const pr = getPR(ex.id);
          const hist = getHistory(ex.id);
          const savedSets = appData.workoutLog[wkKey(week, activeWk)]?.[ex.id] || [];
          return (
            <div key={ex.id} style={{ borderBottom: `1px solid ${CLR.dim2}`, background: isExp ? CLR.dark3 : "transparent" }}>
              <div onClick={() => setExpandedEx(isExp ? null : ex.id)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 14px", cursor: "pointer" }}>
                <div>
                  <div style={{ fontSize: 13, color: CLR.cream, fontWeight: 600 }}>
                    {ex.name}
                    {pr && <span style={{ background: CLR.gold, color: CLR.bg, fontSize: 10, fontWeight: 900, padding: "2px 5px", borderRadius: 2, marginLeft: 6, verticalAlign: "middle" }}>PR</span>}
                  </div>
                  <div style={{ fontSize: 11, color: CLR.dim, marginTop: 2 }}>{WEEK_SETS[week]} sets · {WEEK_REPS[week]} reps{pr ? ` · PR: ${pr}lbs` : ""}</div>
                </div>
                <div style={{ fontSize: 18, color: CLR.dim, transform: isExp ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>›</div>
              </div>
              {isExp && (
                <>
                  <div style={{ margin: "0 14px 8px", padding: "10px 13px", background: CLR.bg, borderLeft: `3px solid ${phase.color}`, fontSize: 12, color: CLR.muted, fontStyle: "italic", lineHeight: 1.7 }}>{ex.cue}</div>
                  <div style={{ paddingBottom: 8 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "26px 1fr 1fr 32px", gap: 6, padding: "0 14px 5px" }}>
                      {["SET","WEIGHT","REPS",""].map((h,i) => <div key={i} style={{ fontSize: 10, color: CLR.dim2, textAlign: "center" }}>{h}</div>)}
                    </div>
                    {Array.from({ length: WEEK_SETS[week] }, (_, si) => {
                      const k = `${ex.id}_${si}`;
                      const done = doneSets[k];
                      const inp = inputs[k] || {};
                      const saved = savedSets[si];
                      return (
                        <div key={si} style={{ display: "grid", gridTemplateColumns: "26px 1fr 1fr 32px", gap: 6, padding: "6px 14px", alignItems: "center", opacity: done ? 0.5 : 1 }}>
                          <div style={{ fontSize: 12, textAlign: "center", color: done ? CLR.gold : CLR.dim, fontWeight: done ? 700 : 400 }}>{si + 1}</div>
                          <input type="number" placeholder={saved?.weight || "lbs"} value={inp.weight || ""} disabled={done}
                            onChange={e => setInputs(p => ({ ...p, [k]: { ...(p[k]||{}), weight: e.target.value } }))}
                            style={{ background: CLR.bg, border: `1px solid ${CLR.dim2}`, borderRadius: 3, color: CLR.cream, padding: "8px 4px", fontSize: 13, fontFamily: "monospace", textAlign: "center", width: "100%", outline: "none" }} />
                          <input type="number" placeholder={saved?.reps || WEEK_REPS[week].split("–")[0]} value={inp.reps || ""} disabled={done}
                            onChange={e => setInputs(p => ({ ...p, [k]: { ...(p[k]||{}), reps: e.target.value } }))}
                            style={{ background: CLR.bg, border: `1px solid ${CLR.dim2}`, borderRadius: 3, color: CLR.cream, padding: "8px 4px", fontSize: 13, fontFamily: "monospace", textAlign: "center", width: "100%", outline: "none" }} />
                          <button onClick={() => !done && markDone(ex.id, si)}
                            style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, cursor: done ? "default" : "pointer", border: done ? "none" : `1px solid ${CLR.dim}`, background: done ? CLR.gold : CLR.dark2, color: done ? CLR.bg : CLR.dim }}>✓</button>
                        </div>
                      );
                    })}
                  </div>
                  {hist.length > 0 && (
                    <div style={{ borderTop: `1px solid ${CLR.dim2}` }}>
                      <div style={{ fontSize: 10, letterSpacing: "0.12em", color: CLR.dim2, padding: "6px 14px 3px", textTransform: "uppercase" }}>Previous</div>
                      {hist.map((h, hi) => (
                        <div key={hi} style={{ padding: "7px 14px", borderBottom: `1px solid ${CLR.dark3}`, display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 11, color: CLR.dim }}>Wk {h.week} · {h.phase}</span>
                          <span style={{ fontSize: 12, fontFamily: "monospace", color: CLR.muted }}>{h.sets.filter(Boolean).map(s => `${s.weight}×${s.reps}`).join("  ")}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
      {progress === 100 && (
        <div style={{ margin: "0 16px 20px", padding: "20px", background: CLR.dark3, border: `1px solid ${CLR.gold}`, borderRadius: 4, textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>💪</div>
          <div style={{ fontSize: 13, color: CLR.gold, letterSpacing: "0.12em", textTransform: "uppercase" }}>Workout Complete</div>
          <div style={{ fontSize: 12, color: CLR.muted, marginTop: 6, fontStyle: "italic" }}>That's how it's done. Week {week} · {phase.name}</div>
        </div>
      )}
    </div>
  );
}

// ── RECOVER TAB ────────────────────────────────────────
function RecoverTab({ week, appData, updateAppData }) {
  const [selectedDay, setSelectedDay] = useState(null);
  const [activity, setActivity] = useState(null);
  const [duration, setDuration] = useState("");
  const [energy, setEnergy] = useState(null);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const recoveryDays = SCHEDULE.filter(d => d.active).map(d => d.day);

  function loadEntry(day) {
    const key = recKey(week, day);
    const entry = appData.recoveryLog[key];
    if (entry) {
      setActivity(entry.activity || null);
      setDuration(entry.duration || "");
      setEnergy(entry.energy || null);
      setNotes(entry.notes || "");
    } else {
      setActivity(null); setDuration(""); setEnergy(null); setNotes("");
    }
    setSaved(false);
    setSelectedDay(day);
  }

  function saveEntry() {
    if (!selectedDay) return;
    const key = recKey(week, selectedDay);
    const entry = { activity, duration, energy, notes, ts: Date.now() };
    const updated = { ...appData, recoveryLog: { ...appData.recoveryLog, [key]: entry } };
    updateAppData(updated);
    setSaved(true);
  }

  if (!selectedDay) {
    return (
      <div>
        <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: CLR.dim, padding: "14px 16px 6px" }}>Select Recovery Day</div>
        <div style={{ margin: "0 16px 12px", padding: "14px", background: CLR.dark2, border: `1px solid ${CLR.dim2}`, borderRadius: 4 }}>
          <div style={{ fontSize: 12, color: CLR.tan, lineHeight: 1.7, fontStyle: "italic" }}>
            Your rest days are part of the program. Log your active recovery to track your full week — not just your gym sessions.
          </div>
        </div>
        {recoveryDays.map(day => {
          const entry = appData.recoveryLog[recKey(week, day)];
          const act = entry?.activity ? RECOVERY_ACTIVITIES.find(a => a.id === entry.activity) : null;
          return (
            <div key={day} onClick={() => loadEntry(day)} style={{ margin: "0 16px 8px", padding: "12px 13px", background: CLR.dark1, border: `1px solid ${CLR.teal}`, borderRadius: 4, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, background: CLR.dark3, border: `1px solid ${CLR.teal}`, color: CLR.teal }}>{day}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: CLR.cream, display: "flex", alignItems: "center" }}>
                  {act ? `${act.icon} ${act.name}` : "Active Recovery"}
                  {entry && <SavedBadge />}
                </div>
                <div style={{ fontSize: 11, color: CLR.teal, marginTop: 2, opacity: 0.7 }}>
                  {entry ? `${entry.duration || "?"}min · Energy: ${entry.energy || "?"}/${5}` : "Tap to log"}
                </div>
              </div>
              <div style={{ fontSize: 18, color: CLR.dim }}>›</div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      <div style={{ padding: "13px 16px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 10, color: CLR.dim, letterSpacing: "0.08em", textTransform: "uppercase" }}>Week {week} · Active Recovery</div>
          <div style={{ fontSize: 15, color: CLR.teal, marginTop: 3 }}>{selectedDay} — Recovery Log</div>
        </div>
        <button onClick={() => setSelectedDay(null)} style={{ padding: "7px 12px", background: "transparent", border: `1px solid ${CLR.dim2}`, borderRadius: 3, color: CLR.tan, fontSize: 11, cursor: "pointer", fontFamily: "Georgia, serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>← Back</button>
      </div>

      {/* Activity picker */}
      <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: CLR.dim, padding: "10px 16px 6px" }}>What did you do?</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "0 16px 4px" }}>
        {RECOVERY_ACTIVITIES.map(act => (
          <div key={act.id} onClick={() => { setActivity(act.id); setSaved(false); }}
            style={{ padding: "12px 10px", background: activity === act.id ? CLR.dark3 : CLR.dark1, border: `1px solid ${activity === act.id ? CLR.teal : CLR.dim2}`, borderRadius: 4, cursor: "pointer", textAlign: "center" }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{act.icon}</div>
            <div style={{ fontSize: 12, color: activity === act.id ? CLR.cream : CLR.tan }}>{act.name}</div>
            <div style={{ fontSize: 10, color: CLR.dim, marginTop: 2 }}>{act.cal} cal/30min</div>
          </div>
        ))}
      </div>

      {activity && (
        <div style={{ margin: "8px 16px", padding: "10px 13px", background: CLR.dark2, borderLeft: `3px solid ${CLR.teal}`, borderRadius: "0 3px 3px 0", fontSize: 11, color: CLR.muted, fontStyle: "italic" }}>
          {RECOVERY_ACTIVITIES.find(a => a.id === activity)?.tip}
        </div>
      )}

      {/* Duration */}
      <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: CLR.dim, padding: "10px 16px 6px" }}>Duration (minutes)</div>
      <div style={{ display: "flex", gap: 8, padding: "0 16px 4px", flexWrap: "wrap" }}>
        {["20","30","45","60","75","90"].map(d => (
          <div key={d} onClick={() => { setDuration(d); setSaved(false); }}
            style={{ padding: "9px 16px", background: duration === d ? CLR.dark3 : CLR.dark1, border: `1px solid ${duration === d ? CLR.teal : CLR.dim2}`, borderRadius: 3, cursor: "pointer", fontSize: 13, color: duration === d ? CLR.cream : CLR.tan, fontFamily: "monospace" }}>{d}</div>
        ))}
        <input type="number" placeholder="Other" value={["20","30","45","60","75","90"].includes(duration) ? "" : duration}
          onChange={e => { setDuration(e.target.value); setSaved(false); }}
          style={{ padding: "9px 12px", background: CLR.dark1, border: `1px solid ${CLR.dim2}`, borderRadius: 3, color: CLR.cream, fontSize: 13, fontFamily: "monospace", width: 70, outline: "none" }} />
      </div>

      {/* Energy */}
      <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: CLR.dim, padding: "10px 16px 6px" }}>How did you feel?</div>
      <div style={{ display: "flex", gap: 6, padding: "0 16px 4px" }}>
        {ENERGY_LEVELS.map(e => (
          <div key={e.val} onClick={() => { setEnergy(e.val); setSaved(false); }}
            style={{ flex: 1, padding: "10px 4px", background: energy === e.val ? CLR.dark3 : CLR.dark1, border: `1px solid ${energy === e.val ? e.color : CLR.dim2}`, borderRadius: 3, cursor: "pointer", textAlign: "center" }}>
            <div style={{ fontSize: 16, marginBottom: 3 }}>{["😴","😓","😐","😊","🔥"][e.val-1]}</div>
            <div style={{ fontSize: 9, color: energy === e.val ? e.color : CLR.dim, letterSpacing: "0.06em" }}>{e.label}</div>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: CLR.dim, padding: "10px 16px 6px" }}>Notes (optional)</div>
      <div style={{ padding: "0 16px 4px" }}>
        <textarea value={notes} onChange={e => { setNotes(e.target.value); setSaved(false); }} placeholder="How did the session feel? Anything to note..."
          style={{ width: "100%", background: CLR.dark1, border: `1px solid ${CLR.dim2}`, borderRadius: 3, color: CLR.cream, padding: "10px 12px", fontSize: 12, fontFamily: "Georgia, serif", lineHeight: 1.6, resize: "none", outline: "none", minHeight: 80 }} />
      </div>

      {/* Save */}
      <div style={{ padding: "12px 16px" }}>
        <button onClick={saveEntry} style={{ width: "100%", padding: "14px", background: CLR.teal, color: CLR.bg, border: "none", borderRadius: 3, fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", fontFamily: "Georgia, serif" }}>
          {saved ? "✓  Saved" : "Save Recovery Session"}
        </button>
        {saved && <div style={{ textAlign: "center", fontSize: 11, color: "#7a9e6e", marginTop: 8, fontStyle: "italic" }}>Your session has been saved to this device.</div>}
      </div>
    </div>
  );
}

// ── PROGRESS TAB ───────────────────────────────────────
function ProgressTab({ appData }) {
  const allEx = ["A","B","C"].flatMap(k => WORKOUTS[k].exercises);

  function getPR(id) {
    let best = null;
    Object.values(appData.workoutLog).forEach(day => {
      if (day[id]) day[id].forEach(s => {
        const v = parseFloat(s?.weight);
        if (!isNaN(v) && (best === null || v > best)) best = v;
      });
    });
    return best;
  }

  function getVolume(week) {
    let total = 0;
    ["A","B","C"].forEach(k => {
      const day = appData.workoutLog[wkKey(week, k)];
      if (day) Object.values(day).forEach(sets => { total += sets.filter(Boolean).length; });
    });
    return total;
  }

  function getRecoverySummary(week) {
    let count = 0;
    SCHEDULE.filter(d => d.active).forEach(d => {
      if (appData.recoveryLog[recKey(week, d.day)]) count++;
    });
    return count;
  }

  return (
    <div>
      <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: CLR.dim, padding: "14px 16px 6px" }}>Personal Records</div>
      <div style={{ margin: "0 16px 12px", background: CLR.dark2, border: `1px solid ${CLR.dim2}`, borderRadius: 4, overflow: "hidden" }}>
        {allEx.map(ex => {
          const pr = getPR(ex.id);
          return (
            <div key={ex.id} style={{ padding: "9px 14px", borderBottom: `1px solid ${CLR.dim2}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: CLR.tan }}>{ex.name}</span>
              <span style={{ fontSize: 14, fontFamily: "monospace", color: pr ? CLR.gold : CLR.dim2, fontWeight: pr ? 700 : 400 }}>{pr ? `${pr} lbs` : "—"}</span>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: CLR.dim, padding: "14px 16px 6px" }}>Weekly Overview</div>
      <div style={{ margin: "0 16px 12px", background: CLR.dark2, border: `1px solid ${CLR.dim2}`, borderRadius: 4, overflow: "hidden" }}>
        {/* Column headers */}
        <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 80px 80px", gap: 6, padding: "8px 14px", borderBottom: `1px solid ${CLR.dim2}`, background: CLR.dark3 }}>
          {["WEEK","PHASE","STRENGTH","RECOVERY"].map(h => <div key={h} style={{ fontSize: 9, color: CLR.dim2, letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center" }}>{h}</div>)}
        </div>
        {Array.from({ length: 8 }, (_, i) => i + 1).map(w => {
          const p = getPhase(w);
          const vol = getVolume(w);
          const rec = getRecoverySummary(w);
          const maxVol = 45;
          return (
            <div key={w} style={{ display: "grid", gridTemplateColumns: "60px 1fr 80px 80px", gap: 6, padding: "9px 14px", borderBottom: `1px solid ${CLR.dim2}`, alignItems: "center" }}>
              <div style={{ fontSize: 12, color: p.color, fontWeight: 700, textAlign: "center" }}>Wk {w}</div>
              <div style={{ fontSize: 11, color: CLR.muted }}>{p.name}</div>
              <div style={{ textAlign: "center" }}>
                {vol > 0 ? (
                  <>
                    <div style={{ height: 3, background: CLR.dark3, borderRadius: 2, marginBottom: 3 }}>
                      <div style={{ height: "100%", background: p.color, width: `${Math.min((vol/maxVol)*100,100)}%`, borderRadius: 2 }} />
                    </div>
                    <div style={{ fontSize: 10, color: CLR.dim, fontFamily: "monospace" }}>{vol}s</div>
                  </>
                ) : <div style={{ fontSize: 11, color: CLR.dim2 }}>—</div>}
              </div>
              <div style={{ textAlign: "center" }}>
                {rec > 0 ? (
                  <div style={{ fontSize: 11, color: CLR.teal }}>{rec}/3 days</div>
                ) : <div style={{ fontSize: 11, color: CLR.dim2 }}>—</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── PROGRAM TAB ────────────────────────────────────────
function ProgramTab() {
  return (
    <div>
      <div style={{ margin: "14px 16px", padding: "16px", background: CLR.dark2, border: `1px solid ${CLR.dim2}`, borderRadius: 4 }}>
        <div style={{ fontSize: 10, letterSpacing: "0.18em", color: CLR.dim, textTransform: "uppercase", marginBottom: 5 }}>@markandrewfitness</div>
        <div style={{ fontSize: 13, color: CLR.tan, fontStyle: "italic", lineHeight: 1.7, marginBottom: 9 }}>Your transformation starts at 40. Not despite it.</div>
        <div style={{ fontSize: 12, color: CLR.dim, fontStyle: "italic", lineHeight: 1.6, marginBottom: 14 }}>Designed by Mark Andrew — certified personal trainer, 100lb transformation, and proof that 40 is just the starting line.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[["8","Weeks"],["3","Days/wk"],["45","Min"]].map(([v,l]) => (
            <div key={l} style={{ textAlign: "center", padding: "9px 4px", background: CLR.bg, borderRadius: 3, border: `1px solid ${CLR.dim2}` }}>
              <div style={{ fontSize: 18, color: CLR.gold, fontWeight: 700 }}>{v}</div>
              <div style={{ fontSize: 10, color: CLR.dim, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: CLR.dim, padding: "14px 16px 6px" }}>Phase Breakdown</div>
      {PHASES.map((p, i) => (
        <div key={i} style={{ margin: "0 16px 8px", borderRadius: 4, overflow: "hidden", border: `1px solid ${CLR.dim2}` }}>
          <div style={{ padding: "12px 14px", background: p.color }}>
            <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, color: "#0d1117", marginBottom: 2 }}>Phase {["I","II","III","IV"][i]} — {p.name}</div>
            <div style={{ fontSize: 11, color: "#111", opacity: 0.7 }}>{i < 3 ? `Weeks ${p.weeks[0]}–${p.weeks[1]}` : "Weeks 7–8"}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, padding: "8px 14px", background: CLR.dark1, borderTop: `1px solid ${CLR.dim2}`, borderBottom: `1px solid ${CLR.dim2}` }}>
            {[["Sets",p.sets],["Reps",p.reps],["Rest",p.rest],["RPE",p.rpe]].map(([l,v]) => (
              <div key={l} style={{ background: CLR.dark3, padding: "6px 8px", borderRadius: 3, textAlign: "center" }}>
                <div style={{ fontSize: 10, color: CLR.dim, textTransform: "uppercase", letterSpacing: "0.08em" }}>{l}</div>
                <div style={{ fontSize: 12, color: CLR.goldLt, fontWeight: 700, marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "10px 14px", borderBottom: `1px solid ${CLR.dim2}` }}>
            <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: p.color, marginBottom: 6 }}>What this phase is about</div>
            <div style={{ fontSize: 12, color: CLR.tan, lineHeight: 1.7 }}>{p.fullDesc}</div>
          </div>
          <div style={{ padding: "10px 14px", borderBottom: `1px solid ${CLR.dim2}` }}>
            <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: p.color, marginBottom: 7 }}>What to expect</div>
            {p.expect.map((pt, j) => (
              <div key={j} style={{ display: "flex", gap: 8, marginBottom: 7, alignItems: "flex-start" }}>
                <span style={{ fontSize: 12, color: p.color, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>→</span>
                <span style={{ fontSize: 12, color: CLR.muted, lineHeight: 1.6 }}>{pt}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: "10px 14px", background: CLR.dark3 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: p.color, marginBottom: 5 }}>Phase mindset</div>
            <div style={{ fontSize: 13, color: CLR.cream, fontStyle: "italic" }}>"{p.mindset}"</div>
            <div style={{ fontSize: 11, color: CLR.dim, marginTop: 4 }}>— Mark Andrew</div>
          </div>
        </div>
      ))}

      <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: CLR.dim, padding: "14px 16px 6px" }}>Exercises</div>
      {["A","B","C"].map(k => (
        <div key={k} style={{ margin: "0 16px 8px", background: CLR.dark2, border: `1px solid ${CLR.dim2}`, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ padding: "10px 14px", borderBottom: `1px solid ${CLR.dim2}` }}>
            <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: CLR.gold }}>{WORKOUTS[k].label}</div>
          </div>
          {WORKOUTS[k].exercises.map((ex, i) => (
            <div key={ex.id} style={{ padding: "9px 14px", borderBottom: i < 4 ? `1px solid ${CLR.dim2}` : "none" }}>
              <div style={{ fontSize: 13, color: CLR.tan }}>{ex.name}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("today");
  const [week, setWeek] = useState(1);
  const [appData, setAppData] = useState(() => loadFromStorage());
  const phase = getPhase(week);

  function updateAppData(newData) {
    setAppData(newData);
    saveToStorage(newData);
  }

  const tabs = [
    ["today",   "Today"],
    ["train",   "Train"],
    ["recover", "Recover"],
    ["progress","Progress"],
    ["program", "Program"],
  ];

  return (
    <div style={{ minHeight: "100vh", background: CLR.bg, color: CLR.cream, fontFamily: "Georgia, serif", maxWidth: 480, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ padding: "14px 16px 0", borderBottom: `1px solid ${CLR.dim2}`, background: CLR.bg }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 12 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", color: CLR.dim, textTransform: "uppercase", marginBottom: 3 }}>@markandrewfitness</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: CLR.gold, fontStyle: "italic", letterSpacing: "0.1em" }}>BUILT 40</div>
            <div style={{ fontSize: 10, color: CLR.dim, marginTop: 2, letterSpacing: "0.08em" }}>Mark Andrew Fitness · 8 Weeks</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: CLR.dim, letterSpacing: "0.08em", textTransform: "uppercase" }}>WEEK</div>
            <div style={{ fontSize: 28, color: CLR.gold, fontWeight: 700, lineHeight: 1 }}>{week}</div>
            <div style={{ fontSize: 10, color: phase.color, letterSpacing: "0.1em", textTransform: "uppercase" }}>{phase.name}</div>
          </div>
        </div>
      </div>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${phase.color}, ${CLR.teal})` }} />

      {/* Nav */}
      <nav style={{ display: "flex", borderBottom: `1px solid ${CLR.dim2}`, background: CLR.bg, position: "sticky", top: 0, zIndex: 100 }}>
        {tabs.map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{ flex: 1, padding: "11px 2px", border: "none", background: CLR.bg, color: tab === key ? CLR.gold : CLR.dim, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", fontFamily: "Georgia, serif", borderBottom: tab === key ? `2px solid ${CLR.gold}` : "2px solid transparent", outline: "none" }}>
            {label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div style={{ paddingBottom: 40 }}>
        {tab === "today"    && <TodayTab week={week} setWeek={setWeek} setTab={setTab} appData={appData} />}
        {tab === "train"    && <TrainTab week={week} appData={appData} updateAppData={updateAppData} />}
        {tab === "recover"  && <RecoverTab week={week} appData={appData} updateAppData={updateAppData} />}
        {tab === "progress" && <ProgressTab appData={appData} />}
        {tab === "program"  && <ProgramTab />}
      </div>
    </div>
  );
}
