// --- GAME STATE ---
let day = 1;
let miles = 0;
let food = 100;
let health = 100;
const GOAL = 500;
let currentWeather = "Sunny";

// --- DOM ELEMENTS ---
const logEl = document.getElementById('game-log');
const dayEl = document.getElementById('day');
const milesEl = document.getElementById('miles');
const foodEl = document.getElementById('food');
const healthEl = document.getElementById('health');

// --- SCENARIOS ---
const scenarios = [
    {
        id: 1,
        text: "You found a stray dog on the Kangle Trail. It stole a steak.",
        weight: 3,
        effect: () => { 
            food -= 15; 
            log("Result: -15 Food");
        }
    },
    {
        id: 2,
        text: "You found an abandoned campsite with beans!",
        weight: 2,
        effect: () => { 
            food += 20; 
            log("Result: +20 Food");
        }
    },
    {
        id: 3,
        text: "Bandits ambushed you!",
        weight: 2,
        effect: () => { 
            health -= 20; 
            log("Result: -20 Health. Ouch.");
        }
    },
    {
        id: 4,
        text: "A kind stranger gave you medicine.",
        weight: 2,
        effect: () => { 
            health += 15; 
            log("Result: +15 Health");
        }
    },
    {
        id: 5,
        text: "Your wagon wheel broke. You lost days fixing it.",
        weight: 3,
        effect: () => { 
            day += 3; 
            food -= 15;
            log("Result: +3 Days, -15 Food");
        }
    },
    {
        id: 6,
        text: "Heavy rains flooded the path.",
        weight: 2,
        effect: () => { 
            food -= 10;
            log("Result: -10 Food (Spoiled)");
        }
    }
];

// --- FUNCTIONS ---

function log(message) {
    logEl.innerHTML += `<p>> Day ${day}: ${message}</p>`;
    logEl.scrollTop = logEl.scrollHeight;
}

function updateStats() {
    if (health > 100) health = 100;
    if (food < 0) food = 0;
    
    dayEl.innerText = day;
    milesEl.innerText = Math.floor(miles);
    foodEl.innerText = Math.floor(food);
    healthEl.innerText = health;
}

function checkGameOver() {
    if (health <= 0) {
        log("GAME OVER. You perished on the Kangle Trail.");
        disableButtons();
    } else if (food <= 0) {
        log("GAME OVER. You ran out of food.");
        disableButtons();
    } else if (miles >= GOAL) {
        log("YOU WIN! You conquered the Kangle Trail!");
        disableButtons();
    }
}

function disableButtons() {
    document.getElementById('travel-btn').disabled = true;
    document.getElementById('rest-btn').disabled = true;
    document.getElementById('hunt-btn').disabled = true;
}

function getRandomEvent() {
    if (Math.random() < 0.4) return null; // 40% chance of no event

    const totalWeight = scenarios.reduce((acc, item) => acc + item.weight, 0);
    let randomNum = Math.random() * totalWeight;
    
    for (const scenario of scenarios) {
        if (randomNum < scenario.weight) {
            return scenario;
        }
        randomNum -= scenario.weight;
    }
}

// --- ACTIONS ---

function travel() {
    day++;
    let baseMiles = 20;
    
    // Weather System
    if (Math.random() < 0.3) {
        const weathers = ["Sunny", "Rainy", "Foggy"];
        currentWeather = weathers[Math.floor(Math.random() * weathers.length)];
    }
    
    if (currentWeather === "Rainy") baseMiles -= 5;
    if (currentWeather === "Sunny") baseMiles += 5;

    const actualMiles = baseMiles + (Math.floor(Math.random() * 10) - 5);
    miles += actualMiles;
    food -= 10;
    
    const event = getRandomEvent();
    if (event) {
        log(event.text);
        event.effect();
    } else {
        log(`Travelled ${actualMiles} miles (${currentWeather}).`);
    }

    updateStats();
    checkGameOver();
}

function rest() {
    day++;
    health += 15;
    food -= 5;
    log("You rested. Health restored.");
    updateStats();
    checkGameOver();
}

function hunt() {
    day++;
    let successChance = health / 150; // Harder to hunt if sick
    
    if (Math.random() < successChance + 0.2) {
        const foodFound = Math.floor(Math.random() * 30) + 10;
        food += foodFound;
        log(`Hunt successful! +${foodFound} food.`);
    } else {
        log("Hunt failed. You found nothing.");
    }
    health -= 5;
    updateStats();
    checkGameOver();
}

// --- EVENT LISTENERS (This fixes the buttons!) ---

document.getElementById('travel-btn').addEventListener('click', travel);
document.getElementById('rest-btn').addEventListener('click', rest);
document.getElementById('hunt-btn').addEventListener('click', hunt);

// Init Game
updateStats();
log("Welcome to the Kangle Trail. Reaching 500 miles wins.");