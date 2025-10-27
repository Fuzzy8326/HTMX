// Set-ExecutionPolicy Unrestricted -Scope Process
import express from 'express';
const app = express();

// Set static folder
app.use(express.static('public'));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Handle POST request to calculate BMI
app.post('/calculate', (req, res) => {
    // Parse the height and weight from the request body (which comes from the form data)
    const height = parseFloat(req.body.height); // Convert height to a floating point number
    const weight = parseFloat(req.body.weight); // Convert weight to a floating point number

    // Calculate BMI using the formula: BMI = weight / (height * height)
    const bmi = weight / (height * height);

    // Send the BMI result as HTML content to be injected into the target div
    res.send(`
    <p>Height of ${height} & Weight of ${weight} gives you BMI of ${bmi.toFixed(2)}</p>
    `);
})


// Start the server
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
