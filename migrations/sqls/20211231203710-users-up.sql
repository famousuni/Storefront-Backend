CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    password_digest VARCHAR,
    role VARCHAR(10)
);
