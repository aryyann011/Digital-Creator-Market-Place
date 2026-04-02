CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    clerk_id VARCHAR(100) UNIQUE,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('buyer', 'creator'))
)

CREATE TABLE products(
    id SERIAL PRIMARY KEY,
    creator_id INT,
    price NUMERIC(10, 2),
    stock_limit INT
    product_name VARCHAR(100),
    FOREIGN KEY (creator_id) REFERENCES users(id)
)

CREATE TABLE ledgers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    amount NUMERIC(10, 2) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('sale', 'purchase', 'payout', 'refund')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);