import { z } from "zod"
import { FastifyRequest, FastifyReply } from "fastify"
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error"
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case"

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    })

    const { email, password } = authenticateBodySchema.parse(request.body)

    try {
        
        const authenticateUseCase = makeAuthenticateUseCase()

        const { user } = await authenticateUseCase.execute({
            email,
            password,
        })

        const token = await reply.jwtSign(
            {
                role: user.role
            }, 
            {
                sign: {
                    sub: user.id,
                },
            },
        )

        const refreshToken = await reply.jwtSign(
            {
                role: user.role
            }, 
            {
                sign: {
                    sub: user.id,
                    expiresIn: '7d',
                },
            },
        )

        return reply
            .setCookie('refreshToken', refreshToken, {
                path: '/',
                secure: true,   // encripta o cookie através do HTTPS 
                sameSite: true, // cookie só vai ser acessivel dentro do mesmo site
                httpOnly: true  // cookie só vai conseguir ser acessado pelo Back-End da aplicação e nao fica salvo no browser
            })
            .status(200)
            .send({
                token,
        })

    } catch (err) {
        if (err instanceof InvalidCredentialsError) {
            return reply.status(400).send({ message: err.message })
        }

        throw err
    }


}