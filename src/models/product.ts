import { Client } from '../database'

export type Product = {
  id: number
  name: string
  price: number
  category_id: number
}

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await Client.connect()
      const sql = 'SELECT * FROM products'
      const result = await conn.query(sql)
      conn.release()
      return result.rows
    } catch (err) {
      console.log(err)
      throw new Error('Cannot get products')
    }
  }

  async show(id: string): Promise<Product> {
    try {
      const conn = await Client.connect()
      const sql = 'SELECT * FROM products WHERE id=($1)'
      const result = await conn.query(sql, [id])
      conn.release()
      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not find product ${id}. Error: ${err}`)
    }
  }

  async create(p: Product): Promise<Product> {
    try {
      const conn = await Client.connect()
      const sql =
        'INSERT INTO products (name, price, category_id) VALUES ($1, $2, $3) RETURNING *'
      const result = await conn.query(sql, [p.name, p.price, p.category_id])
      const product = result.rows[0]
      conn.release()
      return product
    } catch (err) {
      throw new Error(`Could not add new product ${p.name}. Error ${err}`)
    }
  }
  async createCategory(name: string): Promise<{ id: string; name: string }> {
    try {
      const conn = await Client.connect()
      const sql =
        'INSERT INTO product_categories (name) VALUES ($1) RETURNING *'
      const result = await conn.query(sql, [name])
      const category = result.rows[0]
      conn.release()
      return category
    } catch (err) {
      throw new Error(`Could not add new category ${name}. Error ${err}`)
    }
  }
}
