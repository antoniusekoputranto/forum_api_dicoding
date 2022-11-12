const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const DeleteCommentUseCase = require('../DeleteCommentUseCase')

describe('DeleteCommentUseCase', () => {
    it('should orchestrating delete comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            id: 'comment-123',
            thread: 'thread-123',
            owner: 'user-123'
        }

        /** Creating dependency of use case */
        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()

        /** Mocking needed function */
        mockThreadRepository.verifyThreadAvaibility = jest.fn()
            .mockImplementation(() => Promise.resolve())
        mockCommentRepository.verifyCommentAvaibility = jest.fn()
            .mockImplementation(() => Promise.resolve())
        mockCommentRepository.verifyCommentOwner = jest.fn()
            .mockImplementation(() => Promise.resolve())
        mockCommentRepository.deleteComment = jest.fn()
            .mockImplementation(() => Promise.resolve())

        /** Creating use case instance */
        const getDeleteCommentUseCase = new DeleteCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository
        })

        // Action
        await getDeleteCommentUseCase.execute(useCasePayload)

        // Assert
        expect(mockThreadRepository.verifyThreadAvaibility).toBeCalledWith(useCasePayload.thread)
        expect(mockCommentRepository.verifyCommentAvaibility).toBeCalledWith(useCasePayload.id)
        expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(useCasePayload.id, useCasePayload.owner)
        expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload.id)
    })
})