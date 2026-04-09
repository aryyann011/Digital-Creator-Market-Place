import pool from "../database/db.js";

export const getCreatorAnalytics = async (req, res) => {
    try {
        const { creator_id } = req.params;

        const query = `
        WITH revenue_data AS (
            SELECT COALESCE(SUM(amount), 0) AS lifetime_revenue
            FROM ledgers
            WHERE user_id = $1 AND type = 'sale'
        ),
        sales_data AS (
            SELECT COUNT(pu.id) AS total_sales
            FROM purchases pu
            INNER JOIN products p ON pu.product_id = p.id
            WHERE p.creator_id = $1
        ),
        top_product_data AS (
            SELECT p.product_name AS top_product
            FROM products p
            INNER JOIN purchases pu ON p.id = pu.product_id
            WHERE p.creator_id = $1
            GROUP BY p.product_name
            ORDER BY COUNT(pu.id) DESC
            LIMIT 1
        )
        SELECT 
            (SELECT lifetime_revenue FROM revenue_data) AS lifetime_revenue,
            (SELECT total_sales FROM sales_data) AS total_sales,
            (SELECT top_product FROM top_product_data) AS top_product;
        `

        const result = await pool.query(query, [creator_id])

        return res.status(200).json({
            success : true,
            message : "query ran successfully",
            data : result.rows[0]
        })

    } catch (error) {
        console.log("Analytics error : ", error)
        res.status(500).json({error : "failed to get the analytics"})
    }

}