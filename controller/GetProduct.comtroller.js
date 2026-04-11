import pool from "../database/db.js";

export const getAllProducts = async (req, res) => {
    try {
        const search = req.query.search;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sort = req.query.sort || 'newest';

        const offset = (page - 1) * limit;

        let orderByClause = 'ORDER BY created_at DESC'; 
        if (sort === 'price_asc') orderByClause = 'ORDER BY price ASC';
        if (sort === 'price_desc') orderByClause = 'ORDER BY price DESC';

        let query = `
            SELECT id, product_name, price, stock_limit, creator_id 
            FROM products
        `;
        const queryValues = [];

        if (search) {
            query += ` WHERE product_name ILIKE $1`;
            queryValues.push(`%${search}%`); 
        }

        query += ` ${orderByClause} LIMIT ${limit} OFFSET ${offset}`;

        const result = await pool.query(query, queryValues);

        return res.status(200).json({
            success : true,
            message : "Products info successfully fetched",
            data : result.rows
        })        
    } catch (error) {
        console.error("Pagination Error:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
}; 