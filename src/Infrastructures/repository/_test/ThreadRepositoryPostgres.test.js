const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CreateThread = require('../../../Domains/threads/entities/CreateThread')
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread')
const pool = require('../../database/postgres/pool')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')

describe('ThreadRepositoryPostgres', () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
    })

    afterAll(async () => {
        await pool.end()
    })

    describe('addThread function', () => {
        it('should persist create thread', async() => {
            // Arrange
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'dicoding',
                fullname: 'Dicoding Indonesia',
                password: 'dicoding123'
            })

            const createThread = new CreateThread({
                title: 'Thread Title',
                body: 'Thread Body that user write',
                owner: 'user-123'
            })

            const fakeIdGenerator = () => '123'
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

            // Action
            await threadRepositoryPostgres.addThread(createThread)

            // Assert
            const threads = await ThreadsTableTestHelper.findThreadById('thread-123')
            expect(threads).toHaveLength(1)
        })

        it('should return created thread correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'dicoding',
                fullname: 'Dicoding Indonesia',
                password: 'dicoding123'
            })

            const createThread = new CreateThread({
                title: 'Thread Title',
                body: 'Thread Body that user write',
                owner: 'user-123'
            })
            const fakeIdGenerator = () => '123'
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

            // Action
            const createdThread = await threadRepositoryPostgres.addThread(createThread)

            // Assert
            expect(createdThread).toStrictEqual(new CreatedThread({
                id: 'thread-123',
                title: createThread.title,
                owner: createThread.owner,
            }))
        })
    })

    describe('verifyThreadAvaibility function', () => {
        it('should throw NotFoundError when thread not found', async () => {
            // Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})
            const id = 'fakeThreadId'

            // Actio and Assert
            await expect(threadRepositoryPostgres.verifyThreadAvaibility(id))
                .rejects.toThrowError(NotFoundError)
        })

        it('should not throw NotFoundError when thread found', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'dicoding',
                fullname: 'Dicoding Indonesia',
                password: 'dicoding123'
            })

            await ThreadsTableTestHelper.addThreads({
                id: 'thread-123',
                title: 'Thread Title',
                body: 'Thread Body',
                owner: 'user-123'
            })

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

            // Action and Assert
            await expect(threadRepositoryPostgres.verifyThreadAvaibility('thread-123'))
                .resolves.not.toThrow(NotFoundError)
        })
    })

    describe('getDetailThread function', () => {
        it('should return detail thread', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'dicoding',
                fullname: 'Dicoding Indonesia',
                password: 'dicoding123'
            })

            const testDate = new Date().toISOString();
            await ThreadsTableTestHelper.addThreads({
                id: 'thread-123',
                title: 'Thread Title',
                body: 'Thread Body',
                owner: 'user-123',
                date: testDate,
            })

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

            // Action
            const threadDetail = await threadRepositoryPostgres.getDetailThread('thread-123')

            // Assert
            expect(threadDetail).toStrictEqual({
                id: 'thread-123',
                title: 'Thread Title',
                body: 'Thread Body',
                date: testDate,
                username: 'dicoding',
            });

        })
    })
})