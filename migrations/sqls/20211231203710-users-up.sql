CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    password_digest VARCHAR,
    role VARCHAR(10)
);
