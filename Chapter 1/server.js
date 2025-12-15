// Import the Express framework for building HTTP servers and APIs
import express from 'express';

// Create an instance of the Express application
const app = express();

/* 
 Serve static files from the "public" directory.
 This allows you to host HTML, CSS, images, and client-side JS files.
 Example: /public/index.html → http://localhost:3000/index.html
*/
app.use(express.static('public'));

/*
 Parse URL-encoded form data (from <form> submissions).
 extended: true allows objects/arrays to be encoded in URL format.
*/
app.use(express.urlencoded({ extended: true }));

/*
 Parse JSON request bodies.
 This is required for APIs that receive JSON (POST, PUT, PATCH).
*/
app.use(express.json());

// ---------------------------------------------------------------------------
// GET /users — Returns a list of users as an HTML fragment
// ---------------------------------------------------------------------------
app.get('/users', async (req, res) => {

    /* 
       Simulate a slow server response (2 seconds).
       This is useful for testing loading indicators in HTMX.
    */
    setTimeout(async () => {
        
        // Read ?limit=NUMBER from the query string. Default to 10 if missing.
        const limit = +req.query.limit || 10;

        /*
         Fetch user data from JSONPlaceholder (a free fake REST API).
         _limit controls how many users to return.
        */
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/users?_limit=${limit}`
        );

        // Convert the API response into a JavaScript array
        const users = await response.json();

        /*
         Send an HTML snippet back to the browser.
         HTMX will insert this HTML directly into the target element.
         This avoids writing front-end JavaScript.
        */
        res.send(`
            <h2>Users</h2>
            <ul class="list-group">
                ${users
                    .map(user => `<li class="list-group-item">${user.name}</li>`)
                    .join('')}
            </ul>
        `);

    }, 2000); // 2-second artificial delay
});

// ---------------------------------------------------------------------------
// Start the server on port 3000
// ---------------------------------------------------------------------------
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
