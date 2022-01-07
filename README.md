# Storefront-Backend


This project is the backend for a storefront application written in TS utilizing Node/Express/Postgresql

## Installation

1. Clone this repo to your development directory
2. Run 'npm install' from that directory to address package dependencies

## Environment variable setup
1. Create a file called .env and place it in the project directory filling out the following attributes. This will be used by both the code and by postgres when bootstrapping the container
#### 
      POSTGRES_USER=full_stack_dev
      POSTGRES_PASSWORD=<STRING>
      PG_DB=storefront_dev
      PG_TEST_DB=storefront_test
      PG_PORT=5432
      PG_HOST=127.0.0.1
      ENV=dev
      BCRYPT_PASSWORD=<STRING>
      SALT_ROUNDS=<INT>
      TOKEN_SECRET=<STRING>

## DB Setup (POSTGRES will listen on port 5432)
2. Install Docker
3. From the cloned directory run docker compose up -d which wil start the postgres container in detached mode
4. Execute ./initdb.sh which will create the storefront_dev and storefront_test databases.

## Command Usage

'npm run watch' - This will start tsc-watch and rebuild on any changes

'npm run migrate' - This will run migrate-db for the dev environment

'npm run migrate-test' - This will run migrate-db for the test environment

'npm run test' - This will run the jasmine testing framework

'npm run build' - This will compile the TypeScript code into JavaScript in the ./dist directory

'npm run start' - This will run nodemon and restart the server on any change to the TypeScript source code

'npm run prettier' - This will execute prettier and reformat the code according to the prettier configuration

'npm run lint' - This will run eslint and return any linting errors

## API Usage
The API server will listen on port 3000.

Specific API details/documentation can be found in the REQUIREMENTS.md file.

## Contact
[CharlieGut14@gmail.com](charliegut14@gmail.com)
