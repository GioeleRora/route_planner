const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const availabilityRoutes = require('./routes/availability');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve HTML for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Routes
app.use('/api/availability', availabilityRoutes); // API routes
app.use('/', availabilityRoutes); // Ensure the /results route is accessible

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
