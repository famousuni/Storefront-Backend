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
        res.status(401)
        res.json('Access denied, invalid token')
        return
    }

}

const dashboard_routes = (app: express.Application) => {
    app.get('/api/dashboard/cart', verifyAuthToken, addRole, usersCart)
}

export default dashboard_routes
