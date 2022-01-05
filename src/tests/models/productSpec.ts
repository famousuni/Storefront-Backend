import { Product, ProductStore} from "../../models/product";

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
    it('create method should create and return a product', async () => {
        const product: Product = <Product>{
            name: 'testproduct3',
            price: 300,
            category: 'tools'
        }
        const product2: Product = <Product>{
            name: 'testproduct4',
            price: 400,
            category: 'tools'
        }
        let result = await store.create(product)
        expect(result).toEqual(jasmine.objectContaining({name: 'testproduct3', price: 300, category: 'tools'}))
        result = await store.create(product2)
        expect(result).toEqual(jasmine.objectContaining({name: 'testproduct4', price: 400, category: 'tools'}))

    })
    it('index method should return a list of products', async () => {
        const result = await store.index()
        expect(result[3].name).toEqual('testproduct3')
        expect(result[4].name).toEqual('testproduct4')
    })
    it('show method should return the correct product', async () => {
        const result = await store.show('4')
        expect(result).toEqual(jasmine.objectContaining({id: 4, name: 'testproduct3', price: 300, category: 'tools'}))
    })
})
