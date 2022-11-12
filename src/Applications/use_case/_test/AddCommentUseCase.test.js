const CreateComment = require('../../../Domains/comments/entities/CreateComment')
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const AddCommentUseCase = require('../AddCommentUseCase')

describe('AddCommentUseCase', () => {
    it('should orchestrating the add comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            content: 'Comment',
            thread: 'thread-1',
            owner: 'user-1'
        }

        const expectedCreatedComment = new CreatedComment({
            id: 'comment-1',
            content: useCasePayload.content,
            owner: useCasePayload.owner
        })

        /** Creating dependency of use case */
        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()

        /** Mocking needed function */
        mockThreadRepository.verifyThreadAvaibility = jest.fn()
            .mockImplementation(() => Promise.resolve())
        mockCommentRepository.addComment = jest.fn(() => new CreatedComment({
            id: 'comment-1',
            content: 'Comment',
            owner: 'user-1'
        }))

        /** Creating use case instance */
        const getCommentUseCase = new AddCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository
        })

        // Action
        const createdComment = await getCommentUseCase.execute(useCasePayload)

        // Assert
        expect(mockThreadRepository.verifyThreadAvaibility).toBeCalledWith(useCasePayload.thread)
        expect(createdComment).toStrictEqual(expectedCreatedComment)
        expect(mockCommentRepository.addComment).toBeCalledWith(new CreateComment({
            content: useCasePayload.content,
            thread: useCasePayload.thread,
            owner: useCasePayload.owner,
        }))
    })
})