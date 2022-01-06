import express, { Request, Response } from 'express'
import { Order, OrderStore} from "../models/order";
import { verifyAuthToken, verifyAdminToken, addRole } from "../middleware/authenticate";
import jwt from 'jsonwebtoken'


const store = new OrderStore()

const index = async(_req: Request, res: Response) => {
    try {
        const orders = await store.index()
        res.json(orders)
    } catch (err) {
        res.status(400)
        res.json(`Error: ${err.message}`)
    }

}

const show = async(req: Request, res: Response) => {
    try {
        const order = await store.show(req.params.id)
        if (res.locals.role === 'customer' && (order.user_id !== res.locals.id.toString())) throw new Error('customers can only show their own orders')
        if (res.locals.role !== 'customer' && res.locals.role !== 'admin') throw new Error('invalid role')
        res.json(order)
    } catch (err) {
        res.status(401)
        //console.log(res.locals.role)
        //console.log(err.message)
        res.json(`Error: ${err.message}`)
    }

}

const update = async(req: Request, res: Response) => {
    try {
        if (res.locals.role === 'customer' && (req.params.id !== res.locals.id.toString())) throw new Error('customers can only update their own orders')
        if (res.locals.role !== 'customer' && res.locals.role !== 'admin') throw new Error('invalid role')
        const order: Order = <Order> {
            id: parseInt(req.params.id),
            status: req.body.status,
            user_id: req.body.user_id
        }
        const result = await store.update(order)
        res.json(result)
    } catch (err) {
        res.status(400)
        res.json(err.message)
    }
}

const create = async (req: Request, res: Response) => {
    try {
        const authorizationHeader = req.headers.authorization as string
        const token = authorizationHeader.split(' ')[1] as string
        jwt.verify(token, process.env.TOKEN_SECRET as string)
    } catch (err) {
        res.status(401)
        res.json('Access denied, invalid token')
        return
    }
    try {
        const order: Order = <Order>{
            status: req.body.status,
            user_id: req.body.user_id
        }
        const newOrder = await store.create(order)
        res.json(newOrder)
    } catch (err) {
        res.status(400)
        //console.log(err.message)
        res.json(err.message)
    }
}

const addProduct = async (_req: Request, res: Response) => { //TODO: users should only add products to their own orders
    try {
        const orderId: string = _req.params.id
        const productId: string = _req.body.product_id
        const quantity: number = parseInt(_req.body.quantity)
        const addedProduct = await store.addProduct(quantity, orderId, productId)
        res.json(addedProduct)
    } catch (err) {
        res.status(400)
        res.json(err.message)
    }
}

const order_routes = (app: express.Application) => {
    app.get('/api/orders', verifyAuthToken, verifyAdminToken, index)
    app.get('/api/orders/:id', verifyAuthToken, addRole, show)
    app.put('/api/orders/:id', verifyAuthToken, addRole, update)
    app.post('/api/orders', verifyAuthToken, create)
    app.post('/api/orders/:id/products', verifyAuthToken, addProduct)
}

export default order_routes
