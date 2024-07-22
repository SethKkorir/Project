const menuIcon = document.getElementById("menuicn");
const nav = document.querySelector(".nav");

menuIcon.addEventListener("click", () => {
    nav.classList.toggle("nav-active");
});
// WebSocket connection
const socket = new WebSocket('ws://localhost:3000');

// Event listener for WebSocket connection open
socket.addEventListener('open', () => {
    console.log('Connected to WebSocket server.');
});

// Event listener for incoming messages
socket.addEventListener('message', (event) => {
    const newUser = JSON.parse(event.data);
    const itemsContainer = document.querySelector('.items');

    const userItem = document.createElement('div');
    userItem.classList.add('item1');
    userItem.innerHTML = `
        <h3 class="t-op-nextlvl">${newUser.name}</h3>
        <h3 class="t-op-nextlvl">${newUser.email}</h3>
        <h3 class="t-op-nextlvl">${newUser.company || 'N/A'}</h3>
        <h3 class="t-op-nextlvl">${newUser.whoAreYouVisiting}</h3>
        <h3 class="t-op-nextlvl">${newUser.purposeOfVisiting}</h3>
    `;
    itemsContainer.appendChild(userItem);
});


document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch user data from the API
        const response = await fetch('http://localhost:8002/api/users'); // Adjust the URL if necessary
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const users = await response.json();

        const itemsContainer = document.querySelector('.items'); // Target the items div in the All Visitors section

        // Clear any existing items
        itemsContainer.innerHTML = '';

        // Populate the items with user data
        users.forEach(user => {
            const userItem = document.createElement('div');
            userItem.classList.add('item1'); 
            userItem.innerHTML = `
                <h3 class="t-op-nextlvl">${user.name}</h3>
                <h3 class="t-op-nextlvl">${user.email}</h3>
                <h3 class="t-op-nextlvl">${user.company || 'N/A'}</h3>
                <h3 class="t-op-nextlvl">${user.whoAreYouVisiting}</h3>
                <h3 class="t-op-nextlvl">${user.purposeOfVisiting}</h3>
            `;
            itemsContainer.appendChild(userItem);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        const itemsContainer = document.querySelector('.items');
        itemsContainer.innerHTML = '<p>Error loading user data. Please try again later.</p>';
    }
});