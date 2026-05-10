const express = require('express');
const path = require('path');
const { connectDB } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

connectDB().then(() => {
    app.use('/api/auth', authRoutes);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`[+] Server đang chạy tại: http://localhost:${PORT}`);
    });
});