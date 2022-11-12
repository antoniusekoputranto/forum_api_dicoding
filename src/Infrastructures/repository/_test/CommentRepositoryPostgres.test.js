const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const CreateComment = require('../../../Domains/comments/entities/CreateComment')
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment')
const pool = require('../../database/postgres/pool')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')

describe('CommentRepositoryPostgres', () => {
    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable()
        await ThreadsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
    })

    afterAll(async () => {
        await pool.end()
    })

    describe('addComment function', () => {
        it('should persist create comment', async() => {
            // Arrange
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'dicoding',
                fullname: 'Dicoding Indonesia',
                password: 'dicoding123 '
            })

            await ThreadsTableTestHelper.addThreads({
                id: 'thread-123',
                title: 'Thread Title',
                body: 'Thread Body',
                owner: 'user-123'
            })

            const createComment = new CreateComment({
                content: 'Comment',
                thread: 'thread-123',
                owner: 'user-123'
            })

            const fakeIdGenerator = () => '123'
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

            // Action
            await commentRepositoryPostgres.addComment(createComment)

            // Assert
            const comments = await CommentsTableTestHelper.findCommentsById('comment-123')
            expect(comments).toHaveLength(1)
        })

        it('should return created comment correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'dicoding',
                fullname: 'Dicoding Indonesia',
                password: 'dicoding123 '
            })

            await ThreadsTableTestHelper.addThreads({
                id: 'thread-123',
                title: 'Thread Title',
                body: 'Thread Body',
                owner: 'user-123'
            })

            const createComment = new CreateComment({
                content: 'Comment',
                thread: 'thread-123',
                owner: 'user-123'
            })
            const fakeIdGenerator = () => '123'
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

            // Action
            const createdComment = await commentRepositoryPostgres.addComment(createComment)

            // Assert
            expect(createdComment).toStrictEqual(new CreatedComment({
                id: 'comment-123',
                content: createComment.content,
                owner: createComment.owner,
            }))
        })
    })

    describe('verifyCommentAvaibility function', () => {
        it('should throw NotFoundError when comment not found', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})
            const id = 'commentFakeId'

            // Action and Assert
            await expect(commentRepositoryPostgres.verifyCommentAvaibility(id))
                .rejects.toThrowError(NotFoundError)
        })

        it('should not throw NotFoundError when comment found', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'dicoding',
                fullname: 'Dicoding Indonesia',
                password: 'dicoding123 '
            })
            await ThreadsTableTestHelper.addThreads({
                id: 'thread-123',
                title: 'Thread Title',
                body: 'Thread Body',
                owner: 'user-123'
            })

            await CommentsTableTestHelper.addComments({
                id: 'comment-123',
                content: 'Comment',
                thread: 'thread-123',
                owner: 'user-123'
            })

            // Action and Assert
            await expect(commentRepositoryPostgres.verifyCommentAvaibility('comment-123'))
                .resolves.not.toThrow(NotFoundError)
        })
    })

    describe('verifyCommentOwner function', () => {
        it('should throw AuthorizationError if comment accessed by wrong owner', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'dicoding',
                fullname: 'Dicoding Indonesia',
                password: 'dicoding123 '
            })

            await ThreadsTableTestHelper.addThreads({
                id: 'thread-123',
                title: 'Thread Title',
                body: 'Thread Body',
                owner: 'user-123'
            })

            await CommentsTableTestHelper.addComments({
                id: 'comment-123',
                content: 'Comment',
                thread: 'thread-123',
                owner: 'user-123'
            })

            // Action and Assert
            expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'fakeOwnerId'))
                .rejects.toThrowError(AuthorizationError)
        })

        it('should not throw AuthorizationError if comment accessed its owner', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'dicoding',
                fullname: 'Dicoding Indonesia',
                password: 'dicoding123 '
            })

            await ThreadsTableTestHelper.addThreads({
                id: 'thread-123',
                title: 'Thread Title',
                body: 'Thread Body',
                owner: 'user-123'
            })

            await CommentsTableTestHelper.addComments({
                id: 'comment-123',
                content: 'Comment',
                thread: 'thread-123',
                owner: 'user-123'
            })

            // Action and Assert
            await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'))
                .resolves.not.toThrow(AuthorizationError)
        })
    })

    describe('deleteComment function', () => {
        it('should delete comment successfully', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'dicoding',
                fullname: 'Dicoding Indonesia',
                password: 'dicoding123 '
            })

            await ThreadsTableTestHelper.addThreads({
                id: 'thread-123',
                title: 'Thread Title',
                body: 'Thread Body',
                owner: 'user-123'
            })

            await CommentsTableTestHelper.addComments({
                id: 'comment-123',
                content: 'Comment',
                thread: 'thread-123',
                owner: 'user-123'
            })

            // Action
            await commentRepositoryPostgres.deleteComment('comment-123')

            // Assert
            const is_deleted = await CommentsTableTestHelper.isCommentDeleted('comment-123')
            expect(is_deleted).toEqual(true)
        })
    })

    describe('findCommentsByThreadId function', () => {
        it('should return array of comments correctly', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'dicoding',
                fullname: 'Dicoding Indonesia',
                password: 'dicoding123 '
            })

            await ThreadsTableTestHelper.addThreads({
                id: 'thread-123',
                title: 'Thread Title',
                body: 'Thread Body',
                owner: 'user-123'
            })

            const testDate = new Date().toISOString();
            await CommentsTableTestHelper.addComments({
                id: 'comment-123',
                content: 'Comment',
                thread: 'thread-123',
                owner: 'user-123',
                date: testDate,
            })

            // Action
            const comments = await commentRepositoryPostgres.findCommentsByThreadId('thread-123')

            // Assert
            expect(comments).toHaveLength(1)
            expect(comments[0].id).toEqual('comment-123')
            expect(comments[0].content).toEqual('Comment')
            expect(comments[0].date).toEqual(testDate)
            expect(comments[0].username).toEqual('dicoding')
            expect(comments[0].is_deleted).toEqual(false)
        })
    })
})