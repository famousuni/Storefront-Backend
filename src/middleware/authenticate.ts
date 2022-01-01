import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization as string
        const token = authorizationHeader.split(' ')[1] as string
        jwt.verify(token, process.env.TOKEN_SECRET as string)
        next()
    } catch (err) {
        res.status(401)
        res.json('Invalid auth token')
    }
}

export const verifyAdminToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization as string
        const token = authorizationHeader.split(' ')[1] as string
        const decodedToken = jwt.decode(token, { json: true })
        //console.log('Decoded Token Role: ', decodedToken?.user.role)
       if (decodedToken?.user.role !== 'admin') throw 'insufficient token role'
        next()
    } catch (err) {
        res.status(401)
        res.json(`Invalid auth token: ${err}`)
    }
}

export const addRole = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization as string
        const token = authorizationHeader.split(' ')[1] as string
        const decodedToken = jwt.decode(token, { json: true })
        //Add role and id to res and pass to next middleware
        res.locals.role = decodedToken?.user.role
        res.locals.id = decodedToken?.user.id
        next()
    } catch (err) {
        res.status(400)
        res.json(`Could not parse role from token: ${err}`)
    }
}


