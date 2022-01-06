import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

const { POSTGRES_USER, POSTGRES_PASSWORD, PG_DB, PG_TEST_DB, PG_HOST, ENV } = process.env

console.log(`Database Environment is: ${ENV}`)
let Client: Pool

if (ENV === 'test') {
  Client = new Pool({
    host: PG_HOST,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: PG_TEST_DB
  })
}

if (ENV === 'dev') {
  Client = new Pool({
    host: PG_HOST,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: PG_DB
  })
}

export { Client }
