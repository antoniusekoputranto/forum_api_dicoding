const pool = require('../../database/postgres/pool')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

describe('/threads/{threadId}/comments endpoint', () => {
    afterAll(async () => {
        await pool.end()
    })

    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable()
        await ThreadsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
    })

    describe('when POST /threads/{threadId}/comments', () => {
        it('should response 401 when request payload not contain access token', async () => {
            // Arrange
            const server = await createServer(container)

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
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

            const threadPayload = {
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

            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: threadPayload,
                headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}`}
            })

            const responsethreadJson = JSON.parse(thread.payload)

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${responsethreadJson.data.addedThread.id}/comments`,
                payload: {},
                headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}`}
            })

            // Asssert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada')
        })

        it('should response 400 when request payload not meet data type specification', async () => {
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
                content: ['Comment']
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

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${responsethreadJson.data.addedThread.id}/comments`,
                payload: repuestPayload,
                headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}`}
            })

            // Asssert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena tipe data tidak sesuai')
        })

        it('should response 404 when thread id not valid', async () => {
            // Arrange
            const loginPayload = {
                username: 'dicoding',
                password: 'dicoding123'
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

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/fakeThreadId/comments',
                payload: repuestPayload,
                headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}`}
            })

            // Asssert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(404)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('thread tidak ditemukan')
        })

        it('should response 201 and persist comment', async () => {
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

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${responsethreadJson.data.addedThread.id}/comments`,
                payload: requestPayload,
                headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}`}
            })

            // Asssert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(201)
            expect(responseJson.status).toEqual('success')
            expect(responseJson.data.addedComment).toBeDefined()
        })
    })

    describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
        it('should response  401 when request payload not contain access token', async () => {
            // Arrange
            const server = await createServer(container)

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-123',
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(401)
            expect(responseJson.error).toEqual('Unauthorized')
            expect(responseJson.message).toEqual('Missing authentication')
        })

        it('should throw 404 when thread or comment id not valid', async () => {
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
               method: 'DELETE',
               url: `/threads/${responsethreadJson.data.addedThread.id}/comments/fakeThreadId`,
               headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}`}
           })

           // Assert
           const responseJson = JSON.parse(response.payload)
           expect(response.statusCode).toEqual(404)
           expect(responseJson.status).toEqual('fail')
           expect(responseJson.message).toEqual('komentar tidak ditemukan')
       })

        it('should response 403 when try to delete another user comment', async () => {
            // Arrange
            const loginPayloadDicoding = {
                username: 'dicoding',
                password: 'dicoding123'
            }

            const loginPayloadJohn = {
                username: 'johnDoe',
                password: 'john123'
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

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'johnDoe',
                    password: 'john123',
                    fullname: 'John Doe'
                }
            })

            const authenticationDicoding = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginPayloadDicoding
            })

            const responseAuthDicodingJson = JSON.parse(authenticationDicoding.payload)

            const authenticationJohn = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginPayloadJohn
            })

            const responseAuthJohnJson = JSON.parse(authenticationJohn.payload)

            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: threadPayload,
                headers: { Authorization: `Bearer ${responseAuthDicodingJson.data.accessToken}`}
            })

            const responsethreadJson = JSON.parse(thread.payload)

            const responseComment = await server.inject({
                method: 'POST',
                url: `/threads/${responsethreadJson.data.addedThread.id}/comments`,
                payload: requestPayload,
                headers: { Authorization: `Bearer ${responseAuthJohnJson.data.accessToken}`}
            })

            const responseCommentJson = JSON.parse(responseComment.payload)

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${responsethreadJson.data.addedThread.id}/comments/${responseCommentJson.data.addedComment.id}`,
                headers: { Authorization: `Bearer ${responseAuthDicodingJson.data.accessToken}`}
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(403)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('Unauthorized')
        })

        it('should response 200 when delete success', async () => {
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

            const responseComment = await server.inject({
                method: 'POST',
                url: `/threads/${responsethreadJson.data.addedThread.id}/comments`,
                payload: requestPayload,
                headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}`}
            })

            const responseCommentJson = JSON.parse(responseComment.payload)

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${responsethreadJson.data.addedThread.id}/comments/${responseCommentJson.data.addedComment.id}`,
                headers: { Authorization: `Bearer ${responseAuthJson.data.accessToken}`}
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(200)
            expect(responseJson.status).toEqual('success')
        })
    })
})