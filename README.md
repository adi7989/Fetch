# User Directory Dashboard

![User Directory Dashboard](https://img.shields.io/badge/Status-Complete-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![HTML](https://img.shields.io/badge/HTML-5-orange)
![CSS](https://img.shields.io/badge/CSS-3-blue)

A modern, interactive dashboard that fetches and displays user data from the JSONPlaceholder API. This project demonstrates the use of the Fetch API, asynchronous JavaScript, and modern web development techniques.

## 📋 Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Error Handling](#error-handling)
- [Responsive Design](#responsive-design)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## ✨ Features

- **Data Fetching**: Asynchronously fetches user data from JSONPlaceholder API
- **Interactive UI**: Modern, responsive interface with animations and transitions
- **Search Functionality**: Filter users by name, email, company, or city
- **Dual View Modes**: Toggle between grid and list views
- **Dark/Light Theme**: Switch between dark and light modes with persistent settings
- **Pagination**: Navigate through user data with an intuitive pagination system
- **User Details**: View detailed user information in a modal with interactive map
- **Statistics Dashboard**: View aggregated statistics about the user data
- **Export Functionality**: Export filtered user data as JSON
- **Responsive Design**: Optimized for all device sizes
- **Error Handling**: Robust error handling with user-friendly notifications
- **Loading States**: Visual feedback during data loading
- **Favorites System**: Mark users as favorites
- **Share Feature**: Share user information via Web Share API or clipboard

## 🎮 Demo

To run the demo:
1. Open `index.html` in any modern web browser
2. The application will automatically fetch and display user data
3. Interact with the various features like search, filtering, and theme toggle

## 🛠️ Technologies Used

- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with CSS variables, flexbox, and grid
- **JavaScript (ES6+)**: Async/await, fetch API, DOM manipulation
- **Leaflet.js**: Interactive maps for user locations
- **Font Awesome**: Icons for enhanced UI
- **LocalStorage API**: Persistent theme settings
- **Web Share API**: Native sharing capabilities (where supported)

## 📥 Installation

No installation required! This is a client-side application that runs directly in the browser.

```bash
# Clone the repository (optional)
git clone https://github.com/yourusername/user-directory.git

# Navigate to the project directory
cd user-directory

# Open in browser
# Simply open index.html in your preferred browser
```

## 🚀 Usage

1. **View Users**: Browse through the user cards or list
2. **Search**: Use the search bar to filter users
3. **Change View**: Toggle between grid and list views using the view buttons
4. **Pagination**: Navigate between pages using the pagination controls
5. **User Details**: Click on a user card to view detailed information
6. **Theme Toggle**: Switch between light and dark modes
7. **Export Data**: Export the current filtered user data as JSON
8. **Reload Data**: Refresh the data from the API
9. **Favorite Users**: Mark users as favorites by clicking the heart icon
10. **Share User Info**: Share user details via the share button

## 📁 Project Structure

```
user-directory/
│
├── index.html          # Main HTML document
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md           # Project documentation
```

## 🔌 API Integration

This project uses the [JSONPlaceholder](https://jsonplaceholder.typicode.com/) API to fetch user data. The main endpoint used is:

```
https://jsonplaceholder.typicode.com/users
```

The application handles:
- Fetching data asynchronously
- Parsing JSON responses
- Error handling for failed requests
- Loading states during data fetching

## ⚠️ Error Handling

The application includes robust error handling:

- Network error detection
- API response validation
- User-friendly error messages
- Ability to retry failed requests
- Graceful degradation when features aren't supported

To test error handling:
1. Disable your internet connection
2. Click the "Reload Data" button
3. Observe the error message and notification

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile phones

The layout automatically adjusts based on screen size, ensuring a consistent user experience across all devices.

## 🔮 Future Enhancements

Potential future improvements:
- User authentication system
- Data editing capabilities
- Advanced filtering options
- Data visualization with charts
- Offline support with Service Workers
- PWA implementation
- Unit and integration tests



---

Created with ❤️ as a demonstration of modern web development techniques.