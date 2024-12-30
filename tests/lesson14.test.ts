import {APIRequestContext, test, expect, request as playwrightRequest} from '@playwright/test'
import {StatusCodes} from "http-status-codes"
import {ApiClient} from "../src/controllers/api-client"

let baseURL: string = 'http://localhost:3000/users'
let apiClient: ApiClient
let requestContext: APIRequestContext

test.describe('all tests', () => {
    test.beforeAll(async () => {
        // Init context
        requestContext = await playwrightRequest.newContext({baseURL})
        apiClient = await ApiClient.getInstance(requestContext)
    })

    test.afterAll(async () => {
        // Close context
        await requestContext.dispose()
    })

    test.describe('User management API', () => {
        test.beforeEach(async ({request}) => {
            // get all users
            let response = await request.get(`${baseURL}`)
            let responseBody = await response.json()
            // get the number of objects in the array returned
            let numberOfObjects = responseBody.length

            // create an empty array to store all user ID
            let userIDs = []

            // loop through all users and store their ID in an array
            for (let i = 0; i < numberOfObjects; i++) {
                // get user ID from the response
                let userID = responseBody[i].id
                // push is used to add elements to the end of an array
                userIDs.push(userID)
            }

            // delete all users in a loop using previously created array
            for (let i = 0; i < numberOfObjects; i++) {
                // delete user by id
                let response = await request.delete(`${baseURL}/${userIDs[i]}`)
                // validate the response status code
                expect.soft(response.status()).toBe(StatusCodes.OK)
            }

            // verify that all users are deleted
            let responseAfterDelete = await request.get(`${baseURL}`)
            expect(responseAfterDelete.status()).toBe(StatusCodes.OK)
            let responseBodyEmpty = await responseAfterDelete.text()
            // validate that the response is an empty array
            expect(responseBodyEmpty).toBe('[]')
        })

// Lesson 14

        test('1 POST create n users', async ({request}) => {
            const usersCount = await apiClient.createUsers(1)
            const response = await request.get(baseURL)
            const responseBody = await response.json()
            let numberOfObject = responseBody.length
            console.log(responseBody)
            expect(numberOfObject).toBe(usersCount)
        })

        test('2 DELETE n users', async ({request}) => {
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
        })

        test('3 DELETE m users after creating n users', async ({request}) => {
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
        })
    })
})