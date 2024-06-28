import { z } from "zod"
import { FastifyRequest, FastifyReply } from "fastify"
import { makeValidateCheckInUseCase } from "@/use-cases/factories/make-validate-check-in-use-case"

export async function validate(request: FastifyRequest, reply: FastifyReply) {
    const validateCheckInsParamsSchema = z.object({
        checkInId: z.string().uuid(),
    })

    const { checkInId } = validateCheckInsParamsSchema.parse(request.body)

        const validateCheckInUseCase  = makeValidateCheckInUseCase()

        await validateCheckInUseCase.execute({
           checkInId
        })

    return reply.status(204).send()
}