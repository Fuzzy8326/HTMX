import express from 'express';
const app = express();

// Serve static files (like HTML, CSS, JS) from the 'public' directory
app.use(express.static('public'));

// Middleware to parse form data and JSON from POST requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ------------------------------------------------------------
// 🔁 Simple in-memory cache for user data
// ------------------------------------------------------------
let usersCache = null;        // Stores the most recent fetched users
let cacheTimestamp = null;    // Timestamp of when cache was last updated
const CACHE_DURATION = 5 * 60 * 1000; // Cache lifespan: 5 minutes (in ms)

// ------------------------------------------------------------
// ✨ Helper: Highlight search terms in text results
// ------------------------------------------------------------
function highlightText(text, searchTerm) {
    if (!searchTerm) return text;
    // Use case-insensitive regex to wrap matches in a <span> tag for styling
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

// ------------------------------------------------------------
// 🌐 Helper: Fetch users (from cache or API if expired)
// ------------------------------------------------------------
async function getUsers() {
    const now = Date.now();

    // ✅ Use cached data if still valid
    if (usersCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
        return usersCache;
    }
    
    try {
        // 🔄 Fetch user data from external API
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        
        const users = await response.json();

        // 🧠 Cache results with timestamp
        usersCache = users;
        cacheTimestamp = now;
        
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        // ⚠️ If fetching fails, return last cached data (even if old) or empty array
        return usersCache || [];
    }
}

// ------------------------------------------------------------
// 🔍 POST /search — Handle live user search requests
// ------------------------------------------------------------
app.post('/search', async (req, res) => {
    try {
        // 1️⃣ Read search term from form data (sent by HTMX)
        const searchTerm = req.body.search?.trim().toLowerCase() || '';

        // 2️⃣ If search box is empty, return initial state prompt
        if (!searchTerm) {
            return res.send(`
                <tr>
                    <td colspan="3" class="no-results">
                        <div class="no-results-icon">👥</div>
                        <h5>Start typing to search users</h5>
                        <p class="mb-0">Search by name or email address</p>
                    </td>
                </tr>
            `);
        }

        // 3️⃣ Retrieve user data (cached or fetched)
        const users = await getUsers();

        // 4️⃣ If no users available (e.g., API down), show an error
        if (!users || users.length === 0) {
            return res.send(`
                <tr>
                    <td colspan="3" class="no-results">
                        <div class="no-results-icon">⚠️</div>
                        <h5>Unable to load users</h5>
                        <p class="mb-0">Please try again later</p>
                    </td>
                </tr>
            `);
        }

        // 5️⃣ Filter users by search term (match name, email, or username)
        const searchResults = users.filter((user) => {
            const name = user.name.toLowerCase();
            const email = user.email.toLowerCase();
            const username = user.username.toLowerCase();
            
            return name.includes(searchTerm) || 
                   email.includes(searchTerm) || 
                   username.includes(searchTerm);
        });

        // 6️⃣ If no matches, send a "No results" message
        if (searchResults.length === 0) {
            return res.send(`
                <tr>
                    <td colspan="3" class="no-results">
                        <div class="no-results-icon">🔍</div>
                        <h5>No users found</h5>
                        <p class="mb-0">Try a different search term</p>
                    </td>
                </tr>
            `);
        }

        // 7️⃣ Build table rows for each result, highlighting matches
        const searchResultHtml = searchResults
            .map((user) => `
                <tr>
                    <td>${highlightText(user.name, searchTerm)}</td>
                    <td>${highlightText(user.email, searchTerm)}</td>
                    <td><span class="badge bg-secondary">${user.username}</span></td>
                </tr>
            `)
            .join('');

        // 8️⃣ Send final HTML snippet (HTMX replaces the <tbody> on the client)
        res.send(searchResultHtml);
        
    } catch (error) {
        console.error('Search error:', error);
        
        // 9️⃣ Fallback error message for unexpected exceptions
        res.send(`
            <tr>
                <td colspan="3" class="no-results">
                    <div class="no-results-icon">❌</div>
                    <h5>Something went wrong</h5>
                    <p class="mb-0">Please try again</p>
                </td>
            </tr>
        `);
    }
});

// ------------------------------------------------------------
// 🧹 Optional endpoint — Clear cached user data manually
// ------------------------------------------------------------
app.post('/clear-cache', (req, res) => {
    usersCache = null;
    cacheTimestamp = null;
    res.json({ message: 'Cache cleared' });
});

// ------------------------------------------------------------
// 🚀 Start server
// ------------------------------------------------------------
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
