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

app.post('/api/users', async(req, res) => {
        try{
            const {clerk_id, email, role} = req.body;

            const insertQuery = `
            INSERT INTO users (clerk_id, email, role)
            VALUES ($1, $2, $3)
            RETURNING *;
            `;

            const result = await pool.query(insertQuery, [clerk_id, email, role]);

            res.status(201).json({
                success : true,
                message: "User created successfully",
                data : result.rows[0]
            });
        } catch(error){
            console.error('Error creating user : ', error);
            res.status(500).json({success : false, error : "Internal server error"});
        }
    }
)

app.post('/api/products', async(req, res) => {
    try {
        const {creator_id, price, stock_limit, product_name} = req.body;
        
        const checkQuery = `
        SELECT role
        FROM users u
        WHERE id = ($1)
        ` 

        const out = await pool.query(checkQuery, [creator_id])

        if(out.rows.length === 0){
            console.log("no user with this id")
            return res.status(404).json({
                error : "user not found"
            });
        }

        if(out.rows[0].role !== 'creator'){
            console.log("user is not allowed to post produts for selling pupose")
            return res.status(403).json({
                error : "user is not allowed to sell products"
            });
        } 
        const insertQuery = `
        INSERT INTO products (creator_id, price, stock_limit, product_name)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `;

        const result = await pool.query(insertQuery, [creator_id, price, stock_limit, product_name]);

        res.status(201).json({
            success : true, 
            message : "product added successfully",
            data :  result.rows[0]
        });
    } catch (error) {
        console.error('Error adding the product :', error);
        res.status(500).json({success : false, error : "Internal server error"})
    }
})

app.listen(PORT, () => {
    console.log(`\n✅ Server running at http://localhost:${PORT}`);
    console.log(`📂 Database schema pending in /database/schema.sql\n`);
});