
import { FastifyRequest, FastifyReply } from "fastify"


export async function refresh(request: FastifyRequest, reply: FastifyReply) {

    await request.jwtVerify({ onlyCookie: true})

    const { role } = request.user

        const token = await reply.jwtSign(
            { role }, 
            {
                sign: {
                    sub: request.user.sub,
                },
            },
        )

        const refreshToken = await reply.jwtSign(
            { role }, 
            {
                sign: {
                    sub: request.user.sub,
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

    }