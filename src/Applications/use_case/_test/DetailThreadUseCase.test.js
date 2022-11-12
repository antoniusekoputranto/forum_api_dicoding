const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const DetailComment = require('../../../Domains/comments/entities/DetailComment')
const DetailThread = require('../../../Domains/threads/entities/DetailThread')
const DetailThreadUseCase = require('../DetailThreadUseCase')

describe('DetailThreadUseCase', () => {
    it('should orchestarting the get detail thread action correctly', async () => {
        // Arrange
        const useCasePayload = {
            thread: 'thread-123'
        }

        const thread = {
            id: 'thread-123',
            title: 'Thread Title',
            body: 'Thread Body',
            date: 'date',
            username: 'dicoding',
            comments: []
        }

        const comment1 = new DetailComment({
            id: 'comment-123',
            username: 'johndoe',
            date: 'date',
            content: 'Thread Comment',
        })

        const deletedComment = new DetailComment({
            id: 'comment-223',
            username: 'dicoding',
            date: 'date',
            content: '**komentar telah dihapus**',
        })

        const comments = [comment1, deletedComment]

        /** Creating dependecy of use case */
        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()

        /** Mocking needed function */
        mockThreadRepository.verifyThreadAvaibility = jest.fn(() => Promise.resolve())
        mockThreadRepository.getDetailThread = jest.fn(() => Promise.resolve(new DetailThread(thread)))
        mockCommentRepository.findCommentsByThreadId = jest.fn(() => Promise.resolve([
            {
                id: 'comment-123',
                username: 'johndoe',
                date: 'date',
                thread: 'thread-123',
                content: 'Thread Comment',
                is_deleted: false
            },
            {
                id: 'comment-223',
                username: 'dicoding',
                date: 'date',
                thread: 'thread-123',
                content: '**komentar telah dihapus**',
                is_deleted: true
            }
        ]))

        /** Creating use case instance */
        const getDetailThreadUseCase = new DetailThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository
        })

        // Action
        const result = await getDetailThreadUseCase.execute(useCasePayload)

        // Assert
        expect(mockThreadRepository.verifyThreadAvaibility).toBeCalledWith(useCasePayload.thread)
        expect(mockThreadRepository.getDetailThread).toBeCalledWith(useCasePayload.thread)
        expect(mockCommentRepository.findCommentsByThreadId).toBeCalledWith(useCasePayload.thread)
        expect(result).toEqual(new DetailThread({ ...thread, comments: comments }))
    })
})
