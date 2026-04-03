import express from 'express';
import pool from './database/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ 
        status: "active", 
        message: "Creator Marketplace API is screaming 🚀",
        runtime: "Node.js ES Modules"
    });
});

app.listen(PORT, () => {
    console.log(`\n✅ Server running at http://localhost:${PORT}`);
    console.log(`📂 Database schema pending in /database/schema.sql\n`);
});