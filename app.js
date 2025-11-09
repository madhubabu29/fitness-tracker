// Simple static fitness tracker using localStorage
(() => {
  const STORAGE_KEY = 'fitnessData_v1';

  function uid(prefix = ''){ return prefix + Math.random().toString(36).slice(2,9); }

  function nowISO(){ return new Date().toISOString(); }

  function load(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {meta:{version:1,created_at:nowISO()}, workouts:[]};
    }catch(e){ console.error('load error', e); return {meta:{version:1,created_at:nowISO()}, workouts:[]}; }
  }
  function save(state){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

  function seedSample(){
    const state = load();
    const w = {
      id: uid('w_'), name: 'Chest Day', date: '2025-11-09T10:30:00Z', notes: 'Focus on pressing strength', created_at: nowISO(),
      entries: [
        { id: uid('e_'), name: 'Chestpress', muscles: ['Chest'], notes: 'Warm-up then working sets', created_at: nowISO(), sets:[
          {set_index:1,reps:10,weight:60},{set_index:2,reps:10,weight:70},{set_index:3,reps:10,weight:70},{set_index:4,reps:10,weight:70}
        ]}
      ]
    };
    state.workouts.unshift(w);
    save(state);
    render();
    alert('Sample workout seeded.');
  }

  // Render list
  function render(){
    const state = load();
    const container = document.getElementById('workouts');
    container.innerHTML = '';
    if(!state.workouts.length){ container.innerHTML = '<p>No workouts yet. Use Quick Add to add one.</p>'; return }
    state.workouts.forEach(w => {
      const el = document.createElement('div'); el.className='workout';
      el.innerHTML = `<strong>${escapeHtml(w.name || 'Workout')}</strong> <span style="color:#666">${w.date.split('T')[0]}</span>
        <div>${escapeHtml(w.notes||'')}</div>`;
      w.entries.forEach(en => {
        const e = document.createElement('div'); e.className='entry';
        e.innerHTML = `<div><em>${escapeHtml(en.name)}</em> — ${escapeHtml((en.muscles||[]).join(', '))}</div>` +
          `<div>Sets: ${en.sets.map(s=>`[${s.set_index}: ${s.reps} reps ${s.weight?('@'+s.weight):''}]`).join(' ')}</div>`;
        el.appendChild(e);
      });
      container.appendChild(el);
    });
  }

  function escapeHtml(s){ return String(s||'').replace(/[&<>\"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;" })[c]); }

  // Add handler
  function onAdd(evt){
    evt.preventDefault();
    const name = document.getElementById('exercise-name').value.trim();
    if(!name){ alert('Exercise name required'); return }
    const workoutName = document.getElementById('workout-name').value.trim() || 'Workout';
    const dateInput = document.getElementById('workout-date').value;
    const date = dateInput ? new Date(dateInput).toISOString() : new Date().toISOString();
    const muscles = document.getElementById('exercise-muscles').value.split(',').map(s=>s.trim()).filter(Boolean);
    const setsCount = parseInt(document.getElementById('exercise-sets').value||'1',10);
    const reps = parseInt(document.getElementById('exercise-reps').value||'1',10);
    const weightVal = document.getElementById('exercise-weight').value;
    const weight = weightVal ? Number(weightVal) : null;
    const notes = document.getElementById('exercise-notes').value.trim();

    const state = load();
    const workout = {
      id: uid('w_'), name: workoutName, date, notes: '', created_at: nowISO(), entries: []
    };
    const entry = { id: uid('e_'), name, muscles, notes, created_at: nowISO(), sets: [] };
    for(let i=1;i<=setsCount;i++) entry.sets.push({ set_index:i, reps:reps, weight: weight });
    workout.entries.push(entry);
    state.workouts.unshift(workout);
    save(state);
    render();
    document.getElementById('add-form').reset();
  }

  // Export JSON / CSV
  function exportJSON(){ const state=load(); const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); downloadBlob(blob,'fitness-data.json'); }
  function exportCSV(){ const state=load(); let rows=[['date','workout_name','exercise_name','set_index','reps','weight','muscles','notes','created_at']];
    state.workouts.forEach(w=>{ w.entries.forEach(e=>{ e.sets.forEach(s=>{ rows.push([w.date,w.name,e.name,s.set_index,s.reps,s.weight,(e.muscles||[]).join(';'),e.notes,e.created_at]); }) }) });
    const csv = rows.map(r=>r.map(cell=>`"${String(cell||'').replace(/"/g,'""') }"`).join(',')).join('\n');
    const blob=new Blob([csv],{type:'text/csv'}); downloadBlob(blob,'fitness-data.csv');
  }
  function downloadBlob(blob,filename){ const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }

  function importFile(file){ const reader=new FileReader(); reader.onload = ()=>{
      try{
        const text = reader.result;
        if(file.type.includes('json') || file.name.endsWith('.json')){
          const parsed=JSON.parse(text);
          if(parsed.workouts) {
            const state=load(); state.workouts = parsed.workouts.concat(state.workouts); save(state); render(); alert('Imported JSON and merged with existing data');
          } else { alert('JSON missing workouts array'); }
        } else {
          // naive CSV import: not robust, expect our CSV format
          const lines = text.split(/\r?\n/).filter(Boolean);
          const [hdr,...rows] = lines.map(l=>parseCsvLine(l));
          const idx = {date:hdr.indexOf('date'), workout_name:hdr.indexOf('workout_name'), exercise_name:hdr.indexOf('exercise_name'), set_index:hdr.indexOf('set_index'), reps:hdr.indexOf('reps'), weight:hdr.indexOf('weight'), muscles:hdr.indexOf('muscles'), notes:hdr.indexOf('notes'), created_at:hdr.indexOf('created_at')};
          const grouped = {};
          rows.forEach(r=>{
            const date=r[idx.date]; const wname=r[idx.workout_name]; const ename=r[idx.exercise_name];
            const key = wname+'|'+date;
            if(!grouped[key]) grouped[key]={id:uid('w_'), name:wname, date:date, notes:'', created_at:nowISO(), entries:{}};
            const entryKey = ename;
            if(!grouped[key].entries[entryKey]) grouped[key].entries[entryKey]={id:uid('e_'), name:ename, muscles:(r[idx.muscles]||'').split(';').filter(Boolean), notes:r[idx.notes]||'', created_at:nowISO(), sets:[]};
            grouped[key].entries[entryKey].sets.push({ set_index: Number(r[idx.set_index]||0), reps: Number(r[idx.reps]||0), weight: r[idx.weight]? Number(r[idx.weight]):null });
          });
          const state=load(); Object.values(grouped).forEach(g=>{ g.entries = Object.values(g.entries); state.workouts.unshift(g); }); save(state); render(); alert('CSV imported');
        }
      }catch(e){ console.error(e); alert('Import failed: '+e.message); }
  };
  reader.readAsText(file);
  }
  function parseCsvLine(line){ // split naive but handles quoted
    const res=[]; let cur=''; let inq=false;
    for(let i=0;i<line.length;i++){ const ch=line[i]; if(ch==='"'){ inq=!inq; continue } if(ch===',' && !inq){ res.push(cur); cur=''; } else cur+=ch; } res.push(cur); return res.map(s=>s.replace(/^\s*"|"\s*$/g,'')); }

  function clearData(){ if(confirm('Clear local data? This cannot be undone.')){ localStorage.removeItem(STORAGE_KEY); render(); alert('Local data cleared'); } }

  // wire up
  document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('add-form').addEventListener('submit', onAdd);
    document.getElementById('seed-sample').addEventListener('click', seedSample);
    document.getElementById('export-json').addEventListener('click', exportJSON);
    document.getElementById('export-csv').addEventListener('click', exportCSV);
    document.getElementById('import-file').addEventListener('change', (e)=>{ if(e.target.files.length) importFile(e.target.files[0]); e.target.value=''; });
    document.getElementById('clear-data').addEventListener('click', clearData);
    render();

    // register service worker if available
    if('serviceWorker' in navigator){ navigator.serviceWorker.register('service-worker.js').catch(()=>{}); }
  });
})();
