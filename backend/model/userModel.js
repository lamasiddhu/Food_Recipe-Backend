const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'food_recipe_db',
    password: process.env.DB_PASSWORD || 'pickle',
    port: process.env.DB_PORT || 5432,
});

class UserModel {
    static async createUser(userData) {
        const { full_name, username, email, password } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO users (full_name, username, email, password)
            VALUES ($1, $2, $3, $4)
            RETURNING id, full_name, username, email, created_at
        `;

        const result = await pool.query(query, [full_name, username, email, hashedPassword]);
        return result.rows[0];
    }

    static async findByEmail(email) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    static async findByUsername(username) {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        return result.rows[0];
    }

    static async findById(id) {
        const result = await pool.query(
            'SELECT id, full_name, username, email, profile_photo, created_at FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    static async updateUser(id, userData) {
        const fields = [];
        const values = [];
        let index = 1;

        for (const [key, value] of Object.entries(userData)) {
            if (value !== undefined) {
                fields.push(`${key} = $${index}`);
                values.push(value);
                index++;
            }
        }

        fields.push(`updated_at = CURRENT_TIMESTAMP`);

        const query = `
            UPDATE users
            SET ${fields.join(', ')}
            WHERE id = $${index}
            RETURNING id, full_name, username, email, profile_photo, updated_at
        `;

        values.push(id);

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async deleteUser(id) {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
        return result.rows[0];
    }

    static async validatePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    static async getAllUsers() {
        const result = await pool.query(
            'SELECT id, full_name, username, email, profile_photo, created_at FROM users ORDER BY created_at DESC'
        );
        return result.rows;
    }
}

module.exports = UserModel;
