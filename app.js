const program = {
  week1: {
    day1: {
      name: "Push",
      exercises: [
        { name: "Incline Barbell Press", sets: 3, reps: "8–10" },
        { name: "Standing DB Shoulder Press", sets: 3, reps: "10–12" },
        { name: "Close-Grip Push-ups", sets: 3, reps: "AMRAP" },
        // ...rest of Day 1
      ]
    },
    // day2, day3, day4, day5...
  },
  // week2, week3, week4...
};

const weekSelect = document.getElementById("weekSelect");
const daySelect = document.getElementById("daySelect");
const workoutEl = document.getElementById("workout");
const notesEl = document.getElementById("notes");
const completedEl = document.getElementById("completed");
const saveBtn = document.getElementById("saveBtn");

const STORAGE_KEY = "season2WorkoutLog";

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const state = loadState();

function initSelectors() {
  Object.keys(program).forEach(weekKey => {
    const opt = document.createElement("option");
    opt.value = weekKey;
    opt.textContent = weekKey.toUpperCase();
    weekSelect.appendChild(opt);
  });

  weekSelect.addEventListener("change", updateDays);
  daySelect.addEventListener("change", renderWorkout);

  weekSelect.value = "week1";
  updateDays();
}

function updateDays() {
  daySelect.innerHTML = "";
  const days = program[weekSelect.value];
  Object.keys(days).forEach(dayKey => {
    const opt = document.createElement("option");
    opt.value = dayKey;
    opt.textContent = days[dayKey].name;
    daySelect.appendChild(opt);
  });
  renderWorkout();
}

function renderWorkout() {
  const week = weekSelect.value;
  const day = daySelect.value;
  const data = program[week][day];

  workoutEl.innerHTML = `
    <h2>${data.name} – ${week.toUpperCase()}</h2>
    ${data.exercises
      .map(
        ex =>
          `<div class="exercise">
            <strong>${ex.name}</strong><br/>
            Sets: ${ex.sets}, Reps: ${ex.reps}
          </div>`
      )
      .join("")}
  `;

  const key = `${week}-${day}`;
  const log = state[key] || { notes: "", completed: false };
  notesEl.value = log.notes;
  completedEl.checked = log.completed;
}

saveBtn.addEventListener("click", () => {
  const week = weekSelect.value;
  const day = daySelect.value;
  const key = `${week}-${day}`;

  state[key] = {
    notes: notesEl.value,
    completed: completedEl.checked
  };

  saveState(state);
  alert("Saved ✅");
});

initSelectors();

// Register service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
