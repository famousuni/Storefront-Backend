import supertest from 'supertest'
import app from '../../server'


let adminToken: string

const request = supertest(app)

describe('Testing product API endpoints', () => {
    beforeAll( async () => {
        const user = {"username": "productadmin", "password": "adminpw", "firstname": "productadminfirst", "lastname": "productadminlast", "role": "admin"}
        const res = await request.post('/api/users').send(user).set('Accept', 'application/json')
        expect(res.status).toBe(200)
        adminToken = res.body
        })
    it('[POST] to /api/products should create a new product and return a 200', async () => {
        const product = {"name": "testproduct1", "price": 100, "category": "games"}
        const product2 = {"name": "testproduct2", "price": 200, "category": "games"}
        let res = await request.post('/api/products').send(product).set('Accept', 'application/json').set('Authorization', `Bearer ${adminToken}`)
        expect(res.status).toBe(200)
        res = await request.post('/api/products').send(product2).set('Accept', 'application/json').set('Authorization', `Bearer ${adminToken}`)
        expect(res.status).toBe(200)
    })
    it('[GET] to /api/products should return a list of products', async () => {
        const res = await request.get('/api/products')
        expect(res.status).toBe(200)
        expect(res.body).toEqual([
            { id: 1, name: 'testorderproduct1', price: 150, category: 'games' },
            { id: 2, name: 'testproduct1', price: 100, category: 'games' },
            { id: 3, name: 'testproduct2', price: 200, category: 'games' }
            ])
    })
    it('[GET] to /api/products/:id should return the requested product an a 200', async () => {
        const res = await request.get('/api/products/2')
        expect(res.status).toBe(200)
        expect(res.body).toEqual({ id: 2, name: 'testproduct1', price: 100, category: 'games' })
    })
})
