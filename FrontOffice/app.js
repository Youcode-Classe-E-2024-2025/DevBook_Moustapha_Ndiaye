const API_BASE_URL = 'http://localhost:3000/api/auth';

const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const registerResultDiv = document.getElementById('register-result');
const loginResultDiv = document.getElementById('login-result');

async function postApiData(endpoint, data) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`Sending POST request to: ${url}`);
    console.log('Data being sent:', data);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const responseData = await response.json();
        console.log('Raw server response:', response.status, responseData);
        if (!response.ok) {
            const errorMessage = responseData.message || `HTTP error ${response.status}`;
            const error = new Error(errorMessage);
            error.status = response.status;
            error.data = responseData;
            throw error;
        }
        return responseData;
    } catch (error) {
        console.error(`Error during API call to ${url}:`, error);
        if (!error.message) {
            error.message = "Could not contact the server. Check connection or API URL.";
        }
        throw error;
    }
}

function displayResultMessage(divElement, message, type) {
    if (!divElement) return;
    divElement.textContent = message;
    divElement.className = `result-display ${type}`;
}

if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(registerForm);
        const userData = Object.fromEntries(formData.entries());
        displayResultMessage(registerResultDiv, 'Registering...', 'info');
        try {
            const result = await postApiData('/register', userData);
            console.log('Registration successful:', result);
            const successMessage = result.message || 'Registration successful!';
            displayResultMessage(registerResultDiv, `${successMessage} Welcome ${result.user?.name || ''}!`, 'success');
            registerForm.reset();
        } catch (error) {
            console.error('Registration failed:', error);
            displayResultMessage(registerResultDiv, `Registration Error: ${error.message}`, 'error');
        }
    });
} else {
    console.warn("Registration form (id='register-form') not found.");
}

if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(loginForm);
        const credentials = Object.fromEntries(formData.entries());
        loginResultDiv.textContent = '';
        loginResultDiv.className = 'result-display';

        try {
            const result = await postApiData('/login', credentials);
            console.log('Login successful:', result);

            if (result.token) {
                localStorage.setItem('authToken', result.token);
                console.log('JWT token stored in localStorage.');
            } else {
                console.warn('No JWT token received in the login response.');
                displayResultMessage(loginResultDiv, 'Login Error: Authentication token missing.', 'error');
                return;
            }

            const userRole = result.user?.role;
            console.log('User role:', userRole);

            const adminDashboardUrl = '/admin-dashboard.html'; 
            const memberProfileUrl = '/profile.html';       
            const defaultDashboardUrl = '/dashboard.html';   

            if (userRole === 'admin') {
                console.log('Redirecting admin to:', adminDashboardUrl);
                window.location.href = adminDashboardUrl;
            } else if (userRole === 'member') { 
                console.log('Redirecting member to:', memberProfileUrl);
                window.location.href = memberProfileUrl;
            }
            else {
                console.log(`Unknown or default role ('${userRole}'). Redirecting to:`, defaultDashboardUrl);
                window.location.href = defaultDashboardUrl;
            }

        } catch (error) {
            console.error('Login failed:', error);
            const prefix = (error.status === 401 || error.message?.includes('Invalid credentials')) ?
                            "Login failed: " :
                            "Login Error: ";
            displayResultMessage(loginResultDiv, prefix + error.message, 'error');
        }
    });
} else {
    console.warn("Login form (id='login-form') not found.");
}