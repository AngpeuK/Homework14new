import {test, expect, APIRequestContext} from '@playwright/test'
import {ApiClient} from "../src/controllers/api-client"
import {request as playwrightRequest} from "playwright-core"
import {StatusCodes} from "http-status-codes"

let baseURL: string = 'http://localhost:3000/users'
let apiClient: ApiClient
let requestContext: APIRequestContext

const getUsersCount = async (request: APIRequestContext): Promise<number> => {
    const response = await request.get(baseURL)
    expect(response.status()).toBe(StatusCodes.OK)
    const responseBody = await response.json()
    return responseBody.length
}

test.describe('all tests', () => {
    // Init new context
    test.beforeAll(async () => {
        requestContext = await playwrightRequest.newContext({baseURL})
        apiClient = await ApiClient.getInstance(requestContext)
    })
    // Delete all users
    test.beforeEach(async ({request}) => {
        await apiClient.deleteAllUsers(request)
    })
    // Close context
    test.afterAll(async () => {
        await requestContext.dispose()
    })


    test.describe('homework 14 tests', () => {
        test('1 POST n users', async ({request}) => {
            const usersCount = await apiClient.createUsers(20)
            const actualUsersCount = await getUsersCount(request)
            expect(actualUsersCount).toBe(usersCount)
        })

        test('2 Get user data by ID (using index)', async ({request}) => {
            const usersCount = await apiClient.createUsers(20)
            const actualUsersCount = await getUsersCount(request)
            expect(actualUsersCount).toBe(usersCount)
            const userData = await apiClient.getUserDataByIndex(2)

            if (userData) {
                expect(userData).toHaveProperty('id')
                expect(userData).toHaveProperty('name')
                expect(userData).toHaveProperty('email')
                expect(userData).toHaveProperty('phone')
                console.log(userData)
            } else {
                console.log('No user found or invalid index.')
            }
        })

        test('3 DELETE users', async ({request}) => {
            const usersCount = await apiClient.createUsers(20)
            const actualUsersCount = await getUsersCount(request)
            expect(actualUsersCount).toBe(usersCount)
            //delete
            await apiClient.deleteUsers(2)
            console.log(usersCount)
        })
    })
})