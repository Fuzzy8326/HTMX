import express from 'express';
const app = express();

// Set static folder (if serving static assets like CSS, JS)
app.use(express.static('public'));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Handle GET request for profile edit
app.get('/user/:id/edit', (req, res) => {
    // send an HTML form for editing with enhanced styling
    res.send(`
        <div class="profile-card" hx-target="this" hx-swap="outerHTML swap:0.3s">
            <div class="card-header-custom">
                <div class="avatar">GL</div>
                <h5 class="card-title-custom">Edit Profile</h5>
            </div>
            <div class="card-body-custom">
                <form hx-put="/user/1">
                    <div class="mb-4">
                        <label for="name" class="form-label-custom">Name</label>
                        <input type="text" 
                               class="form-control form-control-custom" 
                               id="name" 
                               name="name" 
                               value="Greg Lim"
                               required>
                    </div>
                    <div class="mb-4">
                        <label for="bio" class="form-label-custom">Bio</label>
                        <textarea class="form-control form-control-custom" 
                                  id="bio" 
                                  name="bio"
                                  required>Follower of Christ | Author of Best-selling Amazon Tech Books and Creator of Coding Courses</textarea>
                    </div>
                    <button type="submit" class="btn-custom">
                        <span class="edit-icon">💾</span>
                        Save Changes
                    </button>
                    <button type="button" 
                            hx-get="/user/1/view" 
                            class="btn-secondary-custom">
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    `);
});

// Handle GET request for profile view (for cancel button)
app.get('/user/:id/view', (req, res) => {
    res.send(`
        <div class="profile-card" hx-target="this" hx-swap="outerHTML swap:0.3s">
            <div class="card-header-custom">
                <div class="avatar">GL</div>
                <h5 class="card-title-custom">Greg Lim</h5>
            </div>
            <div class="card-body-custom">
                <p class="bio-text">
                    Follower of Christ | Author of Best-selling Amazon Tech Books and Creator of Coding Courses
                </p>
                <button class="btn-custom" hx-get="/user/1/edit">
                    <span class="edit-icon">✏️</span>
                    Edit Profile
                </button>
            </div>
        </div>
    `);
});

// Handle PUT request for editing
app.put('/user/:id', (req, res) => {
    const name = req.body.name;
    const bio = req.body.bio;
    
    // Get initials for avatar
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    
    // Send the updated profile back
    res.send(`
        <div class="profile-card" hx-target="this" hx-swap="outerHTML swap:0.3s">
            <div class="card-header-custom">
                <div class="avatar">${initials}</div>
                <h5 class="card-title-custom">${name}</h5>
            </div>
            <div class="card-body-custom">
                <p class="bio-text">
                    ${bio}
                </p>
                <button class="btn-custom" hx-get="/user/1/edit">
                    <span class="edit-icon">✏️</span>
                    Edit Profile
                </button>
            </div>
        </div>
    `);
});

// Start the server
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});