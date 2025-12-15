// Import the Express library (using ES module syntax)
import express from 'express';
const app = express(); // Create an Express application instance

// Serve static files from the 'public' folder (this includes your HTML, CSS, JS)
app.use(express.static('public'));

// Middleware to parse URL-encoded data (from HTML form submissions)
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON payloads (for API-style requests)
app.use(express.json());

/* -------------------------------
   Helper function: getBMICategory()
   Determines the BMI category, alert color, and icon
   based on the calculated BMI value.
---------------------------------- */
function getBMICategory(bmi) {
    if (bmi < 18.5) {
        // Below 18.5 = underweight
        return { category: 'Underweight', color: 'info', icon: '📉' };
    } else if (bmi >= 18.5 && bmi < 25) {
        // Between 18.5 and 25 = normal
        return { category: 'Normal weight', color: 'success', icon: '✅' };
    } else if (bmi >= 25 && bmi < 30) {
        // Between 25 and 30 = overweight
        return { category: 'Overweight', color: 'warning', icon: '⚠️' };
    } else {
        // 30 and above = obese
        return { category: 'Obese', color: 'danger', icon: '🔴' };
    }
}

/* -------------------------------
   POST /calculate
   Route to handle BMI calculation
   Receives height and weight from the form (via HTMX)
   Returns an HTML snippet with the result
---------------------------------- */
app.post('/calculate', (req, res) => {
    // Parse height and weight from request body
    const height = parseFloat(req.body.height);
    const weight = parseFloat(req.body.weight);

    // ✅ Validate that inputs exist and are positive
    if (!height || !weight || height <= 0 || weight <= 0) {
        return res.send(`
            <div class="alert alert-danger mt-3" role="alert">
                ❌ Please enter valid height and weight values.
            </div>
        `);
    }

    // ✅ Additional validation for realistic human ranges
    if (height < 0.5 || height > 3.0) {
        return res.send(`
            <div class="alert alert-danger mt-3" role="alert">
                ❌ Height must be between 0.5 and 3.0 meters.
            </div>
        `);
    }

    if (weight < 20 || weight > 300) {
        return res.send(`
            <div class="alert alert-danger mt-3" role="alert">
                ❌ Weight must be between 20 and 300 kg.
            </div>
        `);
    }

    // ✅ Calculate BMI using the formula: weight / (height²)
    const bmi = weight / (height * height);

    // Get category, alert color, and icon for this BMI
    const { category, color, icon } = getBMICategory(bmi);

    // ✅ Send HTML response directly back to HTMX
    // HTMX will replace the #result div content with this HTML snippet
    res.send(`
        <div class="alert alert-${color} mt-3" role="alert">
            <h5 class="alert-heading">${icon} Your BMI Result</h5>
            <hr>
            <p class="mb-2"><strong>Height:</strong> ${height} m</p>
            <p class="mb-2"><strong>Weight:</strong> ${weight} kg</p>
            <p class="mb-2"><strong>BMI:</strong> ${bmi.toFixed(1)}</p>
            <p class="mb-0"><strong>Category:</strong> ${category}</p>
        </div>

        <!-- Optional BMI category reference list -->
        <div class="mt-3 small text-muted">
            <strong>BMI Categories:</strong>
            <ul class="mb-0 mt-2">
                <li>Underweight: BMI < 18.5</li>
                <li>Normal weight: BMI 18.5 - 24.9</li>
                <li>Overweight: BMI 25 - 29.9</li>
                <li>Obese: BMI ≥ 30</li>
            </ul>
        </div>
    `);
});

/* -------------------------------
   Start the Express server
   Listens for incoming requests on port 3000
---------------------------------- */
app.listen(3000, () => {
    console.log('✅ Server listening on port 3000');
});
