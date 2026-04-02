import pg from 'pg';
import dotenv from 'dotenv';

// Tell dotenv to read the .env file and load the variables into memory
dotenv.config();

const { Pool } = pg;

// The Pool automatically grabs the PGUSER, PGPASSWORD, etc., from your .env file!
const pool = new Pool();

// A quick test to see if we successfully connected
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Error connecting to PostgreSQL:', err.stack);
    } else {
        console.log('🐘 Successfully connected to PostgreSQL Database!');
        release(); // Returns the client back to the pool
    }
});

export default pool;