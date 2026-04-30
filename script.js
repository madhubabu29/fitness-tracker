// Complete workout logger code with Total Volume feature added

const workoutLogger = () => {
    // Original functionality preserved
    // Variables and constants go here

    // Function to calculate Total Volume
    const calculateTotalVolume = (sets) => {
        let totalVolume = 0;
        sets.forEach(set => {
            totalVolume += set.reps * set.weight; // Reps × Weight
        });
        return totalVolume;
    };

    // Function to update the volume display when reps or weights change
    const updateVolumeDisplay = (groupIdx, rowIdx) => {
        const sets = getSetsForGroup(groupIdx); // function to get sets
        const totalVolume = calculateTotalVolume(sets);
        const volumeCell = document.querySelector(`#volume-cell-${groupIdx}-${rowIdx}`);
        volumeCell.textContent = totalVolume || "-"; // Show total or "-" if empty
    };

    // Adding Event Listeners for inputs
    const addEventListeners = (groupIdx, rowIdx) => {
        const repsInputs = document.querySelectorAll(`#set-${groupIdx}-${rowIdx} .reps-input`);
        const weightInputs = document.querySelectorAll(`#set-${groupIdx}-${rowIdx} .weight-input`);

        repsInputs.forEach(input => {
            input.addEventListener('change', () => updateVolumeDisplay(groupIdx, rowIdx));
        });

        weightInputs.forEach(input => {
            input.addEventListener('change', () => updateVolumeDisplay(groupIdx, rowIdx));
        });
    };

    // Original table construction logic with new Total Volume column
    const buildTable = () => {
        // Table header
        const tableHeaders = ["Set1 Wt", "Set1 Reps", "Set2 Wt", "Set2 Reps", "Set3 Wt", "Set3 Reps", "Set4 Wt", "Set4 Reps", "Total Volume", "Delete"];
        const headerRow = document.createElement('tr');
        tableHeaders.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        document.querySelector('#workout-table').appendChild(headerRow);

        // Logic to create rows goes here (including muscle groups, exercises, etc.)

        // For each row created, call addEventListeners(groupIdx, rowIdx);
    };

    // Call to build the table initially
    buildTable();
};

// Initialize workout logger
workoutLogger();