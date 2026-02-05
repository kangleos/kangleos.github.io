// --- GAME STATE ---
let day = 1;
let miles = 0;
let food = 100;
let health = 100;
const GOAL = 500;
let currentWeather = "Sunny"; // New feature: Weather

// --- DOM ELEMENTS ---
const dayEl = document.getElementById('day');
const milesEl = document.getElementById('miles');
const foodEl = document.getElementById('food');
const healthEl = document.getElementById('health');
const logEl = document.getElementById('game-log');

// --- SCENARIO DATA ---
// A list of possible events. 'weight' is how likely it is to happen (higher = more common).
const scenarios = [
    {
        id: 1,
        text: "A wheel broke on a rocky path. You spent 2 days fixing it.",
        weight: 3,
        effect: () => { 
            day += 2; 
            food -= 10; // You still eat while fixing
        }
    },
    {
        id: 2,
        text: "You found an abandoned wagon with supplies!",
        weight: 2,
        effect: () => { 
            food += 25; 
            log("Use: +25 Food");
        }
    },
    {
        id: 3,
        text: "A pack of wolves attacked at night!",
        weight: 2,
        effect: () => { 
            health -= 15; 
            food -= 10; // They stole some meat!
            log("Result: -15 Health, -10 Food");
        }
    },
    {
        id: 4,
        text: "You met a friendly traveler who shared a meal.",
        weight: 2,
        effect: () => { 
            health += 10; 
            food += 5;
            log("Result: +10 Health, +5 Food");
        }
    },
    {
        id: 5,
        text: "DYSENTERY! It's not pretty...",
        weight: 1, // Rare but deadly
        effect: () => { 
            health -= 30; 
            day += 3; // Takes days to recover
            log("Result: -30 Health, +3 Days lost");
        }
    },
    {
        id: 6,
        text: "Heavy rains flooded the trail. You lost supplies crossing a river.",
        weight: 2,
        effect: () => { 
            food -= 20; 
            log("Result: -20 Food");
        }
    },
    {
        id: 7,
        text: "You found a shortcut through a hidden valley!",
        weight: 1,
        effect: () => { 
            miles += 30; 
            log("Result: +30 Miles extra!");
        }
    }
];

// --- CORE FUNCTIONS ---

function log(message) {
    logEl.innerHTML += `<p>> Day ${day}: ${message}</p>`;
    logEl.scrollTop = logEl.scrollHeight;
}

function updateStats() {
    // Clamp values so they don't go below 0 or crazy high
    if (health > 100) health = 100;
    if (food < 0) food = 0;
    
    dayEl.innerText = day;
    milesEl.innerText = Math.floor(miles); // Remove decimals
    foodEl.innerText = Math.floor(food);
    healthEl.innerText = health;
}

function checkGameOver() {
    if (health <= 0) {
        log("GAME OVER. You have perished.");
        disableButtons();
    } else if (food <= 0) {
        log("GAME OVER. You starved to death.");
        disableButtons();
    } else if (miles >= GOAL) {
        log("YOU WIN! You reached the Oregon Valley!");
        disableButtons();
    }
}

function disableButtons() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);
}

// --- NEW FEATURES ---

function changeWeather() {
    // 30% chance to change weather each day
    if (Math.random() < 0.3) {
        const weathers = ["Sunny", "Rainy", "Stormy", "Foggy"];
        currentWeather = weathers[Math.floor(Math.random() * weathers.length)];
        log(`Weather changed to ${currentWeather}.`);
    }
}

function getRandomEvent() {
    // 40% chance of NO event happening (just a normal travel day)
    if (Math.random() < 0.4) return null;

    // Simple weighted random selection
    // (This ensures rare events like Dysentery happen less often than broken wheels)
    const totalWeight = scenarios.reduce((acc, item) => acc + item.weight, 0);
    let randomNum = Math.random() * totalWeight;
    
    for (const scenario of scenarios) {
        if (randomNum < scenario.weight) {
            return scenario;
        }
        randomNum -= scenario.weight;
    }
}

// --- PLAYER ACTIONS ---

function travel() {
    day++;
    changeWeather();

    let baseMiles = 20;
    
    // Weather affects speed!
    if (currentWeather === "Rainy") baseMiles -= 5;
    if (currentWeather === "Stormy") baseMiles -= 10;
    if (currentWeather === "Sunny") baseMiles += 5;

    // Random variance (±5 miles)
    const actualMiles = baseMiles + (Math.floor(Math.random() * 10) - 5);
    
    miles += actualMiles;
    food -= 10; 
    
    // Check for random event
    const event = getRandomEvent();
    if (event) {
        log(event.text); // Print the story
        event.effect();  // Run the code for that event
    } else {
        log(`Travelled ${actualMiles} miles (${currentWeather}).`);
    }

    updateStats();
    checkGameOver();
}

function rest() {
    day++;
    changeWeather();
    
    health += 15;
    food -= 5;
    
    // Rare chance of ambush while sleeping (10% chance)
    if (Math.random() < 0.1) {
        log("AMBUSH! Bandits stole food while you slept!");
        food -= 15;
    } else {
        log("You rested safely. Health restored.");
    }
    
    updateStats();
    checkGameOver();
}

function hunt() {
    day++;
    changeWeather();
    
    // Hunt success depends on health (harder to hunt if you are sick)
    let successChance = health / 100; 
    
    if (Math.random() < successChance) {
        const foodFound = Math.floor(Math.random() * 40) + 10;
        food += foodFound;
        log(`Great hunt! Caught ${foodFound} lbs of meat.`);
    } else {
        log("The hunt failed. You caught nothing.");
    }
    
    health -= 5; // Hunting is tiring
    updateStats();
    checkGameOver();
}

// Initialize
updateStats();
log("Welcome to the trail. Good luck.");
