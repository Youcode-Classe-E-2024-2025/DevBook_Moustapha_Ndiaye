// admin-dashboard.js

// --- Configuration ---
// Base URL for the API (adjust if different from auth routes)
const API_BASE_URL = 'http://localhost:3000/api'; // Note: No /auth here

// --- DOM Elements ---
const categoryListDiv = document.getElementById('category-list');
const bookListDiv = document.getElementById('book-list');
const logoutButton = document.getElementById('logout-button');
const contentDiv = document.getElementById('content');

// --- Helper Function to Decode JWT Payload (Basic) ---
// WARNING: This only decodes, it DOES NOT verify the signature.
// Signature verification MUST happen on the backend.
function decodeJwtPayload(token) {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1]; // Get the payload part
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Convert Base64Url to Base64
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error decoding JWT payload:", e);
        return null; // Return null if decoding fails
    }
}

// --- Helper Function for Authenticated Fetch GET Requests ---
async function fetchProtectedData(endpoint) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        throw new Error('Authentication token not found.');
    }

    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`Fetching protected data from: ${url}`);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                // Include the JWT in the Authorization header
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' // Optional for GET, but good practice
            }
        });

        // Check for unauthorized or forbidden status first
        if (response.status === 401 || response.status === 403) {
             console.error('Unauthorized or Forbidden access:', response.status);
             localStorage.removeItem('authToken'); // Token might be invalid/expired
             window.location.href = '/index.html'; // Redirect to login
             throw new Error('Access denied. Redirecting to login.');
        }

        const responseData = await response.json();

        if (!response.ok) {
            const errorMessage = responseData.message || `HTTP error ${response.status}`;
            const error = new Error(errorMessage);
            error.status = response.status;
            error.data = responseData;
            throw error;
        }
        return responseData; // Return the data (e.g., array of categories)

    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        // Don't redirect for general errors, only for auth errors handled above
        throw error; // Re-throw to be handled by the caller
    }
}

// --- Function to Display Categories ---
function displayCategories(categories) {
    if (!categoryListDiv) return;
    categoryListDiv.innerHTML = ''; // Clear loading message or previous list

    if (!Array.isArray(categories) || categories.length === 0) {
        categoryListDiv.innerHTML = '<p>No categories found.</p>';
        return;
    }

    const ul = document.createElement('ul');
    categories.forEach(category => {
        const li = document.createElement('li');
        // Adjust property names based on your Category model (name, category_id, etc.)
        li.textContent = `ID: ${category.category_id} - Name: ${category.name}`;
        // Add buttons for actions later
        ul.appendChild(li);
    });
    categoryListDiv.appendChild(ul);
}

// --- Function to Load Categories ---
async function loadCategories() {
    try {
        // Assuming your backend route is /api/categories
        const categories = await fetchProtectedData('/categories');
        console.log('Categories received:', categories);
        // The actual data might be nested, e.g., categories.data or just categories
        // Adjust if your API wraps the array in an object property
        displayCategories(categories); // Or categories.data if needed
    } catch (error) {
        if (categoryListDiv) {
            categoryListDiv.innerHTML = `<p class="error">Error loading categories: ${error.message}</p>`;
        }
    }
}

// --- Function to Load Books (Example Structure) ---
async function loadBooks() {
     if (!bookListDiv) return;
     bookListDiv.innerHTML = '<p class="loading">Loading books...</p>';
     try {
        // Assuming your backend route is /api/books
        const books = await fetchProtectedData('/books');
        console.log('Books received:', books);
        bookListDiv.innerHTML = ''; // Clear loading

        if (!Array.isArray(books) || books.length === 0) {
            bookListDiv.innerHTML = '<p>No books found.</p>';
            return;
        }

        const ul = document.createElement('ul');
        books.forEach(book => {
            const li = document.createElement('li');
            // Adjust properties: book.book_id, book.title, book.isbn etc.
             li.textContent = `ID: ${book.book_id} - Title: ${book.title} (ISBN: ${book.isbn})`;
             ul.appendChild(li);
        });
        bookListDiv.appendChild(ul);

     } catch (error) {
         bookListDiv.innerHTML = `<p class="error">Error loading books: ${error.message}</p>`;
     }
}


// --- Logout Functionality ---
function logout() {
    localStorage.removeItem('authToken'); // Remove token from storage
    console.log('User logged out.');
    window.location.href = '/index.html'; // Redirect to login page (adjust if needed)
}

// --- Initialization and Access Control ---
function initializeDashboard() {
    console.log('Initializing Admin Dashboard...');
    const token = localStorage.getItem('authToken');

    if (!token) {
        console.log('No token found, redirecting to login.');
        window.location.href = '/index.html'; // Redirect if no token
        return; // Stop execution
    }

    const payload = decodeJwtPayload(token);

    if (!payload || payload.role !== 'admin') { // Check role from decoded token
        console.warn('User is not an admin or token is invalid, redirecting.');
        localStorage.removeItem('authToken'); // Clean up potentially bad token
        // Redirect to a default non-admin page or login
        window.location.href = '/index.html';
        return; // Stop execution
    }

    // If token exists and role is admin, proceed to load data
    console.log('Admin access verified. Loading data...');
    contentDiv.style.display = 'block'; // Show content if hidden by default

    // Add event listener for logout button
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    } else {
        console.warn('Logout button not found.');
    }

    // Load initial data
    loadCategories();
    loadBooks(); // Load books as well

}

// --- Run Initialization when the script loads ---
initializeDashboard();