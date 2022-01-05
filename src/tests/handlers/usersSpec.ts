import supertest from 'supertest'
import app from '../../server'
import { Client } from '../../database'

let customerToken: string
let adminToken: string

const request = supertest(app)

describe('Testing user API endpoints', () => {
    it('[POST] to /api/users should create a customer user and return a 200 and JWT', async () => {
        const user = {"username": "testcustomer", "password": "testcustomerpw", "firstname": "testfirstname", "lastname": "testlastname", "role": "customer"}
        const res = await request.post('/api/users').send(user).set('Accept', 'application/json')
        expect(res.status).toBe(200)
        customerToken = res.body
    })
    it('[POST] to /api/users should create an admin user and return a 200 and JWT', async () => {
        const user = {"username": "testadmin", "password": "testadminpassword", "firstname": "testadminfirstname", "lastname": "testadminlastname", "role": "admin"}
        const res = await request.post('/api/users').send(user).set('Accept', 'application/json')
        expect(res.status).toBe(200)
        adminToken = res.body
    })
    it('[GET] to /api/users should return a 401 if you are a customer', async () => {
        const res = await request.get('/api/users').set('Authorization', `Bearer ${customerToken}`)
        expect(res.status).toBe(401)

    })
    it('[GET] to /api/users should return a 200 and list of users if you are an admin', async () => {
        const res = await request.get('/api/users').set('Authorization', `Bearer ${adminToken}`)
        expect(res.status).toBe(200)
    })
    it('[GET] to /api/users/:id should get the user information for the id presented and return a 200', async ()=> {
        const res = await request.get('/api/users/3').set('Authorization', `Bearer ${customerToken}`)
        expect(res.status).toBe(200)
        expect(res.body).toEqual(jasmine.objectContaining({'id': 3, 'username': 'testcustomer', 'firstname': 'testfirstname', 'lastname': 'testlastname', 'role': 'customer'}))
    })
    it('[GET] to /api/users/:id to another user id should return 401 if not admin', async ()=> {
        const res = await request.get('/api/users/4').set('Authorization', `Bearer ${customerToken}`)
        expect(res.status).toBe(401)
    })
    it('[GET] to /api/users/:id to another user id should return 200 if admin', async ()=> {
        const res = await request.get('/api/users/3').set('Authorization', `Bearer ${adminToken}`)
        expect(res.status).toBe(200)
    })
    it('[PUT] to /api/users/:id should update your user and return a 200 and user object', async () => {
        const user = {"username": "testcustomer", "password": "testcustomerpw", "firstname": "custupdatedfirstname", "lastname": "testlastname", "role": "customer"}
        const res = await request.put('/api/users/3').send(user).set('Accept', 'application/json').set('Authorization', `Bearer ${customerToken}`)
        expect(res.status).toBe(200)
        expect(res.body).toEqual(jasmine.objectContaining({'id': 3, 'username': 'testcustomer', 'firstname': 'custupdatedfirstname', 'lastname': 'testlastname', 'role': 'customer'}))

    })
    it('[PUT] to /api/users/:id should return a 401 if customer is attempting to alter another user', async () => {
        const user = {"username": "testcustomer", "password": "testcustomerpw", "firstname": "custupdatedfirstname", "lastname": "testlastname", "role": "customer"}
        const res = await request.put('/api/users/4').send(user).set('Accept', 'application/json').set('Authorization', `Bearer ${customerToken}`)
        expect(res.status).toBe(401)
    })
    it('[PUT] to /api/users/:id by admin can update any user and return a 200 and the user object', async () => {
        const user = {"username": "testcustomer", "password": "testcustomerpw", "firstname": "custupdatedfirstname", "lastname": "adminupdatedlastname", "role": "customer"}
        const res = await request.put('/api/users/3').send(user).set('Accept', 'application/json').set('Authorization', `Bearer ${customerToken}`)
        expect(res.status).toBe(200)
        expect(res.body).toEqual(jasmine.objectContaining({'id': 3, 'username': 'testcustomer', 'firstname': 'custupdatedfirstname', 'lastname': 'adminupdatedlastname', 'role': 'customer'}))

    })
    it('[POST] to /api/login should return a 200 and JWT', async () => {
        const user = {"username": "testadmin", "password": "testadminpassword"}
        const res = await request.post('/api/login').send(user).set('Accept', 'application/json')
        expect(res.status).toBe(200)
        expect(res.body).toBeTruthy()
    })
    //afterAll( async () => {
        //cleanup users in testing db
      //  const conn = await Client.connect()
        //const sql = 'DELETE FROM users '
        //await conn.query(sql)
        //conn.release()
    //})
})
