// DOM elements
const userContainer = document.getElementById('user-container');
const errorMessage = document.getElementById('error-message');
const loadingIndicator = document.getElementById('loading');
const reloadButton = document.getElementById('reload-btn');

// Function to fetch users from the API
async function fetchUsers() {
    // Show loading indicator
    loadingIndicator.style.display = 'block';
    // Hide any previous error messages
    errorMessage.style.display = 'none';
    // Clear previous user data
    userContainer.innerHTML = '';
    
    try {
        // Fetch data from the API
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Parse the JSON response
        const users = await response.json();
        
        // Display the users
        displayUsers(users);
    } catch (error) {
        // Handle any errors
        console.error('Error fetching users:', error);
        errorMessage.textContent = `Failed to load users: ${error.message}`;
        errorMessage.style.display = 'block';
    } finally {
        // Hide loading indicator
        loadingIndicator.style.display = 'none';
    }
}

// Function to display users on the page
function displayUsers(users) {
    // Loop through each user and create a card for them
    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        
        // Format the address
        const address = `${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`;
        
        // Create the HTML for the user card
        userCard.innerHTML = `
            <h2>${user.name}</h2>
            <p><span class="label">Username:</span> ${user.username}</p>
            <p><span class="label">Email:</span> ${user.email}</p>
            <p><span class="label">Phone:</span> ${user.phone}</p>
            <p><span class="label">Website:</span> ${user.website}</p>
            <p><span class="label">Address:</span> ${address}</p>
            <p><span class="label">Company:</span> ${user.company.name}</p>
        `;
        
        // Add the card to the container
        userContainer.appendChild(userCard);
    });
}

// Event listener for reload button
reloadButton.addEventListener('click', fetchUsers);

// Fetch users when the page loads
document.addEventListener('DOMContentLoaded', fetchUsers);