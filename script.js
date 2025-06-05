// DOM elements
const userContainer = document.getElementById('user-container');
const userList = document.getElementById('user-list');
const errorMessage = document.getElementById('error-message');
const loadingIndicator = document.getElementById('loading');
const reloadButton = document.getElementById('reload-btn');
const searchInput = document.getElementById('search-input');
const themeToggle = document.getElementById('theme-toggle');
const gridViewBtn = document.getElementById('grid-view-btn');
const listViewBtn = document.getElementById('list-view-btn');
const exportBtn = document.getElementById('export-btn');
const paginationContainer = document.getElementById('pagination');
const userModal = document.getElementById('user-modal');
const modalBody = document.getElementById('modal-body');
const closeModalBtn = document.getElementById('close-modal-btn');
const closeModalX = document.getElementById('close-modal');
const mapContainer = document.getElementById('map-container');

// Stats elements
const totalUsersEl = document.getElementById('total-users');
const companiesCountEl = document.getElementById('companies-count');
const citiesCountEl = document.getElementById('cities-count');
const websitesCountEl = document.getElementById('websites-count');

// Global variables
let allUsers = [];
let filteredUsers = [];
let currentPage = 1;
const usersPerPage = 6;
let currentView = 'grid';
let map = null;

// Function to fetch users from the API
async function fetchUsers() {
    // Show loading indicator
    loadingIndicator.style.display = 'block';
    // Hide any previous error messages
    errorMessage.style.display = 'none';
    // Clear previous user data
    userContainer.innerHTML = '';
    userList.innerHTML = '';
    
    try {
        // Fetch data from the API
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Parse the JSON response
        allUsers = await response.json();
        filteredUsers = [...allUsers];
        
        // Update stats
        updateStats(allUsers);
        
        // Display the users
        displayUsers(filteredUsers);
        
        // Setup pagination
        setupPagination(filteredUsers);
        
        // Show success notification
        showNotification('Data loaded successfully!', 'success');
        
    } catch (error) {
        // Handle any errors
        console.error('Error fetching users:', error);
        errorMessage.textContent = `Failed to load users: ${error.message}`;
        errorMessage.style.display = 'block';
        
        // Show error notification
        showNotification(`Error: ${error.message}`, 'error');
    } finally {
        // Hide loading indicator
        loadingIndicator.style.display = 'none';
    }
}

// Function to update statistics
function updateStats(users) {
    // Count unique companies
    const companies = new Set(users.map(user => user.company.name));
    
    // Count unique cities
    const cities = new Set(users.map(user => user.address.city));
    
    // Count unique websites
    const websites = new Set(users.map(user => user.website));
    
    // Update the stats in the DOM
    totalUsersEl.textContent = users.length;
    companiesCountEl.textContent = companies.size;
    citiesCountEl.textContent = cities.size;
    websitesCountEl.textContent = websites.size;
    
    // Animate the numbers
    animateNumbers();
}

// Function to animate numbers
function animateNumbers() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(el => {
        const finalValue = parseInt(el.textContent);
        let startValue = 0;
        const duration = 1000; // 1 second
        const increment = finalValue / (duration / 20); // Update every 20ms
        
        const timer = setInterval(() => {
            startValue += increment;
            if (startValue >= finalValue) {
                el.textContent = finalValue;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(startValue);
            }
        }, 20);
    });
}

// Function to display users on the page
function displayUsers(users, page = 1) {
    // Clear previous user data
    userContainer.innerHTML = '';
    userList.innerHTML = '';
    
    // Calculate pagination
    const startIndex = (page - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const paginatedUsers = users.slice(startIndex, endIndex);
    
    if (paginatedUsers.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <i class="fas fa-search" style="font-size: 3rem; color: var(--light-text); margin-bottom: 15px;"></i>
            <h3>No users found</h3>
            <p>Try adjusting your search criteria</p>
        `;
        userContainer.appendChild(noResults);
        userList.appendChild(noResults.cloneNode(true));
        return;
    }
    
    // Loop through each user and create a card for them
    paginatedUsers.forEach(user => {
        // Create grid view card
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.dataset.userId = user.id;
        
        // Get initials for avatar
        const initials = getInitials(user.name);
        
        // Format the address
        const address = `${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`;
        
        // Create the HTML for the user card
        userCard.innerHTML = `
            <div class="avatar" style="background-color: ${getRandomColor(user.id)}">${initials}</div>
            <h2>${user.name}</h2>
            <p><i class="fas fa-user"></i> <span class="label">Username:</span> ${user.username}</p>
            <p><i class="fas fa-envelope"></i> <span class="label">Email:</span> ${user.email}</p>
            <p><i class="fas fa-phone"></i> <span class="label">Phone:</span> ${user.phone}</p>
            <p><i class="fas fa-globe"></i> <span class="label">Website:</span> <a href="http://${user.website}" target="_blank">${user.website}</a></p>
            <p><i class="fas fa-building"></i> <span class="label">Company:</span> ${user.company.name}</p>
            <div class="user-actions">
                <button class="action-btn view-details" data-id="${user.id}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn favorite-btn" data-id="${user.id}">
                    <i class="far fa-heart"></i>
                </button>
                <button class="action-btn share-btn" data-id="${user.id}">
                    <i class="fas fa-share-alt"></i>
                </button>
            </div>
        `;
        
        // Add the card to the container
        userContainer.appendChild(userCard);
        
        // Create list view item
        const listItem = document.createElement('div');
        listItem.className = 'user-list-item';
        listItem.dataset.userId = user.id;
        
        listItem.innerHTML = `
            <div class="avatar" style="background-color: ${getRandomColor(user.id)}">${initials}</div>
            <div class="user-info">
                <h3>${user.name}</h3>
                <p>${user.email} | ${user.company.name}</p>
            </div>
            <div class="user-actions">
                <button class="action-btn view-details" data-id="${user.id}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn favorite-btn" data-id="${user.id}">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        `;
        
        // Add the list item to the list container
        userList.appendChild(listItem);
    });
    
    // Add event listeners to the view details buttons
    document.querySelectorAll('.view-details').forEach(btn => {
        btn.addEventListener('click', () => {
            const userId = parseInt(btn.getAttribute('data-id'));
            showUserDetails(userId);
        });
    });
    
    // Add event listeners to the favorite buttons
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const icon = btn.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#fd79a8';
                showNotification('User added to favorites!', 'success');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
                showNotification('User removed from favorites!', 'info');
            }
        });
    });
    
    // Add event listeners to the share buttons
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const userId = parseInt(btn.getAttribute('data-id'));
            const user = allUsers.find(u => u.id === userId);
            
            // Create a shareable text
            const shareText = `Check out ${user.name}'s profile: ${user.email} | ${user.website}`;
            
            // Try to use the Web Share API if available
            if (navigator.share) {
                navigator.share({
                    title: `${user.name}'s Profile`,
                    text: shareText,
                    url: window.location.href
                })
                .then(() => showNotification('Shared successfully!', 'success'))
                .catch(err => showNotification('Error sharing: ' + err, 'error'));
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(shareText)
                    .then(() => showNotification('Copied to clipboard!', 'success'))
                    .catch(err => showNotification('Error copying: ' + err, 'error'));
            }
        });
    });
    
    // Add click event to the entire card/list item to show details
    document.querySelectorAll('.user-card, .user-list-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.action-btn')) {
                const userId = parseInt(item.dataset.userId);
                showUserDetails(userId);
            }
        });
    });
    
    // Update the view based on current selection
    updateView();
}

// Function to show user details in a modal
function showUserDetails(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;
    
    // Format the address
    const address = `${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`;
    
    // Get initials for avatar
    const initials = getInitials(user.name);
    
    // Populate the modal with user details
    modalBody.innerHTML = `
        <div class="user-detail-header">
            <div class="avatar" style="background-color: ${getRandomColor(user.id)}; width: 80px; height: 80px; font-size: 2rem;">${initials}</div>
            <div>
                <h2>${user.name}</h2>
                <p>${user.company.name}</p>
            </div>
        </div>
        <div class="user-detail-content">
            <div class="detail-section">
                <h3><i class="fas fa-user"></i> Personal Information</h3>
                <p><span class="label">Username:</span> ${user.username}</p>
                <p><span class="label">Email:</span> <a href="mailto:${user.email}">${user.email}</a></p>
                <p><span class="label">Phone:</span> <a href="tel:${user.phone}">${user.phone}</a></p>
                <p><span class="label">Website:</span> <a href="http://${user.website}" target="_blank">${user.website}</a></p>
            </div>
            <div class="detail-section">
                <h3><i class="fas fa-map-marker-alt"></i> Address</h3>
                <p><span class="label">Street:</span> ${user.address.street}</p>
                <p><span class="label">Suite:</span> ${user.address.suite}</p>
                <p><span class="label">City:</span> ${user.address.city}</p>
                <p><span class="label">Zipcode:</span> ${user.address.zipcode}</p>
                <p><span class="label">Geo:</span> Lat: ${user.address.geo.lat}, Lng: ${user.address.geo.lng}</p>
            </div>
            <div class="detail-section">
                <h3><i class="fas fa-building"></i> Company</h3>
                <p><span class="label">Name:</span> ${user.company.name}</p>
                <p><span class="label">Catchphrase:</span> "${user.company.catchPhrase}"</p>
                <p><span class="label">BS:</span> ${user.company.bs}</p>
            </div>
        </div>
    `;
    
    // Show the modal
    userModal.classList.add('active');
    
    // Initialize the map
    initMap(user.address.geo.lat, user.address.geo.lng, user.name);
    
    // Prevent scrolling on the body
    document.body.style.overflow = 'hidden';
}

// Function to initialize the map
function initMap(lat, lng, userName) {
    // Convert string coordinates to numbers and handle invalid coordinates
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    
    // Check if coordinates are valid
    if (isNaN(latitude) || isNaN(longitude)) {
        mapContainer.innerHTML = '<p class="error-message">Invalid coordinates</p>';
        return;
    }
    
    // If map already exists, remove it
    if (map) {
        map.remove();
    }
    
    // Initialize the map
    map = L.map(mapContainer).setView([latitude, longitude], 13);
    
    // Add the tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add a marker at the user's location
    L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup(`<b>${userName}</b><br>Location`)
        .openPopup();
}

// Function to close the modal
function closeModal() {
    userModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Function to setup pagination
function setupPagination(users) {
    const totalPages = Math.ceil(users.length / usersPerPage);
    paginationContainer.innerHTML = '';
    
    // Don't show pagination if there's only one page
    if (totalPages <= 1) {
        return;
    }
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayUsers(filteredUsers, currentPage);
            setupPagination(filteredUsers);
        }
    });
    paginationContainer.appendChild(prevBtn);
    
    // Page buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'page-btn';
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            displayUsers(filteredUsers, currentPage);
            setupPagination(filteredUsers);
        });
        paginationContainer.appendChild(pageBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayUsers(filteredUsers, currentPage);
            setupPagination(filteredUsers);
        }
    });
    paginationContainer.appendChild(nextBtn);
}

// Function to filter users based on search input
function filterUsers(searchTerm) {
    if (!searchTerm.trim()) {
        filteredUsers = [...allUsers];
    } else {
        const term = searchTerm.toLowerCase();
        filteredUsers = allUsers.filter(user => 
            user.name.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term) ||
            user.company.name.toLowerCase().includes(term) ||
            user.address.city.toLowerCase().includes(term) ||
            user.username.toLowerCase().includes(term)
        );
    }
    
    currentPage = 1;
    displayUsers(filteredUsers, currentPage);
    setupPagination(filteredUsers);
    
    // Update stats based on filtered users
    updateStats(filteredUsers);
}

// Function to update the view (grid or list)
function updateView() {
    if (currentView === 'grid') {
        userContainer.style.display = 'grid';
        userList.style.display = 'none';
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    } else {
        userContainer.style.display = 'none';
        userList.style.display = 'flex';
        gridViewBtn.classList.remove('active');
        listViewBtn.classList.add('active');
    }
}

// Function to toggle dark/light mode
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// Function to export user data
function exportUserData() {
    const dataStr = JSON.stringify(filteredUsers, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'user-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Data exported successfully!', 'success');
}

// Function to show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on type
    let icon = '';
    switch(type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle"></i>';
            break;
        default:
            icon = '<i class="fas fa-info-circle"></i>';
    }
    
    notification.innerHTML = `
        ${icon}
        <span>${message}</span>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        zIndex: '1000',
        animation: 'fadeIn 0.3s ease',
        maxWidth: '300px'
    });
    
    // Set colors based on type
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#00b894';
            notification.style.color = 'white';
            break;
        case 'error':
            notification.style.backgroundColor = '#d63031';
            notification.style.color = 'white';
            break;
        case 'warning':
            notification.style.backgroundColor = '#fdcb6e';
            notification.style.color = '#2d3436';
            break;
        default:
            notification.style.backgroundColor = '#0984e3';
            notification.style.color = 'white';
    }
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(20px)';
        notification.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Helper function to get initials from name
function getInitials(name) {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

// Helper function to generate a random color based on user ID
function getRandomColor(id) {
    const colors = [
        '#6c5ce7', '#a29bfe', '#fd79a8', '#ffeaa7', '#00cec9', 
        '#55efc4', '#ff7675', '#fab1a0', '#81ecec', '#74b9ff'
    ];
    return colors[id % colors.length];
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Fetch users when the page loads
    fetchUsers();
    
    // Check for saved theme preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
    }
    
    // Event listener for reload button
    reloadButton.addEventListener('click', () => {
        fetchUsers();
    });
    
    // Event listener for search input
    searchInput.addEventListener('input', (e) => {
        filterUsers(e.target.value);
    });
    
    // Event listener for theme toggle
    themeToggle.addEventListener('change', toggleTheme);
    
    // Event listeners for view toggle
    gridViewBtn.addEventListener('click', () => {
        currentView = 'grid';
        updateView();
    });
    
    listViewBtn.addEventListener('click', () => {
        currentView = 'list';
        updateView();
    });
    
    // Event listener for export button
    exportBtn.addEventListener('click', exportUserData);
    
    // Event listeners for modal close
    closeModalBtn.addEventListener('click', closeModal);
    closeModalX.addEventListener('click', closeModal);
    userModal.addEventListener('click', (e) => {
        if (e.target === userModal) {
            closeModal();
        }
    });
    
    // Keyboard event listener for Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && userModal.classList.contains('active')) {
            closeModal();
        }
    });
});