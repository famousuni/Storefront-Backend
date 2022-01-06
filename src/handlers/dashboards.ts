import express, { Request, Response } from 'express'
import { DashboardQueries } from '../services/dashboard'
import {addRole, verifyAdminToken, verifyAuthToken} from "../middleware/authenticate";

const dashboard = new DashboardQueries()

const usersCart = async (_req: Request, res: Response) => {
    try {
        const userId = res.locals.id.toString()
        const cartItems = await dashboard.userCurrentOrder(userId)
        res.json(cartItems)
    } catch (err) {
        res.status(400)
        console.log(err)
        res.json(`Error ${err.message}`)
        return
    }

}

const usersCompleted = async (_req: Request, res: Response) => {
    try {
        if (res.locals.role === 'customer' && (_req.params.id !== res.locals.id.toString())) throw new Error('customers can only show their own completed orders')
        if (res.locals.role !== 'customer' && res.locals.role !== 'admin') throw new Error('invalid role')
        const orders = await dashboard.userCompletedOrders(_req.params.id)
        res.json(orders)
    } catch (err) {
        res.status(401)
        console.log(res.locals.role)
        console.log(err.message)
        res.json(`Error: ${err.message}`)
    }
}

const productsByCategory = async (_req: Request, res: Response) => {
    try {
        const products = await dashboard.productsByCategory(_req.params.id)
        res.json(products)
    } catch (err) {
        res.status(400)
        res.json(`Error ${err.message}`)
    }
}

const dashboard_routes = (app: express.Application) => {
    app.get('/api/dashboard/cart', verifyAuthToken, addRole, usersCart)
    app.get('/api/dashboard/orders/:id', verifyAuthToken, addRole, usersCompleted)
    app.get('/api/dashboard/products-by-category/:id', productsByCategory)
}

export default dashboard_routes
