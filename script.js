// script.js

// Define muscle groups and their corresponding exercises
const muscleGroups = {
    chest: ['Bench Press', 'Push Up', 'Chest Fly'],
    back: ['Pull Up', 'Bent Over Row', 'Deadlift'],
    legs: ['Squat', 'Leg Press', 'Lunge'],
    shoulders: ['Shoulder Press', 'Lateral Raise', 'Front Raise'],
    arms: ['Bicep Curl', 'Tricep Extension', 'Hammer Curl'],
};

// Function to calculate total volume
function calculateTotalVolume(exercises) {
    let totalVolume = 0;
    exercises.forEach(exercise => {
        totalVolume += exercise.reps * exercise.weight;
    });
    return totalVolume;
}

// Event handler for form submission
document.getElementById('exercise-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission
    const exerciseName = document.getElementById('exercise-name').value;
    const reps = parseInt(document.getElementById('reps').value);
    const weight = parseFloat(document.getElementById('weight').value);

    // Add exercise to the log
    const exerciseLog = document.getElementById('exercise-log');
    exerciseLog.innerHTML += `<li>${exerciseName}: ${reps} reps at ${weight} kg</li>`;

    // Calculate and display total volume
    const totalVolume = calculateTotalVolume([{ reps, weight }]);
    document.getElementById('total-volume').innerText = `Total Volume: ${totalVolume} kg`; 
});

// Populate muscle groups into select dropdown
const muscleGroupSelect = document.getElementById('muscle-group');
Object.keys(muscleGroups).forEach(group => {
    const option = document.createElement('option');
    option.value = group;
    option.textContent = group.charAt(0).toUpperCase() + group.slice(1);
    muscleGroupSelect.appendChild(option);
});

// HTML Elements that need to be updated
const exerciseLog = document.createElement('ul');
exerciseLog.setAttribute('id', 'exercise-log');
const volumeDisplay = document.createElement('div');
volumeDisplay.setAttribute('id', 'total-volume');

// Append the new elements to the body or a container
document.body.appendChild(exerciseLog);
document.body.appendChild(volumeDisplay);