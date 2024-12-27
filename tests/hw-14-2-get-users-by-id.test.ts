import {test, expect} from '@playwright/test'
import {HomeworkApiClient} from "../src/controllers/homework-api-client";


test.describe('homework-14-2', () => {
    test('Get user data by ID (using index)', async ({request}) => {
        const apiClient = await HomeworkApiClient.getInstance(request)
        await apiClient.createUsers(20)
        const userData = await apiClient.getUserDataByIndex(2)

        if (userData) {
            expect(userData).toHaveProperty('id')
            expect(userData).toHaveProperty('name')
            expect(userData).toHaveProperty('email')
            expect(userData).toHaveProperty('phone')
            console.log(userData)
            await apiClient.deleteAllUsers()
        } else {
            console.log('No user found or invalid index.')
            await apiClient.deleteAllUsers()
        }
        await apiClient.deleteAllUsers()
    })
})
