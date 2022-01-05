# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index - [GET] /api/products
- Show (args: product id) - [GET] /api/products/:id
- Create [admin token required] - [POST] /api/products
- [TODO OPTIONAL] Top 5 most popular products [GET] /api/dashboard/most-popular-products
- [TODO OPTIONAL] Products by category (args: product category id) [GET] /api/products-by-category/:id

#### Users
- Index [admin token required] - [GET] /api/users
- Show (args: user id) [user token required] - [GET] /api/users/:id (If tokens role is customer they can only get their own user object, if tokens role is admin they can get any user object)
- Create - [POST] /api/users
- Update [user token required] - [PUT] /api/users/:id (If tokens role is customer they can only update their own user object and cannot change their role, if tokens role is admin they can update any user object)
- Login - [Post] /api/login

#### Orders
- Index [admin token required] = [GET] /api/orders
- Show [admin token required] = [GET] /api/orders/:id (If tokens role is customer they can only get their own order object, if tokens role is admin they can get any order object)
- Create [token required] - [POST] /api/orders
- Add Product (args: order id, body: product id, qty) [token required] - [POST] /api/orders/:id
- [TODO] Current Order by user (args: user id) [token required] - [GET] /api/dashboard/cart
- [TODO OPTIONAL] Completed Orders by user (args: user id) [token required] - [GET] /api/dashboard/orders

## Data Shapes
#### Product
- id
- name
- price
- [OPTIONAL] category

#### Products Table
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    price integer NOT NULL,
    category VARCHAR

#### User
- id
- userName
- firstName
- lastName
- passwordDigest
- role

#### Users Table
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    password_digest VARCHAR,
    role VARCHAR(10)
    

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

#### Orders Table
    id SERIAL PRIMARY KEY,
    status VARCHAR(15),
    user_id bigint REFERENCES users(id),

#### Order Products Table
    id SERIAL PRIMARY KEY,
    quantity integer,
    order_id bigint REFERENCES orders(id),
    product_id bigint REFERENCES products(id)
