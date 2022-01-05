import { Product, ProductStore} from "../../models/product";
import { Client } from '../../database'

const store = new ProductStore()

describe('Product Model', () => {
    it('should have an index method', () => {
        expect(store.index).toBeDefined()
    })
    it('should have a show method', () => {
        expect(store.index).toBeDefined()
    })

    it('should have a create method', () => {
        expect(store.index).toBeDefined()
    })
    it('create method should add a product', async () => {
        const product: Product = <Product>{
            name: 'testproduct1',
            price: 100,
            category: 'tools'
        }
        const product2: Product = <Product>{
            name: 'testproduct2',
            price: 200,
            category: 'tools'
        }
        let result = await store.create(product)
        expect(result).toEqual(jasmine.objectContaining({name: 'testproduct1', price: 100, category: 'tools'}))
        result = await store.create(product2)
        expect(result).toEqual(jasmine.objectContaining({name: 'testproduct2', price: 200, category: 'tools'}))

    })
    it('index method should return a list of products', async () => {
        const result = await store.index()
        expect(result[0].name).toEqual('testproduct1')
        expect(result[1].name).toEqual('testproduct2')
    })
    it('show method should return the correct product', async () => {
        const result = await store.show('1')
        expect(result).toEqual(jasmine.objectContaining({id: 1, name: 'testproduct1', price: 100, category: 'tools'}))
    })
})
