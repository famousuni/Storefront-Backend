import { Client } from '../database'
import { QueryResult } from 'pg'

export class DashboardQueries {
  async userCurrentOrder(
    id: string
  ): Promise<{ product: string; quantity: number }[]> {
    try {
      const conn = await Client.connect()
      let sql = 'SELECT * FROM orders WHERE user_id = ($1) AND status = ($2)'
      let result = await conn.query(sql, [id, 'active'])
      //console.log(result.rows)
      if (result.rows.length === 0) return result.rows
      //console.log(result.rows[0].id)
      sql =
        'SELECT name, price, order_id, quantity FROM products INNER JOIN order_products ON products.id = order_products.product_id WHERE order_id = ($1)'
      result = await conn.query(sql, [result.rows[0].id])
      conn.release()
      //console.log(result)
      return result.rows[0]
    } catch (err) {
      throw new Error(`Unable to list order items: ${err}`)
    }
  }

  async userCompletedOrders(id: string): Promise<QueryResult[]> {
    try {
      const conn = await Client.connect()
      let sql = 'SELECT * FROM orders WHERE user_id = ($1) AND status = ($2)'
      let result = await conn.query(sql, [id, 'completed'])
      if (result.rows.length === 0) return result.rows
      //console.log(result.rows)
      const results: QueryResult[] = []
      for (const row of result.rows) {
        //console.log(row.id)
        sql =
          'SELECT name, price, order_id, quantity FROM products INNER JOIN order_products ON products.id = order_products.product_id WHERE order_id = ($1)'
        result = await conn.query(sql, [row.id])
        if (result.rows[0] !== undefined) {
          results.push(result.rows[0])
          //console.log(result.rows[0])
        }
      }
      conn.release()
      return results
    } catch (err) {
      throw new Error(`Unable to list order items: ${err}`)
    }
  }

  async productsByCategory(id: string): Promise<QueryResult[]> {
    try {
      const conn = await Client.connect()
      const sql =
        'SELECT products.name, price, product_categories.name AS category_name FROM product_categories INNER JOIN products ON product_categories.id = products.category_id WHERE category_id = ($1)'
      const results: QueryResult[] = []
      const result = await conn.query(sql, [id])
      if (result.rows.length === 0) return result.rows
      for (const row of result.rows) {
        if (row !== undefined) {
          results.push(row)
        }
      }
      conn.release()
      return results
    } catch (err) {
      throw new Error(`Unable to list products by category: ${err}`)
    }
  }
}
