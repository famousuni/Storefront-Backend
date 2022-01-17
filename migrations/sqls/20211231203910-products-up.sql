CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    price numeric NOT NULL,
    description VARCHAR(255),
    url VARCHAR(255),
    category_id bigint REFERENCES product_categories(id));
