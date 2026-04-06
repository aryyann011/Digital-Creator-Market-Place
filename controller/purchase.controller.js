import pool from "../database/db";

export const createPurchase = async(req, res) => {
    try {
        const {buyer_id, product_id} = req.body;

        const findQuery = `
        SELECT price, creator_id
        FROM product
        WHERE id = $1`

        const result = await pool.query(findQuery, [product_id]);

        if(result.rows.length === 0){
            return res.status(404).json({error : "no product is found with this product id"})
        }
        
        const price = result.rows[0].price;
        const creator_id = result.rows[0].creator_id;

        const client = await pool.connect()

        await client.query('BEGIN');

        const insertQuery1 = `
        INSERT into ledgers (user_id, amount, type, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `

        const desc1 = "This user bought something for this amount"
        const finalAmount = -Math.abs(price);

        const insertResult = await client.query(insertQuery1, [buyer_id, finalAmount, 'purchase', desc1])
        if(insertResult.rows.length === 0){
            return res.status(403).json({error : "something went wrong while inserting buyer ledger"})
        }

        const insertQuery2 = `
        INSERT into ledgers (user_id, amount, type, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `

        const desc2 = "This user sold something for this amount"

        const insertResult2 = await client.query(insertQuery2, [creator_id, price, 'sale', desc2])
        if(insertResult2.rows.length === 0){
            return res.status(403).json({error : "something went wrong while inserting seller ledger"})
        }

        const insertQuery3 = `
        INSERT into purchase (buyer_id, product_id)
        VALUES ($1, $2)
        RETURNING *;
        `

        const insertResult3 = await client.query(insertQuery3, [buyer_id, product_id])
        if(insertResult3.rows.length === 0){
            return res.status(403).json({error : "something went wrong while inserting in purchasing table"})
        }

        await client.query('COMMIT');

        return res.status(202).json({
            success : true,
            message : "purchase successfully done",
            data : (insertQuery1.rows[0], insertQuery2.rows[0], insertQuery3.rows[0])
        })
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}
