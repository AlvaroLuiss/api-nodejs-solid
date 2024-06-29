import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance, isAdmim?: boolean) {
    const user = await prisma.user.create({
        data: {
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash: await hash('123456', 6),
            role: isAdmim ? 'ADMIN' : 'MEMBER',
        }
    })

    await request(app.server)
            .post('/users')
            .send({
                name: 'john Doe',
                email: 'johndoe@example.com',
                password: '123456'
            })


        const authResponse = await request(app.server)
            .post('/sessions')
            .send({
                email: 'johndoe@example.com',
                password: '123456'
            })

            const { token } = authResponse.body

            return { token }
}