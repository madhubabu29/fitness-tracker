// Update script.js: Adding Total Volume calculation

// Assuming 'data' is the array of exercise sets in your application

// Function to calculate total volume for each set
function calculateTotalVolume(sets) {
    return sets.map(set => { 
        let totalVolume = 0;
        // Loop through each set, calculating volume
        for (let i = 1; i <= 4; i++) {
            totalVolume += set[`Set${i} Reps`] * set[`Set${i} Wt`];
        }
        return totalVolume;
    });
}

// Assuming you're rendering the table in the following way
function renderTable(data) {
    const table = document.getElementById('fitness-table');
    let headerRow = `<tr><th>Exercise</th><th>Set1 Reps</th><th>Set1 Wt</th><th>Set2 Reps</th><th>Set2 Wt</th><th>Set3 Reps</th><th>Set3 Wt</th><th>Set4 Reps</th><th>Set4 Wt</th><th>Total Volume</th><th>Delete</th></tr>`;
    table.innerHTML = headerRow;

    data.forEach(set => {
        const totalVolume = calculateTotalVolume([set])[0];

        let row = `<tr><td>${set.Exercise}</td><td>${set['Set1 Reps']}</td><td>${set['Set1 Wt']}</td><td>${set['Set2 Reps']}</td><td>${set['Set2 Wt']}</td><td>${set['Set3 Reps']}</td><td>${set['Set3 Wt']}</td><td>${set['Set4 Reps']}</td><td>${set['Set4 Wt']}</td><td>${totalVolume}</td><td><button>Delete</button></td></tr>`;
        table.innerHTML += row;
    });
}
