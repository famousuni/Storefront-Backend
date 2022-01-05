import {DashboardQueries} from "../../services/dashboard";
import {OrderStore} from "../../models/order";

const store = new DashboardQueries()
const orderStore = new OrderStore()

describe('Dashboard Service', () => {
    beforeAll( async () => {
        const result = await orderStore.addProduct(5, '1', '1')
        //console.log(result)
        expect(result).toEqual(jasmine.objectContaining({id: 1, quantity: 5, product_id: '1', order_id: '1'}))
        }
    )
    it('should have a user current order method', () => {
        expect(store.userCurrentOrder).toBeDefined()
    })

    it('User current order should return items in the users cart', async () => {
        const result = await store.userCurrentOrder('1')
        expect(result).toEqual(jasmine.objectContaining({ name: 'testorderproduct1', price: 150, order_id: '1', quantity: 5 })
        )
    })
})
