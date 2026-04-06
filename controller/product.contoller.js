import pool from "../database/db.js"; 

export const createPurchase = async(req, res) => {
    try {
        const { buyer_id, product_id } = req.body;

        const findQuery = `SELECT price, creator_id FROM products WHERE id = $1`;
        const result = await pool.query(findQuery, [product_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No product found with this ID" });
        }
        
        const price = result.rows[0].price;
        const creator_id = result.rows[0].creator_id;

        const client = await pool.connect();

        try {
            await client.query('BEGIN'); 

            const insertQuery1 = `
                INSERT into ledgers (user_id, amount, type, description)
                VALUES ($1, $2, $3, $4) RETURNING *;
            `;
            const finalAmount = -Math.abs(price);
            const insertResult1 = await client.query(insertQuery1, [buyer_id, finalAmount, 'purchase', "Bought a product"]);
            
            if (insertResult1.rows.length === 0) throw new Error("Failed to charge buyer");

            const insertQuery2 = `
                INSERT into ledgers (user_id, amount, type, description)
                VALUES ($1, $2, $3, $4) RETURNING *;
            `;
            const insertResult2 = await client.query(insertQuery2, [creator_id, price, 'sale', "Sold a product"]);
            if (insertResult2.rows.length === 0) throw new Error("Failed to pay creator");

            const insertQuery3 = `
                INSERT into purchases (buyer_id, product_id)
                VALUES ($1, $2) RETURNING *;
            `;
            const insertResult3 = await client.query(insertQuery3, [buyer_id, product_id]);
            if (insertResult3.rows.length === 0) throw new Error("Failed to record delivery");

            await client.query('COMMIT');

            return res.status(201).json({
                success: true,
                message: "Purchase successfully done",
                data: [insertResult1.rows[0], insertResult2.rows[0], insertResult3.rows[0]]
            });

        } catch (dbError) {
            await client.query('ROLLBACK');
            console.error("Transaction rolled back:", dbError.message);
            return res.status(500).json({ error: "Transaction failed. No money was moved." });
        } finally {
            client.release(); 
        }

    } catch (serverError) {
        console.error('Server error:', serverError);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};