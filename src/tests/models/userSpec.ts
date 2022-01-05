import { User, UserStore} from "../../models/user";
import { Client } from '../../database'

const store = new UserStore()

describe('User Model', () => {
    it('should have an index method', () => {
        expect(store.index).toBeDefined()
    })
    it('should have a show method', () => {
        expect(store.index).toBeDefined()
    })

    it('should have a create method', () => {
        expect(store.index).toBeDefined()
    })

    it('should have a update method', () => {
        expect(store.index).toBeDefined()
    })
    it('create method should add a user', async () => {
        const user: User = <User>{
            username: 'testuser',
            password: 'testpassword',
            firstname: 'testfirstname',
            lastname: 'testlastname',
            role: 'admin'
        }
        const user2: User = <User>{
            username: 'testuser2',
            password: 'testpassword2',
            firstname: 'testfirstname2',
            lastname: 'testlastname2',
            role: 'customer'
        }
        let result = await store.create(user)
        expect(result).toEqual(jasmine.objectContaining({username: 'testuser', role: 'admin'}))
        result = await store.create(user2)
        expect(result).toEqual(jasmine.objectContaining({ username: 'testuser2', role: 'customer'}))
    })
    it('index method should return a list of users', async () => {
        const result = await store.index()
        expect(result[0].firstname).toEqual('testfirstname')
        expect(result[1].firstname).toEqual('testfirstname2')
    })
    it('show method should return the correct user', async () => {
        const result = await store.show('4')
        expect(result).toEqual(jasmine.objectContaining({id: 4, username: 'testuser', 'role': 'admin'}))
    })
    it('update method should update the correct user', async () => {
        const user: User = <User>{
            id: 5,
            username: 'testuser2',
            password: 'testpassword2',
            firstname: 'updatedfirstname',
            lastname: 'testlastname2',
            role: 'customer'
        }
        const result = await store.update(user)
        expect(result).toEqual(jasmine.objectContaining({id: 5, username: 'testuser2', firstname: 'updatedfirstname', lastname: 'testlastname2', 'role': 'customer'}))
    })
    it('authenticate should return a user object if successful', async () => {
        const result = await store.authenticate('testuser2', 'testpassword2')
        expect(result).toEqual(jasmine.objectContaining({id: 5, username: 'testuser2', role: 'customer'}))
    })
    afterAll( async () => {
        //cleanup users in testing db
        const conn = await Client.connect()
        const sql = 'DELETE FROM users '
        await conn.query(sql)
        conn.release()
    })
})
