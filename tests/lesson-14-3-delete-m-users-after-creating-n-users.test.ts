import {test, expect} from '@playwright/test'
import {StatusCodes} from "http-status-codes"
import {LessonApiClient} from "../src/controllers/lesson-api-client"

let baseURL: string = 'http://localhost:3000/users'


test.describe('User management API', () => {
//
// Lesson 14-3
//
    test('DELETE m users after creating n users', async ({request}) => {
        const apiClient = await LessonApiClient.getInstance(request)
        await apiClient.deleteUsers()
        const usersCount = await apiClient.createUsers(10)
        let userIDs = []
        const response = await request.get(`${baseURL}`)
        const responseBody = await response.json()
        for (let i = 0; i < usersCount; i++) {
            let userID = responseBody[i].id
            userIDs.push(userID)
        }
        let subtraction: number = 4
        for (let i = 0; i < subtraction; i++) {
            await request.delete(`${baseURL}/${userIDs[i]}`)
            // validate the response status code
            expect.soft(response.status()).toBe(StatusCodes.OK)
        }
        const expectResponse = await request.get(`${baseURL}`)
        const expectResponseBody = await expectResponse.json()
        expect(expectResponseBody.length).toBe(usersCount - subtraction)
        await apiClient.deleteUsers()
    })
})
