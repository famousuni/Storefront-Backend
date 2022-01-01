import express, { Request, Response } from 'express'
import { User, UserStore } from '../models/user'
import jwt from 'jsonwebtoken'
import verifyAuthToken from "../middleware/authenticate";

const store = new UserStore()

const index = async(_req: Request, res: Response) => {
    const users = await store.index()
    res.json(users)
}

const show = async(req: Request, res: Response) => {
    try {
        const user = await store.show(req.params.id)
        res.json(user)
    } catch (err) {
        res.status(404)
        res.json(err.message)
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
        const updated = await store.update(user)
        res.json(updated)
    } catch (err) {
        res.status(400)
        res.json(err.message)
    }
}


const user_routes = (app: express.Application) => {
    app.get('/api/users', verifyAuthToken, index)
    app.get('/api/users/:id', show)
    app.post('/api/users', create)
    app.put('/api/users/:id', update)
    app.post('/api/login', authenticate)
}

export default user_routes
