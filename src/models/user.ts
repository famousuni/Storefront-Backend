import bcrypt from 'bcrypt'
import { Client } from '../database'

export type User = {
    id: number
    username: string
    firstname: string
    lastname: string
    password: string
    password_digest: string
    role: string
}
const { SALT_ROUNDS, BCRYPT_PASSWORD } = process.env

const saltRounds = SALT_ROUNDS as string
const pepper = BCRYPT_PASSWORD as string


export class UserStore {
    async index(): Promise<User[]> {
        try {
            const conn = await Client.connect()
            const sql = 'SELECT * FROM users'
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        } catch (err) {
            console.log(err)
            throw new Error('Cannot get users')
        }
    }

    async show(id: string): Promise<User> {
        try {
            const conn = await Client.connect()
            const sql = 'SELECT * FROM users WHERE id=($1)'
            const result = await conn.query(sql, [id])
            conn.release()
            if (result.rows[0] === undefined) throw "not found"
            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not find user with ${id}. Error ${err}`)
        }
    }

    async create(u: User): Promise<User> {
        try {
            const conn = await Client.connect()
            const sql =
                'INSERT INTO users (username, password_digest, firstname, lastname, role) VALUES($1, $2, $3, $4, $5) RETURNING *'
            const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds))
            //console.log(`User Create Hash: ${hash}`)

            //If role is not passed in or is not equal to admin it will be customer
            let role = 'customer'
            if (u.role === 'admin') {
                role = 'admin'
            }

            const result = await conn.query(sql, [u.username, hash, u.firstname, u.lastname, role])
            const user = result.rows[0]
            conn.release()

            //Only return id, username, and role for JWT
            delete user.password_digest
            delete user.firstname
            delete user.lastname
            //console.log(user)
            return user
        } catch (err) {
            //Catch if user already exists in the DB
            if (err.message === 'duplicate key value violates unique constraint \"users_username_key\"') {
                throw new Error(`Unable create user (${u.username}): User already exists`)
            }
            throw new Error(`Unable create user (${u.username}): ${err}`)
        }
    }

    async update(u: User): Promise<User> {
        try {
            const conn = await Client.connect()
            let sql = 'SELECT * FROM users WHERE id=($1)'
            let result = await conn.query(sql, [u.id])
            const foundUser = result.rows[0]
            if (foundUser === undefined) throw new Error(`User id ${u.id} not found`)
            //Hash presented password
            const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds))
            sql = 'UPDATE users SET username=($1), password_digest=($2), firstname=($3), lastname=($4), role=($5) WHERE id=($6) RETURNING *'
            result = await conn.query(sql, [u.username, hash, u.firstname, u.lastname, u.role, u.id])
            const updatedUser = result.rows[0]
            conn.release()
            return updatedUser

        } catch (err) {
            throw new Error(`Unable to update user (${u.username}): ${err}`)
        }
    }

    async authenticate(username: string, password: string): Promise<User | null> {
        const conn = await Client.connect()
        const sql =
            'SELECT id, username, role, password_digest FROM users WHERE username=($1)'
        const result = await conn.query(sql, [username])
        //console.log('Authenticate Model Pass+Pep: ', password + pepper)

        if (result.rows.length) {
            const user = result.rows[0]

            if (bcrypt.compareSync(password + pepper, user.password_digest)) {
                //Only return id, username, and role for JWT
                delete user.password_digest
                //console.log(`Authenticated for user: ${user.username}`)
                return user
            }
        }

        return null
    }
}
