import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import user_routes from "./handlers/users";
import product_routes from "./handlers/products"
import order_routes from "./handlers/orders";
import dashboard_routes from "./handlers/dashboards";

const app: express.Application = express()
const address = '0.0.0.0:3000'

app.use(bodyParser.json())

app.get('/', function (req: Request, res: Response) {
  res.send('Hello World!')
})

user_routes(app)
product_routes(app)
order_routes(app)
dashboard_routes(app)

app.listen(3000, function () {
  console.log(`starting app on: ${address}`)
})

export default app
