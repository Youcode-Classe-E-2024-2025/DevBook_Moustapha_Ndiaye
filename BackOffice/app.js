const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/database'); 
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const bookRoutes = require('./routes/bookRoutes'); 
const cors = require('cors');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Define routes before attempting connection or starting server
app.get('/', (req, res) => { 
    res.send('DevBook API');
});

// use routes authentification througt api/auth
app.use(
    '/api/auth', authRoutes
);

// use routes login
app.use(
    '/api/auth', authRoutes
);

app.use('/api/categories', categoryRoutes); 
app.use('/api/books', bookRoutes);   

// Attempt to connect to the database
sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');

        // Start the Express server only after successful DB connection
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
        // Optional: exit the process if DB connection fails on startup
        process.exit(1);
    });

