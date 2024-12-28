import {APIRequestContext} from 'playwright'
import {expect} from "@playwright/test"
import {StatusCodes} from "http-status-codes";

let baseURL: string = 'http://localhost:3000/users'

export class LessonApiClient1 {
    static instance: LessonApiClient1
    private request: APIRequestContext

    private constructor(request: APIRequestContext) {
        this.request = request
    }

    public static async getInstance(request: APIRequestContext): Promise<LessonApiClient1> {
        if (!LessonApiClient1.instance) {
            LessonApiClient1.instance = new LessonApiClient1(request)

        }
        return LessonApiClient1.instance
    }

    async createUsers(users: number): Promise<number> {
        for (let i = 0; i < users; i++) {
            let createUsers = await this.request.post(baseURL)
            expect.soft(createUsers.status()).toBe(StatusCodes.CREATED)
            console.log('createUsers status is: ', createUsers.statusText())
        }
        return users
    }

    async deleteUsers(): Promise<void> {
        const response = await this.request.get(`${baseURL}`)
        const responseBody = await response.json()
        const numberOfObjects = responseBody.length
        let userIDs = [];
        for (let i = 0; i < numberOfObjects; i++) {
            let userID = responseBody[i].id;
            userIDs.push(userID);
        }
        for (let i = 0; i < numberOfObjects; i++) {
            let response = await this.request.delete(`${baseURL}/${userIDs[i]}`)
            expect.soft(response.status()).toBe(StatusCodes.OK)
        }
    }
}