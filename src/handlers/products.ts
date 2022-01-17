import express, { Request, Response } from 'express'
import { Product, ProductStore } from '../models/product'
import { verifyAuthToken, verifyAdminToken } from '../middleware/authenticate'

const store = new ProductStore()

const index = async (_req: Request, res: Response) => {
  try {
    const products = await store.index()
    res.json(products)
  } catch (err) {
    res.status(400)
    res.json(`Error: ${err.message}`)
  }
}

const show = async (req: Request, res: Response) => {
  try {
    const product = await store.show(req.params.id)
    res.json(product)
  } catch (err) {
    res.status(401)
    res.json(`Error: ${err.message}`)
  }
}

const create = async (req: Request, res: Response) => {
  const product: Product = <Product>{
    name: req.body.name,
    price: req.body.price,
    category_id: req.body.category_id,
    description: req.body.description,
    url: req.body.url
  }
  try {
    const newProduct = await store.create(product)
    res.json(newProduct)
  } catch (err) {
    res.status(400)
    res.json(err.message)
  }
}

const createCategory = async (req: Request, res: Response) => {
  try {
    const newCategory = await store.createCategory(req.body.name)
    res.json(newCategory)
  } catch (err) {
    res.status(400)
    res.json(err.message)
  }
}

const product_routes = (app: express.Application) => {
  app.get('/api/products', index)
  app.get('/api/products/:id', show)
  app.post('/api/products', verifyAuthToken, verifyAdminToken, create)
  app.post(
    '/api/products/category',
    verifyAuthToken,
    verifyAdminToken,
    createCategory
  )
}

export default product_routes
