// Import the Express framework
import express from 'express';
const app = express(); // Initialize Express app

// Middleware setup
app.use(express.static('public')); // Serve static files (like your HTML/CSS/JS)
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.json()); // Parse JSON request bodies

/* -------------------------------------------------
   Simulated Bitcoin price data and helper variables
-------------------------------------------------- */

// Set an initial realistic price (starting point)
let currentPrice = 65000;
let previousPrice = currentPrice;

// Track session high, low, and price history
let highPrice = currentPrice;
let lowPrice = currentPrice;
let priceHistory = [];

/* -------------------------------------------------
   Helper: Format numbers as USD currency
-------------------------------------------------- */
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

/* -------------------------------------------------
   Helper: Calculate price and percentage change
-------------------------------------------------- */
function calculateChange(current, previous) {
    const change = current - previous; // Difference between prices
    const percentChange = (change / previous) * 100; // Percentage difference
    return { change, percentChange };
}

/* -------------------------------------------------
   Route: /get-price
   Simulates Bitcoin price updates and returns HTML
   - Called automatically by HTMX every 5 seconds
-------------------------------------------------- */
app.get('/get-price', (req, res) => {
    // Store current price before updating (to calculate change)
    previousPrice = currentPrice;
    
    // Simulate price fluctuation of ±0.5%
    const changePercent = (Math.random() - 0.5) * 1; // between -0.5% and +0.5%
    const priceChange = currentPrice * (changePercent / 100);
    currentPrice = currentPrice + priceChange;
    
    // Track new high and low values
    if (currentPrice > highPrice) highPrice = currentPrice;
    if (currentPrice < lowPrice) lowPrice = currentPrice;
    
    // Calculate the numeric and percentage change
    const { change, percentChange } = calculateChange(currentPrice, previousPrice);
    
    // Determine up/down visual cues
    const isUp = change >= 0;
    const changeClass = isUp ? 'price-up' : 'price-down';
    const arrow = isUp ? '▲' : '▼';
    
    // Maintain a short rolling history (last 20 updates)
    priceHistory.push({
        price: currentPrice,
        timestamp: new Date().toISOString()
    });
    if (priceHistory.length > 20) {
        priceHistory.shift();
    }
    
    // Send an HTML snippet back to the frontend
    // HTMX will replace the #price-display element with this markup
    res.send(`
        <div class="price-display">
            <p class="current-price">${formatCurrency(currentPrice)}</p>
            <p class="price-change ${changeClass}">
                ${arrow} ${formatCurrency(Math.abs(change))} 
                (${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(2)}%)
            </p>
            <p class="last-updated">
                Last updated: ${new Date().toLocaleTimeString()}
            </p>
        </div>
    `);
});

/* -------------------------------------------------
   Route: /get-history
   Optional JSON endpoint for last 20 prices
-------------------------------------------------- */
app.get('/get-history', (req, res) => {
    res.json(priceHistory);
});

/* -------------------------------------------------
   Route: /get-stats
   Optional JSON endpoint for high/low/volume info
-------------------------------------------------- */
app.get('/get-stats', (req, res) => {
    res.json({
        current: currentPrice,
        high: highPrice,
        low: lowPrice,
        // Simulated 24h trading volume (in billions)
        volume: (Math.random() * 50 + 20).toFixed(2) + 'B'
    });
});

/* -------------------------------------------------
   Start server on port 3000
-------------------------------------------------- */
app.listen(3000, () => {
    console.log('🚀 Server listening on port 3000');
});
