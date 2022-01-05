import { Client } from '../database'

export class DashboardQueries {

    async userCurrentOrder(id: string): Promise<{product: string, quantity: number}[]> {
        try {
            const conn = await Client.connect()
            let sql = 'SELECT * FROM orders WHERE user_id = ($1) AND status = ($2)'
            let result = await conn.query(sql, [id, 'open'])
            //console.log(result.rows[0].id)
            sql = 'SELECT name, price, order_id, quantity FROM products INNER JOIN order_products ON products.id = order_products.id WHERE order_id = ($1)'
            result = await conn.query(sql, [result.rows[0].id])
            conn.release()
            //console.log(result)
            return result.rows[0]
        } catch (err) {
            throw new Error(`Unable to list order items: ${err}`)
        }
    }

    async userCompletedOrders(id: string): Promise<{product: string, quantity: number}[]> {
        try {
            const conn = await Client.connect()
            let sql = 'SELECT * FROM orders WHERE user_id = ($1) AND status = ($2)'
            let result = await conn.query(sql, [id, 'open'])
            //console.log(result.rows[0].id)
            sql = 'SELECT name, price, order_id, quantity FROM products INNER JOIN order_products ON products.id = order_products.id WHERE order_id = ($1)'
            result = await conn.query(sql, [result.rows[0].id])
            conn.release()
            //console.log(result)
            return result.rows[0]
        } catch (err) {
            throw new Error(`Unable to list order items: ${err}`)
        }
    }
}
