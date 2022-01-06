import supertest from 'supertest'
import app from '../../server'


let adminToken: string

const request = supertest(app)
describe('Testing dashboard API endpoints', () => {
    beforeAll( async () => {
        const user = {"username": "dashadmin", "password": "adminpw", "firstname": "dashadminfirst", "lastname": "dashadminlast", "role": "admin"}
        let res = await request.post('/api/users').send(user).set('Accept', 'application/json')
        expect(res.status).toBe(200)
        adminToken = res.body
    })
    it('[GET] to /api/dashboard/cart should return a list of products in your cart', async () => {
        const res = await request.get('/api/dashboard/cart').set('Authorization', `Bearer ${adminToken}`)
        expect(res.status).toBe(200)
    })
    it('[GET] to /api/dashboard/orders/:id should return a list of products in your cart', async () => {
        const res = await request.get('/api/dashboard/orders/1').set('Authorization', `Bearer ${adminToken}`)
        expect(res.status).toBe(200)
    })
})
