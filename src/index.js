const express = require('express');
const app = express();
const routes = require('./routes');
const logger = require('./helpers/winston');
const { sequelize } = require('./models');
require('dotenv').config();

app.use(express.json());
app.use(routes);

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ message: 'An error occurred.' });
});

// Start the server after syncing the database
const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
    });
});
