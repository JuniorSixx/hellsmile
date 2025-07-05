// Check if user is logged in
export function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Check if user is admin
export function isAdmin() {
    return localStorage.getItem('userRole') === 'admin';
}

// Logout function
export function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    window.location.href = '/src/login.html';
}

// Protect route
export function protectRoute() {
    if (!isLoggedIn()) {
        window.location.href = '/src/login.html';
    }
}
