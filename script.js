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
    'Hack Squat',
    'Bulgarian Split Squat',
    'Step-up',
    'Smith Machine Squat',
    'Sissy Squat'
  ],
  'Legs Posterior': [
    'Hip Thrust',
    'Squat',
    'Romanian Deadlift',
    'Leg Press',
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

let state = {
  week1: { groups: [] },
  week2: { groups: [] },
  week3: { groups: [] }
};

let currentWeek = 'week1';
let weekCount = 3;

function saveState() {
  localStorage.setItem('workout-log', JSON.stringify(state));
}

function loadState() {
  const s = localStorage.getItem('workout-log');
  if (s) {
    state = JSON.parse(s);
    // Calculate weekCount from existing weeks
    weekCount = Object.keys(state).filter(key => key.startsWith('week')).length;
  } else {
    state = { week1: { groups: [] }, week2: { groups: [] }, week3: { groups: [] } };
    weekCount = 3;
  }
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
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

function createMuscleGroupSection(week, groupIdx, groupName, entries) {
  const section = document.createElement('div');
  section.className = 'muscle-group-section';

  const headerDiv = document.createElement('div');
  headerDiv.className = 'muscle-group-header';
  headerDiv.innerHTML = `<strong>Muscle Group:</strong>
    <select data-week="${week}" data-group-idx="${groupIdx}">
      ${Object.keys(GROUPS).map(mg =>
        `<option value="${mg}"${mg === groupName ? ' selected' : ''}>${mg}</option>`
      ).join('')}
    </select>
    <button class="remove-group-btn" data-week="${week}" data-group-idx="${groupIdx}">Remove Group</button>`;
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
    tdDate.setAttribute('data-label', 'Date');
    tdDate.innerHTML = `<input type="date" value="${ent.date}" data-week="${week}" data-group-idx="${groupIdx}" data-row-idx="${rowIdx}" class="date-field" />`;
    tr.appendChild(tdDate);

    const tdEx = document.createElement('td');
    tdEx.setAttribute('data-label', 'Exercise');
    tdEx.innerHTML = `<select data-week="${week}" data-group-idx="${groupIdx}" data-row-idx="${rowIdx}" class="exercise-dropdown">
      ${GROUPS[groupName].map(ex =>
        `<option value="${ex}"${ex === ent.exercise ? ' selected' : ''}>${ex}</option>`
      ).join('')}
    </select>`;
    tr.appendChild(tdEx);

    for (let i = 0; i < 4; i++) {
      const reps = ent.sets[i]?.reps ?? '';
      const wt = ent.sets[i]?.wt ?? '';
      
      const tdReps = document.createElement('td');
      tdReps.setAttribute('data-label', `S${i+1} Reps`);
      tdReps.innerHTML = `<input type="number" min="0" placeholder="Reps" value="${reps}" data-set="${i}" data-week="${week}" data-group-idx="${groupIdx}" data-row-idx="${rowIdx}" class="reps-field" />`;
      tr.appendChild(tdReps);

      const tdWt = document.createElement('td');
      tdWt.setAttribute('data-label', `S${i+1} Wt`);
      tdWt.innerHTML = `<input type="text" placeholder="Wt" value="${wt}" data-set="${i}" data-week="${week}" data-group-idx="${groupIdx}" data-row-idx="${rowIdx}" class="wt-field" />`;
      tr.appendChild(tdWt);
    }

    const totalVolume = calculateTotalVolume(ent.sets);
    const tdVolume = document.createElement('td');
    tdVolume.className = 'total-volume-cell';
    tdVolume.textContent = totalVolume > 0 ? totalVolume.toFixed(2) : '-';
    tdVolume.setAttribute('data-week', week);
    tdVolume.setAttribute('data-group-idx', groupIdx);
    tdVolume.setAttribute('data-row-idx', rowIdx);
    tr.appendChild(tdVolume);

    const tdDel = document.createElement('td');
    tdDel.setAttribute('data-label', 'Delete');
    tdDel.innerHTML = `<button class="delete-row-btn" data-week="${week}" data-group-idx="${groupIdx}" data-row-idx="${rowIdx}">X</button>`;
    tr.appendChild(tdDel);

    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  section.appendChild(table);

  const addRowBtn = document.createElement('button');
  addRowBtn.className = 'add-row-btn';
  addRowBtn.textContent = '+ Add more';
  addRowBtn.setAttribute('data-week', week);
  addRowBtn.setAttribute('data-group-idx', groupIdx);
  section.appendChild(addRowBtn);

  return section;
}

function renderTabs() {
  const tabsContainer = document.getElementById('tabs-container');
  tabsContainer.innerHTML = '';
  
  for (let i = 1; i <= weekCount; i++) {
    const weekKey = `week${i}`;
    const btn = document.createElement('button');
    btn.className = 'tab-btn' + (weekKey === currentWeek ? ' active' : '');
    btn.textContent = `Week ${i}`;
    btn.setAttribute('data-week', weekKey);
    tabsContainer.appendChild(btn);
  }
}

function renderContent() {
  const tabsContent = document.getElementById('tabs-content');
  tabsContent.innerHTML = '';
  
  for (let i = 1; i <= weekCount; i++) {
    const weekKey = `week${i}`;
    const div = document.createElement('div');
    div.id = weekKey;
    div.className = 'tab-content' + (weekKey === currentWeek ? ' active' : '');
    
    const btn = document.createElement('button');
    btn.id = `add-muscle-group-${weekKey}`;
    btn.textContent = '+ Add Muscle Group';
    div.appendChild(btn);
    
    const muscleGroupsDiv = document.createElement('div');
    muscleGroupsDiv.id = `muscle-groups-${weekKey}`;
    muscleGroupsDiv.className = 'muscle-groups';
    div.appendChild(muscleGroupsDiv);
    
    tabsContent.appendChild(div);
  }
}

function render() {
  renderTabs();
  renderContent();
  
  // Render muscle groups for each week
  for (let i = 1; i <= weekCount; i++) {
    const weekKey = `week${i}`;
    const container = document.getElementById(`muscle-groups-${weekKey}`);
    if (container && state[weekKey]) {
      container.innerHTML = '';
      state[weekKey].groups.forEach((g, groupIdx) => {
        const groupSection = createMuscleGroupSection(weekKey, groupIdx, g.group, g.entries);
        container.appendChild(groupSection);
      });
    }
  }
  
  saveState();
}

function updateVolumeDisplay(week, groupIdx, rowIdx) {
  const volumeCell = document.querySelector(`[data-week="${week}"][data-group-idx="${groupIdx}"][data-row-idx="${rowIdx}"].total-volume-cell`);
  if (volumeCell) {
    const entry = state[week].groups[groupIdx].entries[rowIdx];
    const totalVolume = calculateTotalVolume(entry.sets);
    volumeCell.textContent = totalVolume > 0 ? totalVolume.toFixed(2) : '-';
  }
}

// Event delegation for all weeks
document.addEventListener('click', function(e) {
  const week = e.target.getAttribute('data-week');
  
  // Add new week
  if (e.target.id === 'add-week-btn') {
    weekCount++;
    const newWeekKey = `week${weekCount}`;
    state[newWeekKey] = { groups: [] };
    currentWeek = newWeekKey;
    render();
    return;
  }
  
  // Tab navigation
  if (e.target.classList.contains('tab-btn')) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    e.target.classList.add('active');
    const weekKey = e.target.getAttribute('data-week');
    const contentDiv = document.getElementById(weekKey);
    if (contentDiv) contentDiv.classList.add('active');
    currentWeek = weekKey;
    return;
  }

  // Remove group
  if (e.target.classList.contains('remove-group-btn') && week) {
    const idx = +e.target.getAttribute('data-group-idx');
    state[week].groups.splice(idx, 1);
    render();
    return;
  }

  // Delete row
  if (e.target.classList.contains('delete-row-btn') && week) {
    const gi = +e.target.getAttribute('data-group-idx');
    const ri = +e.target.getAttribute('data-row-idx');
    state[week].groups[gi].entries.splice(ri, 1);
    render();
    return;
  }

  // Add row
  if (e.target.classList.contains('add-row-btn') && week) {
    const idx = +e.target.getAttribute('data-group-idx');
    const groupName = state[week].groups[idx].group;
    state[week].groups[idx].entries.push({
      date: todayDate(),
      exercise: GROUPS[groupName][0],
      sets: [{}, {}, {}, {}]
    });
    render();
    return;
  }

  // Add muscle group button
  if (e.target.id && e.target.id.startsWith('add-muscle-group-')) {
    const week = e.target.id.replace('add-muscle-group-', '');
    state[week].groups.push({
      group: 'Chest',
      entries: [
        {
          date: todayDate(),
          exercise: GROUPS['Chest'][0],
          sets: [{}, {}, {}, {}]
        }
      ]
    });
    render();
    return;
  }
});

// Change event delegation
document.addEventListener('change', function(e) {
  const week = e.target.getAttribute('data-week');
  
  if (!week) return;

  // Muscle group changed
  if (e.target.tagName === 'SELECT' && !e.target.classList.contains('exercise-dropdown')) {
    const idx = +e.target.getAttribute('data-group-idx');
    const newGroup = e.target.value;
    state[week].groups[idx].group = newGroup;
    state[week].groups[idx].entries.forEach(entry => {
      if (!GROUPS[newGroup].includes(entry.exercise)) entry.exercise = GROUPS[newGroup][0];
    });
    render();
    return;
  }

  // Exercise changed
  if (e.target.classList.contains('exercise-dropdown')) {
    const gi = +e.target.getAttribute('data-group-idx');
    const ri = +e.target.getAttribute('data-row-idx');
    state[week].groups[gi].entries[ri].exercise = e.target.value;
    saveState();
    return;
  }

  // Date changed
  if (e.target.classList.contains('date-field')) {
    const gi = +e.target.getAttribute('data-group-idx');
    const ri = +e.target.getAttribute('data-row-idx');
    state[week].groups[gi].entries[ri].date = e.target.value;
    saveState();
    return;
  }

  // Reps changed
  if (e.target.classList.contains('reps-field')) {
    const gi = +e.target.getAttribute('data-group-idx');
    const ri = +e.target.getAttribute('data-row-idx');
    const si = +e.target.getAttribute('data-set');
    state[week].groups[gi].entries[ri].sets[si] = state[week].groups[gi].entries[ri].sets[si] || {};
    state[week].groups[gi].entries[ri].sets[si].reps = e.target.value;
    updateVolumeDisplay(week, gi, ri);
    saveState();
    return;
  }

  // Weight changed
  if (e.target.classList.contains('wt-field')) {
    const gi = +e.target.getAttribute('data-group-idx');
    const ri = +e.target.getAttribute('data-row-idx');
    const si = +e.target.getAttribute('data-set');
    state[week].groups[gi].entries[ri].sets[si] = state[week].groups[gi].entries[ri].sets[si] || {};
    state[week].groups[gi].entries[ri].sets[si].wt = e.target.value;
    updateVolumeDisplay(week, gi, ri);
    saveState();
    return;
  }
});

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    loadState();
    render();
  });
} else {
  loadState();
  render();
}
