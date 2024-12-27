import {test} from '@playwright/test'
import {HomeworkApiClient} from "../src/controllers/homework-api-client";

test.describe('homework-14', () => {

    test('DELETE users', async ({request}) => {
        const apiClient = await HomeworkApiClient.getInstance(request)
        await apiClient.deleteAllUsers()
        const usersCount = await apiClient.createUsers(20)
        console.log(usersCount)
        //delete
        await apiClient.deleteUsers(2)
        console.log(usersCount)
    })
})
