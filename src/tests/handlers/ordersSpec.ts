import supertest from 'supertest'
import app from '../../server'

let adminToken: string

const request = supertest(app)

describe('Testing order API endpoints', () => {
    beforeAll( async () => {
        const user = {"username": "orderadmin", "password": "adminpw", "firstname": "orderadminfirst", "lastname": "orderadminlast", "role": "admin"}
        let res = await request.post('/api/users').send(user).set('Accept', 'application/json')
        expect(res.status).toBe(200)
        adminToken = res.body
        const product = {"name": "testorderproduct1", "price": 150, "category": "games"}
        res = await request.post('/api/products').send(product).set('Accept', 'application/json').set('Authorization', `Bearer ${adminToken}`)
        expect(res.status).toBe(200)
    })
    it('[POST] to /api/orders should create a new order and return a 200', async () => {
        const order = {'status': 'open', 'user_id': '1'}
        const order2 = {'status': 'open', 'user_id': '1'}
        let res = await request.post('/api/orders').send(order).set('Accept', 'application/json').set('Authorization', `Bearer ${adminToken}`)
        expect(res.status).toBe(200)
        res = await request.post('/api/orders').send(order2).set('Accept', 'application/json').set('Authorization', `Bearer ${adminToken}`)
        expect(res.status).toBe(200)

    })
    it('[GET] to /api/orders should return a 200 and list of orders', async () => {
        const res = await request.get('/api/orders').set('Authorization', `Bearer ${adminToken}`)
        expect(res.status).toBe(200)
    })
    it('[GET] to /api/orders/:id should return a 200 and the requested order', async () => {
        const res = await request.get('/api/orders/1').set('Authorization', `Bearer ${adminToken}`)
        expect(res.status).toBe(200)
        expect(res.body).toEqual({ id: 1, status: 'open', user_id: '1' }
        )
    })
    it('[POST] to /api/orders/:id/products should add a product to an order and return a 200', async () => {
        const product_order = {'order_id': '1', 'product_id': '1', 'quantity': 1}
        const res = await request.post('/api/orders/1/products').send(product_order).set('Accept', 'application/json').set('Authorization', `Bearer ${adminToken}`)
        expect(res.status).toBe(200)
        expect(res.body).toEqual({ id: 1, quantity: 1, order_id: '1', product_id: '1' }
        )
    })
})
