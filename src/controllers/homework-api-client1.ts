import {APIRequestContext} from 'playwright'
import {expect} from "@playwright/test"
import {StatusCodes} from "http-status-codes";

let baseURL: string = 'http://localhost:3000/users'

export class HomeworkApiClient1 {
    static instance: HomeworkApiClient1
    static number: HomeworkApiClient1
    private request: APIRequestContext

    private constructor(request: APIRequestContext) {
        this.request = request
    }

    public static async getInstance(request: APIRequestContext): Promise<HomeworkApiClient1> {
        if (!HomeworkApiClient1.instance) {
            HomeworkApiClient1.instance = new HomeworkApiClient1(request)

        }
        return HomeworkApiClient1.instance
    }

    async createUsers(users: number): Promise<number> {
        for (let i = 0; i < users; i++) {
            let createUsers = await this.request.post(baseURL)
            expect.soft(createUsers.status()).toBe(StatusCodes.CREATED)
            console.log('createUsers status is: ', createUsers.statusText())
        }
        return users
    }

    async deleteUsers(count: number): Promise<void> {
        const response = await this.request.get(`${baseURL}`)
        const responseBody = await response.json()
        const numberOfObjects = responseBody.length
        const usersToDelete = Math.min(count, numberOfObjects)
        let userIDs = []
        for (let i = 0; i < numberOfObjects; i++) {
            let userID = responseBody[i].id;
            userIDs.push(userID)
        }
        for (let i = 0; i < usersToDelete; i++) {
            let response = await this.request.delete(`${baseURL}/${userIDs[i]}`)
            expect.soft(response.status()).toBe(StatusCodes.OK)
            console.log(`Deleted ${usersToDelete} users.`)
        }
    }

    async deleteAllUsers(): Promise<void> {
        const response = await this.request.get(`${baseURL}`)
        const responseBody = await response.json()
        const numberOfObjects = responseBody.length
        let userIDs = [];
        for (let i = 0; i < numberOfObjects; i++) {
            let userID = responseBody[i].id
            userIDs.push(userID);
        }
        for (let i = 0; i < numberOfObjects; i++) {
            let response = await this.request.delete(`${baseURL}/${userIDs[i]}`)
            expect.soft(response.status()).toBe(StatusCodes.OK)
        }
    }

    async getUserDataByIndex(index: number): Promise<any> {
        const response = await this.request.get(`${baseURL}`)
        const responseBody = await response.json()

        const users: any[] = []
        for (let i = 0; i < responseBody.length; i++) {
            let allUsers = responseBody[i]
            users.push(allUsers)
        }

        if (index >= 0 && index < users.length) {
            const selectedUser = users[index]
            console.log(`User at index ${index}:`, selectedUser)
            return selectedUser
        } else {
            console.log('Index out of bounds')
            return null
        }
    }
}