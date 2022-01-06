import { Client } from '../database'
import {verifyAdminToken, verifyAuthToken} from "../middleware/authenticate";

export type Order = {
    id: number
    status: string
    user_id: number
}

export class OrderStore {
    async index(): Promise<Order[]> {
        try {
            const conn = await Client.connect()
            const sql = 'SELECT * FROM orders'
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        } catch (err) {
            console.log(err)
            throw new Error('Cannot get Orders')
        }
    }

    async show(id: string): Promise<Order> {
        try {
            const conn = await Client.connect()
            const sql = 'SELECT * FROM orders WHERE id=($1)'
            const result = await conn.query(sql, [id])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not find order ${id}. Error: ${err}`)
        }
    }

    async update(o: Order): Promise<Order> {
        try {
            const conn = await Client.connect()
            const sql = 'UPDATE orders SET status=($1) WHERE id=($2) RETURNING *'
            const result = await conn.query(sql, [o.status, o.id])
            const order = result.rows[0] as Order
            conn.release()
            return order
        } catch (err) {
            throw new Error(`Could not update order ${o.id}. Error ${err}`)
        }
    }

    async create(o: Order): Promise<Order> {
        try {
            const conn = await Client.connect()
            const sql =
                'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *'
            const result = await conn.query(sql, [o.status, o.user_id])
            const order = result.rows[0] as Order
            conn.release()
            return order
        } catch (err) {
            throw new Error(
                `Could not add new order for user ${o.user_id}. Error ${err}`
            )
        }
    }

    async addProduct(
        quantity: number,
        orderId: string,
        productId: string
    ): Promise<Order> {
        //console.log(quantity, orderId, productId)
        try {
            const ordersql = 'SELECT * FROM orders WHERE id=($1)'
            const conn = await Client.connect()
            const result = await conn.query(ordersql, [orderId])
            const order = result.rows[0]
            if (order.status !== 'active') {
                throw new Error(
                    `Could not add product ${productId} to order ${orderId} because order status is ${order.status}`
                )
            }
            conn.release()
        } catch (err) {
            throw new Error(`${err}`)
        }
        try {
            const conn = await Client.connect()
            let sql = 'SELECT * FROM order_products WHERE order_id = ($1) AND product_id = ($2)'
            let result = await conn.query(sql, [orderId, productId])
            const exitingOrderProduct = result.rows[0]
            if (exitingOrderProduct) {
                //console.log("Updating existing order with this product")
                sql = 'UPDATE order_products SET quantity=($1) WHERE order_id = ($2) AND product_id = ($3) RETURNING *'
                result = await conn.query(sql, [quantity, orderId, productId])
                const order = result.rows[0]
                conn.release()
                return order
            } else {
                //console.log("Adding product to order")
                sql =
                    'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *'
                result = await conn.query(sql, [quantity, orderId, productId])
                const order = result.rows[0]
                conn.release()
                return order
            }
        } catch (err) {
            throw new Error(
                `Could not add product ${productId} to order ${orderId}: ${err}`
            )
        }
    }
}

