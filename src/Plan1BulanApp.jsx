import React, { useEffect, useState } from "react";


export default function Plan1BulanApp() {
  const defaultHeightCm = 177; 
  const defaultWeightKg = 99;

  const [height, setHeight] = useState(defaultHeightCm);
  const [weight, setWeight] = useState(defaultWeightKg);
  const [dateKey, setDateKey] = useState(getTodayKey());
  const [tasks, setTasks] = useState(() => loadTasks(getTodayKey()));
  const [notes, setNotes] = useState(() => loadNotes(getTodayKey()));
  const [weeklyTargetKg, setWeeklyTargetKg] = useState(1);
  const [startWeight, setStartWeight] = useState(weight);
  const [darkMode, setDarkMode] = useState(false);

  const weeklyPlan = {
    Monday: [
      "Treadmill 30 menit (4 km/jam)",
      "Plank 3×30 detik",
      "Sit-up 2×12",
      "Kegel: 3 set × 10 repetisi (tahan 5s, lepas 5s)",
    ],
    Tuesday: [
      "Push-up 3×12–15",
      "Barbel 4–5kg: bicep curl 3×12, shoulder press 3×12",
      "Plank 2×30 detik",
      "Kegel: 3 set × 10 repetisi cepat (kontraksi–lepas cepat)",
    ],
    Wednesday: [
      "Treadmill 40–45 menit (jalan cepat)",
      "Variasi tempo (5m normal / 2m cepat)",
      "Kegel: 2 set × 10 repetisi tahan lama (tahan 10s, lepas 5s)",
    ],
    Thursday: [
      "Squat 3×15",
      "Deadlift ringan 3×12",
      "Push-up 2×10",
      "Kegel: 3 set × 15 repetisi (tahan 5s)",
    ],
    Friday: [
      "Treadmill 30 menit",
      "Mountain climber 2×20 (opsional)",
      "Plank 3×30 detik",
      "Kegel: 2 set × (10 cepat + 10 tahan)",
    ],
    Saturday: [
      "Treadmill 20–30 menit",
      "Barbel ringan 2×12",
      "Stretching 10 menit",
      "Kegel: 3 set × 10 repetisi tahan lama",
    ],
    Sunday: [
      "Recovery: jalan santai 20 menit",
      "Stretching full body",
      "Kegel ringan: 2 set × 10 repetisi",
    ],
  };

  useEffect(() => {
    saveTasks(dateKey, tasks);
  }, [dateKey, tasks]);

  useEffect(() => {
    saveNotes(dateKey, notes);
  }, [dateKey, notes]);

  useEffect(() => {
    const stored = localStorage.getItem("p1b_startWeight");
    if (!stored) localStorage.setItem("p1b_startWeight", String(startWeight));
    else setStartWeight(Number(stored));

    const theme = localStorage.getItem("p1b_darkMode");
    if (theme === "true") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("p1b_darkMode", String(darkMode));
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  function getBMI() {
    const h = height / 100;
    if (!h) return 0;
    return +(weight / (h * h)).toFixed(1);
  }

  function getBMICategory(bmi) {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  }

  function toggleTask(i) {
    const next = tasks.map((t, idx) => (idx === i ? { ...t, done: !t.done } : t));
    setTasks(next);
  }

  function addCustomTask() {
    const text = prompt("Nama tugas (misal: jalan 30 menit)");
    if (!text) return;
    setTasks([...tasks, { text, done: false }]);
  }

  function changeDate(offsetDays) {
    const d = new Date(dateKey);
    d.setDate(d.getDate() + offsetDays);
    const k = formatKey(d);
    setDateKey(k);
    setTasks(loadTasks(k));
    setNotes(loadNotes(k));
  }

  function resetForToday() {
    const k = getTodayKey();
    setDateKey(k);
    setTasks(loadTasks(k));
    setNotes(loadNotes(k));
  }

  function saveWeightNow() {
    localStorage.setItem("p1b_weight_" + dateKey, String(weight));
    if (!localStorage.getItem("p1b_startWeight")) {
      localStorage.setItem("p1b_startWeight", String(weight));
      setStartWeight(weight);
    }
    alert("Berat tersimpan untuk " + dateKey);
  }

  function getProgressKg() {
    const start = Number(localStorage.getItem("p1b_startWeight") || startWeight);
    return +(start - weight).toFixed(1);
  }

  function printSchedule() {
    const wnd = window.open("", "_blank");
    if (!wnd) return alert("Gagal membuka jendela baru — pastikan popup diizinkan.");
    const title = `Jadwal Latihan Mingguan - ${new Date().toLocaleDateString()}`;
    const html = `<!doctype html><html><head><title>${title}</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:Arial,Helvetica,sans-serif;padding:20px}h1{font-size:18px}ul{line-height:1.6}</style></head><body><h1>${title}</h1>${Object.keys(weeklyPlan).map(day=>`<h3>${day}</h3><ul>${weeklyPlan[day].map(i=>`<li>${i}</li>`).join('')}</ul>`).join('')}<p>Catatan: tambah Kegel tiap hari sesuai panduan.</p></body></html>`;
    wnd.document.write(html);
    wnd.document.close();
    wnd.print();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Plan 1 Bulan — Checklist Harian</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Tracker untuk makan, olahraga, tidur, progress berat & latihan Kegel.</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-right text-sm text-gray-500 dark:text-gray-400">Hari: <strong>{dateKey}</strong></div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => changeDate(-1)} className="px-3 py-1 rounded border">◀</button>
              <button onClick={resetForToday} className="px-3 py-1 rounded border">Today</button>
              <button onClick={() => changeDate(1)} className="px-3 py-1 rounded border">▶</button>
              <button onClick={() => setDarkMode(!darkMode)} className="px-3 py-1 rounded border">{darkMode ? "🌙 Dark" : "☀️ Light"}</button>
            </div>
          </div>
        </header>

        <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 p-4 border rounded-lg dark:border-gray-700">
            <h2 className="font-semibold">Checklist Harian & Catatan</h2>
            <div className="mt-3 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400">Tinggi (cm)</label>
                  <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400">Berat (kg)</label>
                  <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600" />
                </div>
              </div>

              <div>
                <div>BMI: <strong>{getBMI()}</strong> — <span className="italic">{getBMICategory(getBMI())}</span></div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Progress vs baseline: <strong>{getProgressKg()} kg</strong></div>
              </div>

              <div>
                <h3 className="font-medium">Tugas hari ini</h3>
                <ul className="mt-2 space-y-2">
                  {tasks.map((t, i) => (
                    <li key={i} className="flex items-center justify-between p-2 border rounded dark:border-gray-600">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={t.done} onChange={() => toggleTask(i)} />
                        <div className={t.done ? "line-through text-gray-500" : ""}>{t.text}</div>
                      </div>
                      <div className="text-xs text-gray-400">{t.hint || ""}</div>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex gap-2">
                  <button onClick={addCustomTask} className="px-3 py-1 rounded border">Tambah tugas</button>
                  <button onClick={() => { if (confirm('Reset tugas hari ini?')) { const base = defaultTasks(); setTasks(base); saveTasks(dateKey, base); } }} className="px-3 py-1 rounded border">Reset tugas</button>
                </div>
              </div>

              <div>
                <h3 className="font-medium">Catatan Harian</h3>
                <textarea value={notes} onChange={(e) => { setNotes(e.target.value); }} className="w-full border rounded p-3 mt-2 min-h-[120px] dark:bg-gray-700 dark:border-gray-600" placeholder="Tulis hal penting hari ini, energi, kualitas ereksi, dll" />
              </div>
            </div>
          </div>

          <aside className="p-4 border rounded-lg dark:border-gray-700">
            <h2 className="font-semibold">Jadwal Mingguan & Kegel</h2>
            <div className="mt-3 text-sm leading-relaxed">
              {Object.keys(weeklyPlan).map((day) => (
                <div key={day} className="mb-3">
                  <div className="font-medium">{day}</div>
                  <ul className="list-disc list-inside text-sm mt-1">
                    {weeklyPlan[day].map((it, idx) => (
                      <li key={idx}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="mt-2 flex flex-col gap-2">
                <button onClick={printSchedule} className="px-3 py-1 rounded bg-blue-600 text-white">Print / Simpan Jadwal</button>
                <button onClick={() => { navigator.clipboard.writeText(JSON.stringify(weeklyPlan, null, 2)); alert('Jadwal disalin ke clipboard (JSON).'); }} className="px-3 py-1 rounded border">Copy Jadwal (JSON)</button>
              </div>

              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">Catatan: Lakukan Kegel tiap hari — bisa sambil duduk/berdiri. Jangan tahan napas saat kontraksi.</div>
            </div>
          </aside>
        </section>

        <footer className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">Tips: konsisten, catat progress, dan sesuaikan intensitas jika capek.</div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => { const data = exportAll(); navigator.clipboard.writeText(JSON.stringify(data, null, 2)); alert('Data disalin ke clipboard (JSON).'); }} className="px-3 py-1 rounded border">Export JSON</button>
            <button onClick={() => { localStorage.clear(); alert('Local storage dihapus. Aplikasi akan reset.'); resetForToday(); }} className="px-3 py-1 rounded border">Reset Semua</button>
          </div>
        </footer>
      </div>
    </div>
  );

  function defaultTasks() {
    return [
      { text: "Sarapan sehat (protein + serat)", done: false, hint: "Oatmeal/roti gandum + telur" },
      { text: "Jalan 20-30 menit / olahraga ringan", done: false, hint: "Boleh bagi 2x jalan 10 menit" },
      { text: "Tidur sebelum jam 12", done: false, hint: "Kurangi layar 30 menit sebelum tidur" },
      { text: "Stretch leher & punggung 5 menit", done: false, hint: "Turunkan pegal leher" },
    ];
  }

  function getTodayKey() {
    return formatKey(new Date());
  }

  function formatKey(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function saveTasks(k, t) {
    try {
      localStorage.setItem("p1b_tasks_" + k, JSON.stringify(t));
    } catch (e) {}
  }

  function loadTasks(k) {
    const raw = localStorage.getItem("p1b_tasks_" + k);
    if (!raw) return defaultTasks();
    try {
      return JSON.parse(raw);
    } catch (e) {
      return defaultTasks();
    }
  }

  function saveNotes(k, n) {
    try {
      localStorage.setItem("p1b_notes_" + k, n);
    } catch (e) {}
  }

  function loadNotes(k) {
    return localStorage.getItem("p1b_notes_" + k) || "";
  }

  function exportAll() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (k.startsWith("p1b_")) data[k] = localStorage.getItem(k);
    }
    return data;
  }
}
