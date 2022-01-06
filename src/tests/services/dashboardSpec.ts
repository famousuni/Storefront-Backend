import {DashboardQueries} from "../../services/dashboard";
import {Order, OrderStore} from "../../models/order";

const store = new DashboardQueries()
const orderStore = new OrderStore()


describe('Dashboard Service', () => {
    beforeAll( async () => {

        const order: Order = <Order> {
            status: 'active',
            user_id: 1
        }
        const order2: Order = <Order> {
            status: 'active',
            user_id: 1
        }
        const orderClosed: Order = <Order> {
            status: 'completed',
            user_id: 1,
            id: 6
        }
        let result = await orderStore.create(order)
        expect(result).toEqual(jasmine.objectContaining({status: 'active', user_id: '1'}))
        result = await orderStore.create(order2)
        expect(result).toEqual(jasmine.objectContaining({status: 'active', user_id: '1'}))
        const resultCurrent = await orderStore.addProduct(5, '5', '1')
        const resultCompleted = await orderStore.addProduct(5, '6', '1')
        expect(resultCurrent).toEqual(jasmine.objectContaining({id: 3, quantity: 5, product_id: '1', order_id: '5'}))
        expect(resultCompleted).toEqual(jasmine.objectContaining({id: 4, quantity: 5, product_id: '1', order_id: '6'}))
        result = await orderStore.update(orderClosed)
        expect(result).toEqual(jasmine.objectContaining({status: 'completed', user_id: '1'}))
       // console.log(result)



        }
    )
    it('should have a user current order method', () => {
        expect(store.userCurrentOrder).toBeDefined()
    })

    it('should have a user completed order method', () => {
        expect(store.userCompletedOrders).toBeDefined()
    })

    it('User current order should return items in the users cart', async () => {
        const result = await store.userCurrentOrder('1')
        expect(result).toEqual(jasmine.objectContaining({ name: 'testorderproduct1', price: 150, order_id: '2', quantity: 6 })
        )
    })
    it('User completed order should return items in the users cart', async () => {
        const result = await store.userCompletedOrders('1')
        expect(result[0]).toEqual(jasmine.objectContaining({name: 'testorderproduct1', price: 150, order_id: '1', quantity: 1})
        )
    })
    it('Product by category should return a list of products and a 200', async () => {
        const result = await store.productsByCategory('1')
        expect(result[0]).toEqual(jasmine.objectContaining({category_name: 'games'}))
    })
})
