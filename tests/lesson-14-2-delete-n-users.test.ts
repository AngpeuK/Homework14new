import {test, expect} from '@playwright/test'
import {StatusCodes} from "http-status-codes"
import {LessonApiClient} from "../src/controllers/lesson-api-client"

let baseURL: string = 'http://localhost:3000/users'


test.describe('User management API', () => {
//
// Lesson 14-2
//
    test('DELETE n users', async ({request}) => {
        const apiClient = await LessonApiClient.getInstance(request)
        await apiClient.deleteUsers()
        const usersCount = await apiClient.createUsers(1)
        let userIDs = []
        const response = await request.get(`${baseURL}`)
        const responseBody = await response.json()
        // get the number of objects in the array returned
        const numberOfObjects = responseBody.length
        // loop through all users and store their ID in an array
        for (let i = 0; i < usersCount; i++) {
            // get user ID from the response
            let userID = responseBody[i].id
            // push is used to add elements to the end of an array
            userIDs.push(userID)
        }
        for (let i = 0; i < numberOfObjects; i++) {
            // delete user by id
            let response = await request.delete(`${baseURL}/${userIDs[i]}`)
            // validate the response status code
            expect.soft(response.status()).toBe(StatusCodes.OK)
        }
        const expectResponse = await request.get(`${baseURL}`)
        const expectResponseBody = await expectResponse.json()
        expect(expectResponseBody).toStrictEqual([])
        await apiClient.deleteUsers()
    })
})
