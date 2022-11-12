const pool = require('../../database/postgres/pool')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('./../../../../tests/UsersTableTestHelper')
const CommentsTableTestHelper = require('./../../../../tests/CommentsTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

describe('/threads endpoint', () => {
    afterAll(async () => {
        await pool.end()
    })

    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable()
        await ThreadsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
    })

    describe('when POST /threads', () => {
        it('should response 401 when request payload not contain access token', async() => {
            // Arrange
            const server = await createServer(container)

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {},
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(401)
            expect(responseJson.error).toEqual('Unauthorized')
            expect(responseJson.message).toEqual('Missing authentication')
        })

        it('should response 400 when request payload not contain needed property', async () => {
            // Arrange
            const loginPayload = {
                username: 'dicoding',
                password: 'dicoding123'
            }

            const requestPayload = {
                title: 'Thread Title',
            }
            const server = await createServer(container)

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding',
                    password: 'dicoding123',
                    fullname: 'Dicoding Indonesia'
                }
            })

            const authentication = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginPayload
            })

            const responseAuthJson = JSON.parse(authentication.payload)

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}`}
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada')
        })

        it('should response 400 when reauest payload not meet data type specification', async () => {
           // Arrange
           const loginPayload = {
            username: 'dicoding',
            password: 'dicoding123'
        }

        const requestPayload = {
            title: 'Thread Title',
            body: ['Thread Body']
        }
        const server = await createServer(container)

        await server.inject({
            method: 'POST',
            url: '/users',
            payload: {
                username: 'dicoding',
                password: 'dicoding123',
                fullname: 'Dicoding Indonesia'
            }
        })

        const authentication = await server.inject({
            method: 'POST',
            url: '/authentications',
            payload: loginPayload
        })

        const responseAuthJson = JSON.parse(authentication.payload)

        // Action
        const response = await server.inject({
            method: 'POST',
            url: '/threads',
            payload: requestPayload,
            headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}`}
        })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai')
        })

        it('should response 201 and persisted thread', async () => {
            // Arrange
            const loginPayload = {
                username: 'dicoding',
                password: 'dicoding123'
            }

            const requestPayload = {
                title: 'Thread Title',
                body: 'Thread Body'
            }
            const server = await createServer(container)

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding',
                    password: 'dicoding123',
                    fullname: 'Dicoding Indonesia'
                }
            })

            const authentication = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginPayload
            })

            const responseAuthJson = JSON.parse(authentication.payload)

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}`}
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(201)
            expect(responseJson.status).toEqual('success')
            expect(responseJson.data.addedThread).toBeDefined()
        })
    })

    describe('when GET /threads/{threadId}', () => {
        it('should response 404 when thread id not valid', async () => {
            // Arrange
            const loginPayload = {
                username: 'dicoding',
                password: 'dicoding123'
            }

            const threadPayload = {
                title: 'Thread Title',
                body: 'Thread Body'
            }

            const repuestPayload = {
                content: 'Comment'
            }

            const server = await createServer(container)

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding',
                    password: 'dicoding123',
                    fullname: 'Dicoding Indonesia'
                }
            })

            const authentication = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginPayload
            })

            const responseAuthJson = JSON.parse(authentication.payload)

            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: threadPayload,
                headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}`}
            })

            const responsethreadJson = JSON.parse(thread.payload)

            await server.inject({
                method: 'POST',
                url: `/threads/${responsethreadJson.data.addedThread.id}/comments`,
                payload: repuestPayload,
                headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}`}
            })


            // Action
            const response = await server.inject({
                method: 'GET',
                url: '/threads/fakeThreadId'
            })

            // Asssert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(404)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('thread tidak ditemukan')
        })

        it('should response 200 and return detail thread correctly', async () => {
            // Arrange
            const loginPayload = {
                username: 'dicoding',
                password: 'dicoding123'
            }

            const threadPayload = {
                title: 'Thread Title',
                body: 'Thread Body'
            }

            const requestPayload = {
                content: 'Comment',
            }
            const server = await createServer(container)

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding',
                    password: 'dicoding123',
                    fullname: 'Dicoding Indonesia'
                }
            })

            const authentication = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginPayload
            })

            const responseAuthJson = JSON.parse(authentication.payload)

            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: threadPayload,
                headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}`}
            })

            const responsethreadJson = JSON.parse(thread.payload)

            await server.inject({
                method: 'POST',
                url: `/threads/${responsethreadJson.data.addedThread.id}/comments`,
                payload: requestPayload,
                headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}`}
            })

            // Action
            const response = await server.inject({
                method: 'GET',
                url: `/threads/${responsethreadJson.data.addedThread.id}`,
                headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}`}
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(200)
            expect(responseJson.status).toEqual('success')
            expect(responseJson.data.thread.id).toEqual(responsethreadJson.data.addedThread.id)
            expect(responseJson.data.thread.title).toEqual(responsethreadJson.data.addedThread.title)
            expect(responseJson.data.thread.body).toEqual('Thread Body')
            expect(responseJson.data.thread.username).toEqual('dicoding')
            expect(Array.isArray(responseJson.data.thread.comments)).toBe(true)
        })
    })
})