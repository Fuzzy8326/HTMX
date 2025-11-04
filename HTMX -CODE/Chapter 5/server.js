import express from 'express';
const app = express();

// ------------------------
// Middleware
// ------------------------

// Serve static files (like CSS, JS, images) from the 'public' folder
app.use(express.static('public'));

// Parse URL-encoded bodies (as submitted by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients or JS fetch requests)
app.use(express.json());

// ------------------------
// Validation Functions
// ------------------------

// Validate email format and length
function isValidEmail(email) {
    // Ensure email exists and is a string
    if (!email || typeof email !== 'string') {
        return false;
    }
    
    // Simple but robust regex for standard email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Trim whitespace from input
    const trimmedEmail = email.trim();
    
    // Validate format and length (max 254 characters per RFC)
    return emailRegex.test(trimmedEmail) && trimmedEmail.length <= 254;
}

// Validate password length and type
function isValidPassword(password) {
    // Ensure password exists and is a string
    if (!password || typeof password !== 'string') {
        return false;
    }
    
    // Password must be at least 6 characters and not excessively long
    return password.length >= 6 && password.length <= 128;
}

// ------------------------
// Handle Form Submission
// ------------------------
app.post('/submit', (req, res) => {
    const { email, password } = req.body; // Extract form data

    // ------------------------
    // Email Validation
    // ------------------------
    if (!isValidEmail(email)) {
        return res.send(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                Please enter a valid email address.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);
    }

    // ------------------------
    // Password Validation
    // ------------------------
    if (!isValidPassword(password)) {
        return res.send(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                Password must be at least 6 characters long.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);
    }

    // ------------------------
    // Success Response
    // ------------------------
    return res.send(`
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            Both email and password are valid!
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `);
});

// ------------------------
// Start Server
// ------------------------
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
