import { expect, describe, it, beforeEach, afterEach, vi } from  'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'


let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase


describe('Check-in Use Case', () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
         sut = new CheckInUseCase(checkInsRepository, gymsRepository)

         gymsRepository.items.push({
            id: 'gym-01',
            title: 'JavaScript Gym',
            description: '',
            phone: '',
            latitude: new Decimal(0),
            longitude: new Decimal(0),
        })

         vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })


    it('Should be able to check in', async () => {
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0,
        })

        console.log(checkIn.created_at)

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('Should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0,
        })

        await expect(() => 
            sut.execute({
                gymId: 'gym-01',
                userId: 'user-01',
                userLatitude: 0,
            userLongitude: 0,
            }),
        ).rejects.toBeInstanceOf(Error)
    })


    it('Should be able to check in twice but in the different days', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0,
        })

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

            const { checkIn } = await sut.execute({
                gymId: 'gym-01',
                userId: 'user-01',
                userLatitude: 0,
                userLongitude: 0,
            })

            expect(checkIn.id).toEqual(expect.any(String))

    })
})