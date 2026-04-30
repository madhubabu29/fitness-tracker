// List of muscle groups and exercises as requested.
// Add this at the VERY START of script.js (before the GROUPS definition)
if (!document.getElementById('muscle-groups') || !document.getElementById('add-muscle-group')) {
  console.error('Required HTML elements not found. Make sure index.html has id="muscle-groups" and id="add-muscle-group"');
}
const GROUPS = {
  'Chest': [
    'Bench Press',
    'Incline Bench Press',
    'Incline Dumbell Press',
    'Bench Dumbell flyer',
    'Push-up',
    'Dumbbell Press',
    'Cable Crossover',
    'Dips',
    'Machine Chest Press',
    'Decline Bench Press',
    'Wide Grip Push-up'
  ],
  'Triceps': [
    'Triceps Pushdown',
    'Skullcrusher',
    'Dumbell SkullCrusher',
    'Dips',
    'Close Grip Push-up',
    'Standing Rope Pushdown',
    'Triceps Kickback',
    'Bench Dip',
    'Machine Tricep Extension',
    'Overhead Standing Dumbell extension',
    'Overhead Dumbell extension'
  ],
  'Biceps': [
    'Seated Bicep Curl',
    'Spider dumbell Hammer Curl',
    'Preacher Curl',
    'Concentration Curl',
    'Cable Curl',
    'Chin-up',
    'Barbell Curl',
    'Incline Dumbbell Curl',
    'EZ Bar Curl',
    'Zottman Curl'
  ],
  'Shoulders': [
    'Shoulder Press',
    'Single Arm Dumbell Raise',
    'Lateral Raise',
    'Front Raise',
    'Reverse Fly',
    'Upright Row',
    'Dumbell 6 Ways',
    'Dumbbell Shoulder Press',
    'Seated Barbell Press',
    'Push Press'
  ],
  'Abs': [
    'Crunch',
    'Plank',
    'Hanging Leg Raise',
    'Bicycle Crunch',
    'Russian Twist',
    'Cable Wood Chops',
    'Knee Tucks on Bench',
    'Ab Wheel Rollout',
    'Flutter Kicks',
    'Side Plank'
  ],
  'Back': [
    'Pull-up',
    'Lat Pulldown',
    'Barbell Row',
    'Deadlift',
    'T-Bar Row',
    'Seated Cable Row',
    'Bench Dumbbell Row',
    'Inverted Row',
    'Straight Arm Pulldown',
    'Chin-up'
  ],
  'Legs Anterior': [
    'Squat',
    'Leg Press',
    'Rear Foot Elevated Split Squats ',
    'Leg Extension',
    'Front Squat',
    'Sissy Squat',
    'Bulgarian Split Squat',
    'Step-up',
    'Smith Machine Squat',
    'Sissy Squat'
  ],
  'Legs Posterior': [
    'Hip Thrust',
    'Glute Bridge',
    'Barbell Hip Extension',
    'Hyper Extension',
    'Seated Calf Raises',
    'Standing Calf Raises',
    'Hip Adductor/Abductor',
    'Lying Leg Side Raises',
    'Leg Curl',
    'Walking Lunges',
    'Seated Leg Curl',
    'Lying Leg Curl'
  ]
};

const muscleGroupsContainer = document.getElementById('muscle-groups');
const addMuscleGroupButton = document.getElementById('add-muscle-group');

let state = {
  groups: []
};

function saveState() {
  localStorage.setItem('workout-log', JSON.stringify(state));
}

function loadState() {
  const s = localStorage.getItem('workout-log');
  state = s ? JSON.parse(s) : { groups: [] };
}

function todayDate() {
  return new Date().toISOString().slice(0,10);
}

function calculateTotalVolume(sets) {
  let total = 0;
  for (let i = 0; i < 4; i++) {
    const reps = parseFloat(sets[i]?.reps) || 0;
    const wt = parseFloat(sets[i]?.wt) || 0;
    total += reps * wt;
  }
  return total;
}

function createMuscleGroupSection(groupIdx, groupName, entries) {
  const section = document.createElement('div');
  section.className = 'muscle-group-section';

  const headerDiv = document.createElement('div');
  headerDiv.className = 'muscle-group-header';
  headerDiv.innerHTML = `<strong>Muscle Group:</strong>
    <select data-group-idx="${groupIdx}">
      ${Object.keys(GROUPS).map(mg =>
        `<option value="${mg}"${mg===groupName?' selected':''}>${mg}</option>`
      ).join('')}
    </select>
    <button class="remove-group-btn" data-group-idx="${groupIdx}">Remove Group</button>`;
  section.appendChild(headerDiv);

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Date</th>
      <th>Exercise</th>
      <th>Set1<br>Reps</th><th>Set1<br>Wt</th>
      <th>Set2<br>Reps</th><th>Set2<br>Wt</th>
      <th>Set3<br>Reps</th><th>Set3<br>Wt</th>
      <th>Set4<br>Reps</th><th>Set4<br>Wt</th>
      <th>Total<br>Volume</th>
      <th>Delete</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  entries.forEach((ent, rowIdx) => {
    const tr = document.createElement('tr');

    const tdDate = document.createElement('td');
    tdDate.innerHTML = `<input type="date" value="${ent.date}" data-group-idx="${groupIdx}" data-row-idx="${rowIdx}" class="date-field" />`;
    tr.appendChild(tdDate);

    const tdEx = document.createElement('td');
    tdEx.innerHTML = `<select data-group-idx="${groupIdx}" data-row-idx="${rowIdx}" class="exercise-dropdown">
      ${GROUPS[groupName].map(ex =>
        `<option value="${ex}"${ex===ent.exercise?' selected':''}>${ex}</option>`
      ).join('')}
    </select>`;
    tr.appendChild(tdEx);

    for (let i=0;i<4;i++) {
      const reps = ent.sets[i]?.reps ?? '';
      const wt = ent.sets[i]?.wt ?? '';
      const tdReps = document.createElement('td');
      tdReps.innerHTML = `<input type="number" min="0" placeholder="Reps" value="${reps}" data-set="${i}" data-group-idx="${groupIdx}" data-row-idx="${rowIdx}" class="reps-field" />`;
      tr.appendChild(tdReps);
      const tdWt = document.createElement('td');
      tdWt.innerHTML = `<input type="text" placeholder="Wt" value="${wt}" data-set="${i}" data-group-idx="${groupIdx}" data-row-idx="${rowIdx}" class="wt-field" />`;
      tr.appendChild(tdWt);
    }

    const totalVolume = calculateTotalVolume(ent.sets);
    const tdVolume = document.createElement('td');
    tdVolume.className = 'total-volume-cell';
    tdVolume.textContent = totalVolume > 0 ? totalVolume.toFixed(2) : '-';
    tdVolume.setAttribute('data-group-idx', groupIdx);
    tdVolume.setAttribute('data-row-idx', rowIdx);
    tr.appendChild(tdVolume);

    const tdDel = document.createElement('td');
    tdDel.innerHTML = `<button class="delete-row-btn" data-group-idx="${groupIdx}" data-row-idx="${rowIdx}">X</button>`;
    tr.appendChild(tdDel);

    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  section.appendChild(table);

  const addRowBtn = document.createElement('button');
  addRowBtn.className = 'add-row-btn';
  addRowBtn.textContent = '+ Add more';
  addRowBtn.setAttribute('data-group-idx', groupIdx);
  section.appendChild(addRowBtn);

  return section;
}

function render() {
  muscleGroupsContainer.innerHTML = '';
  state.groups.forEach((g, groupIdx) => {
    const groupSection = createMuscleGroupSection(groupIdx, g.group, g.entries);
    muscleGroupsContainer.appendChild(groupSection);
  });
  saveState();
}

function updateVolumeDisplay(groupIdx, rowIdx) {
  const volumeCell = document.querySelector(`[data-group-idx="${groupIdx}"][data-row-idx="${rowIdx}"].total-volume-cell`);
  if (volumeCell) {
    const entry = state.groups[groupIdx].entries[rowIdx];
    const totalVolume = calculateTotalVolume(entry.sets);
    volumeCell.textContent = totalVolume > 0 ? totalVolume.toFixed(2) : '-';
  }
}

muscleGroupsContainer.addEventListener('click', function(e) {
  if (e.target.classList.contains('remove-group-btn')) {
    const idx = +e.target.getAttribute('data-group-idx');
    state.groups.splice(idx,1);
    render();
  }
  else if (e.target.classList.contains('delete-row-btn')) {
    const gi = +e.target.getAttribute('data-group-idx');
    const ri = +e.target.getAttribute('data-row-idx');
    state.groups[gi].entries.splice(ri,1);
    render();
  }
  else if (e.target.classList.contains('add-row-btn')) {
    const idx = +e.target.getAttribute('data-group-idx');
    const groupName = state.groups[idx].group;
    state.groups[idx].entries.push({
      date: todayDate(),
      exercise: GROUPS[groupName][0],
      sets: [{},{},{},{}]
    });
    render();
  }
});

muscleGroupsContainer.addEventListener('change', function(e) {
  if (e.target.tagName === 'SELECT' && !e.target.classList.contains('exercise-dropdown')) {
    const idx = +e.target.getAttribute('data-group-idx');
    const newGroup = e.target.value;
    state.groups[idx].group = newGroup;
    state.groups[idx].entries.forEach(entry => {
      if (!GROUPS[newGroup].includes(entry.exercise)) entry.exercise = GROUPS[newGroup][0];
    });
    render();
  }
  else if (e.target.classList.contains('exercise-dropdown')) {
    const gi = +e.target.getAttribute('data-group-idx');
    const ri = +e.target.getAttribute('data-row-idx');
    state.groups[gi].entries[ri].exercise = e.target.value;
    saveState();
  }
  else if (e.target.classList.contains('date-field')) {
    const gi = +e.target.getAttribute('data-group-idx');
    const ri = +e.target.getAttribute('data-row-idx');
    state.groups[gi].entries[ri].date = e.target.value;
    saveState();
  }
  else if (e.target.classList.contains('reps-field')) {
    const gi = +e.target.getAttribute('data-group-idx');
    const ri = +e.target.getAttribute('data-row-idx');
    const si = +e.target.getAttribute('data-set');
    state.groups[gi].entries[ri].sets[si] = state.groups[gi].entries[ri].sets[si] || {};
    state.groups[gi].entries[ri].sets[si].reps = e.target.value;
    updateVolumeDisplay(gi, ri);
    saveState();
  }
  else if (e.target.classList.contains('wt-field')) {
    const gi = +e.target.getAttribute('data-group-idx');
    const ri = +e.target.getAttribute('data-row-idx');
    const si = +e.target.getAttribute('data-set');
    state.groups[gi].entries[ri].sets[si] = state.groups[gi].entries[ri].sets[si] || {};
    state.groups[gi].entries[ri].sets[si].wt = e.target.value;
    updateVolumeDisplay(gi, ri);
    saveState();
  }
});

addMuscleGroupButton.addEventListener('click', function() {
  state.groups.push({
    group: 'Chest',
    entries: [
      {
        date: todayDate(),
        exercise: GROUPS['Chest'][0],
        sets: [{},{},{},{}]
      }
    ]
  });
  render();
});

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    loadState();
    render();
  });
} else {
  loadState();
  render();
}
