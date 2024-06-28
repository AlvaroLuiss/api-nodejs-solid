import { FastifyInstance } from "fastify";
import { register } from "./register";
import { authenticate } from "./authenticate";
import { profile } from "./profile";
import { verifyJWT } from "@/http/middlewares/verify-jwt";


export async function usersRoutes(app: FastifyInstance) {
    app.post('/users', register)

    
    app.post('/sessions', authenticate)


    /** Rotas que só poderão ser chamadas com o usuário autenticado */
    app.get('/me',{ onRequest: [verifyJWT] }, profile)
}