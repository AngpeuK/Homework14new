import {test, expect} from '@playwright/test'
import {StatusCodes} from "http-status-codes"

let baseURL: string = 'http://localhost:3000/users'
let userID: number

test.describe('User management API', () => {
    test.beforeAll(async ({request}) => {
        const response = await request.post(`${baseURL}`)
        const body = await response.json()
        userID = body.id
    })

    test('GET /:id - should return a user by ID', async ({request}) => {
        const response = await request.get(`${baseURL}/${userID}`)
        const responseBody = await response.json()
        console.log(responseBody)
        expect(response.status()).toBe(StatusCodes.OK)
    })
    test('GET / - Get all users', async ({request}) => {
        const response = await request.get(`${baseURL}`)
        expect(response.status()).toBe(StatusCodes.OK)
        const responseBody = await response.text()
        if (responseBody === '[]') {
            expect(responseBody).toBe('[]')
        } else {
            expect(responseBody).toBeDefined()
            console.log('Response is not an empty array:', responseBody)
        }
    })

    test('GET /:id - should return 404 if user not found', async ({request}) => {
        const response = await request.get(`${baseURL}/123`)
        expect(response.status()).toBe(StatusCodes.NOT_FOUND)
    })

    test('POST / - should add a new user', async ({request}) => {
        const response = await request.post(`${baseURL}`)
        const body = await response.json()
        expect(response.status()).toBe(StatusCodes.CREATED)
        expect(body.id).toBeDefined()
    })

    test('DELETE /:id - should delete a user by ID', async ({request}) => {
        const response = await request.delete(`${baseURL}/${userID}`)
        const responseBody = await response.json()
        expect(response.status()).toBe(StatusCodes.OK)
        console.log('Created user ID: ', userID)
        const compareUsers = responseBody.find((user: { id: number }) => user.id === userID)
        console.log('Deleted user ID: ', compareUsers.id)
        const Getresponse = await request.get(`${baseURL}/${userID}`)

        if (Getresponse.status() === StatusCodes.NOT_FOUND) {
            console.log('Got 404, user deleted successfully')
        } else {
            const GetresponseBody = await Getresponse.json()
            console.log('User still exists: ', GetresponseBody)
            if (Getresponse.status() !== StatusCodes.OK) {
                expect(Getresponse.status()).toBe(StatusCodes.NOT_FOUND)
                expect(GetresponseBody).toHaveProperty('message')
                expect(GetresponseBody.message).toBe('User not found')
                expect(typeof GetresponseBody.message).toBe('string')
            }
        }
    })

    test('DELETE /:id - should delete a user by ID Lesson Version', async ({request}) => {
        const response = await request.delete(`${baseURL}/${userID}`)
        const responseBody = await response.json()
        if (response.status() !== StatusCodes.NOT_FOUND) {
            expect(response.status()).toBe(StatusCodes.OK)
            expect(responseBody[0].id).toBe(userID)
        }
    })

    test('DELETE /:id - should return 404 if user not found', async ({request}) => {
        const response = await request.delete(`${baseURL}/123`)
        expect(response.status()).toBe(StatusCodes.NOT_FOUND)
    })
})
