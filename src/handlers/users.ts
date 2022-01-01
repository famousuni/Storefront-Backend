import express, { Request, Response } from 'express'
import { User, UserStore } from '../models/user'
import jwt from 'jsonwebtoken'
import { verifyAuthToken, verifyAdminToken, addRole } from "../middleware/authenticate";

const store = new UserStore()

const index = async(_req: Request, res: Response) => {
    const users = await store.index()
    res.json(users)
}

const show = async(req: Request, res: Response) => {
    try {
        console.log(res.locals.role)
        if (res.locals.role === 'customer') {
            if (res.locals.id.toString() === req.params.id) {
                const user = await store.show(req.params.id)
                res.json(user)
            } else {
                throw new Error('customers can only show their own account')
            }
        } else if (res.locals.role === 'admin') {
            const user = await store.show(req.params.id)
            res.json(user)
        } else {
            throw new Error('invalid role in presented token')
        }
    } catch (err) {
        res.status(400)
        res.json(`Error: ${err.message}`)
    }

}

const create = async (req: Request, res: Response) => {
    const user: User = <User>{
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        role: req.body.role
    }
    try {
        const newUser = await store.create(user)
        const token = jwt.sign(
            { user: newUser },
            process.env.TOKEN_SECRET as string
        )
        res.json(token)
    } catch (err) {
        res.status(400)
        res.json(err.message)
    }
}

const update = async (req: Request, res: Response) => {
    const user: User = <User>{
        id: parseInt(req.params.id),
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        role: req.body.role
    }
    try {
        //console.log(res.locals.role)
        if (res.locals.role === 'customer') {
            if (user.role !== 'customer') throw new Error('customers cannot update their role')
            if (res.locals.id.toString() === req.params.id) {
                const updated = await store.update(user)
                res.json(updated)
            } else {
                throw new Error('customers can only update their own account')
            }
        } else if (res.locals.role === 'admin') {
            const updated = await store.update(user)
            res.json(updated)
        } else {
            throw new Error('invalid role in presented token')
        }
    } catch (err) {
        res.status(400)
        res.json(`Error: ${err.message}`)
    }
}

const authenticate = async (req: Request, res: Response) => {
    const user: User = <User>{
        username: req.body.username,
        password: req.body.password
    }
    try {
        const u = await store.authenticate(user.username, user.password)
        if (u === null) {
            throw new Error('Invalid Credentials')
        }
        const token = jwt.sign({ user: u }, process.env.TOKEN_SECRET as string)
        res.json(token)
    } catch (err) {
        res.status(401)
        res.json('Invalid Credentials')
    }
}




const user_routes = (app: express.Application) => {
    app.get('/api/users', verifyAuthToken, verifyAdminToken, index)
    app.get('/api/users/:id', verifyAuthToken, addRole, show)
    app.post('/api/users', create)
    app.put('/api/users/:id', verifyAuthToken, addRole, update)
    app.post('/api/login', authenticate)
}

export default user_routes
