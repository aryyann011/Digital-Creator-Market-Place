import pool from "../database/db.js";

export const createUser = async(req, res) => {
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
        res.status(500).json({success : false, error : error});
    }
}

