// --- Game Data (simplified for PoC) ---
const foodItems = {
    "roti_canai": { name: "Roti Canai", image: "images/food-roti-canai.jpg" },
    "teh_o_ais": { name: "Teh O Ais", image: "images/food-teh-o-ais.jpg" },
    "nasi_lemak": { name: "Nasi Lemak", image: "images/food-nasi-lemak.jpg" },
    // Add more items here as you expand:
    // "milo_ais": { name: "Milo Ais", image: "images/food_milo_ais.png" },
    // "kopi_o": { name: "Kopi O", image: "images/food_kopi_o.png" },
    // "mee_goreng": { name: "Mee Goreng", image: "images/food_mee_goreng.png" }
};

const customers = [
    {
        id: "upin_parody",
        sprite: "images/customer-upin.jpg",
        orders: [
            // Sample order 1 for PoC
            {
                text: "Roti canai satu, teh O ais satu!",
                items: ["roti_canai", "teh_o_ais"]
            },
            // Sample order 2 for PoC
            {
                text: "Nasi lemak satu, roti canai satu!",
                items: ["nasi_lemak", "roti_canai"]
            }
        ]
    }
    // Add more customer types and their specific orders later
];

// --- DOM Elements ---
const startGameBtn = document.getElementById('start-game-btn');
const customerSprite = document.getElementById('customer-sprite');
const orderSpeechBubble = document.getElementById('order-speech-bubble');
const orderText = document.getElementById('order-text');
const menuArea = document.getElementById('menu-area');
const selectedItemsContainer = document.getElementById('selected-items');
const confirmOrderBtn = document.getElementById('confirm-order-btn');
const gameFeedback = document.getElementById('game-feedback');
const scoreDisplay = document.getElementById('score-display');

// --- Game State Variables ---
let currentCustomerIndex = 0;
let currentOrderIndex = 0;
let currentCustomerOrder = []; // The order the customer just gave
let playerSelectedItems = []; // The items the player has selected
let score = 0;
let gameActive = false;

// --- Game Functions ---

function initializeGame() {
    startGameBtn.classList.add('hidden'); // Hide start button
    customerSprite.classList.remove('hidden');
    orderSpeechBubble.classList.remove('hidden');
    gameFeedback.classList.add('hidden');
    score = 0;
    currentCustomerIndex = 0;
    currentOrderIndex = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    gameActive = true;
    startNewRound();
}

function startNewRound() {
    playerSelectedItems = [];
    selectedItemsContainer.innerHTML = ''; // Clear previous selections
    confirmOrderBtn.disabled = false; // Enable confirm button

    const customer = customers[currentCustomerIndex];
    if (!customer) {
        endGame("All customers served! Well done!");
        return;
    }
    customerSprite.src = customer.sprite;

    const order = customer.orders[currentOrderIndex];
    if (!order) {
        // Move to next customer or end game if all orders for this customer are done
        currentCustomerIndex++;
        currentOrderIndex = 0;
        if (currentCustomerIndex < customers.length) {
            startNewRound(); // Load next customer's first order
        } else {
            endGame("You served everyone in the kampung! Amazing!");
        }
        return;
    }

    currentCustomerOrder = order.items;
    orderText.textContent = order.text;

    // Optional: Add a slight delay for speech bubble to appear after customer sprite
    // setTimeout(() => { orderSpeechBubble.classList.remove('hidden'); }, 300);
}

function handleMenuItemClick(event) {
    if (!gameActive) return;

    const itemDiv = event.currentTarget;
    const itemId = itemDiv.dataset.item;

    if (playerSelectedItems.length < 3) { // Limit items for PoC simplicity
        playerSelectedItems.push(itemId);
        displaySelectedItem(itemId);
    } else {
        showFeedback("Order slip full! Confirm or clear.", "orange");
    }
}

function displaySelectedItem(itemId) {
    const img = document.createElement('img');
    img.src = foodItems[itemId].image;
    img.alt = foodItems[itemId].name;
    img.classList.add('selected-item-display');
    selectedItemsContainer.appendChild(img);
}

function confirmOrder() {
    if (!gameActive || playerSelectedItems.length === 0) return;

    confirmOrderBtn.disabled = true; // Prevent double-clicking

    const isCorrect = checkOrder();

    if (isCorrect) {
        score++;
        showFeedback("Betul! Order delivered!", "green");
        scoreDisplay.textContent = `Score: ${score}`;
        currentOrderIndex++; // Move to next order for this customer
    } else {
        showFeedback("Salah! That's not what they ordered...", "red");
        // Optionally, reset score or end game here for difficulty
    }

    // Give a moment for feedback, then proceed
    setTimeout(() => {
        startNewRound();
    }, 1500); // 1.5 seconds feedback
}

function checkOrder() {
    // Simple check: same length and same items in the same order
    if (playerSelectedItems.length !== currentCustomerOrder.length) {
        return false;
    }
    for (let i = 0; i < currentCustomerOrder.length; i++) {
        if (playerSelectedItems[i] !== currentCustomerOrder[i]) {
            return false;
        }
    }
    return true;
}

function showFeedback(message, color) {
    gameFeedback.textContent = message;
    gameFeedback.style.backgroundColor = color; // Use color as background
    gameFeedback.classList.remove('hidden');
    // Hide after a short delay
    setTimeout(() => {
        gameFeedback.classList.add('hidden');
    }, 1200);
}

function endGame(message) {
    gameActive = false;
    orderSpeechBubble.classList.add('hidden');
    customerSprite.classList.add('hidden');
    showFeedback(message + ` Final Score: ${score}`, "blue");
    startGameBtn.textContent = "Play Again";
    startGameBtn.classList.remove('hidden');
}


// --- Event Listeners ---
startGameBtn.addEventListener('click', initializeGame);
confirmOrderBtn.addEventListener('click', confirmOrder);

// Attach event listeners to menu items dynamically
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', handleMenuItemClick);
});

// Initial state
document.addEventListener('DOMContentLoaded', () => {
    customerSprite.classList.add('hidden'); // Hide customer on load
    orderSpeechBubble.classList.add('hidden'); // Hide bubble on load
    gameFeedback.classList.add('hidden'); // Hide feedback on load
});