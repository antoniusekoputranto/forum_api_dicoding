const CreateThread = require('../../../Domains/threads/entities/CreateThread')
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddThreadUseCase = require('../AddThreadUseCase')

describe('AddThreadUseCase', () => {
    it('should orchestarting the add thread action correctly', async () => {
        // Arrange
        const useCasePayload = {
            title: 'Thread Title',
            body: 'Thread body that user write',
            owner: 'user-123'
        }

        const expectedCreatedThread = new CreatedThread({
            id: 'thread-1',
            title: useCasePayload.title,
            owner: useCasePayload.owner
        })

        /** Creating dependency of use case */
        const mockThreadRepository = new ThreadRepository()

        /** Mocking needed function */
        mockThreadRepository.addThread = jest.fn(() => new CreatedThread({
            id: 'thread-1',
            title: 'Thread Title',
            owner: 'user-123'
        }))

        /** Creating use case instance */
        const getThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository
        })

        // Action
        const createdThread = await getThreadUseCase.execute(useCasePayload)

        // Assert
        expect(createdThread).toStrictEqual(expectedCreatedThread)
        expect(mockThreadRepository.addThread).toBeCalledWith(new CreateThread({
            title: useCasePayload.title,
            body: useCasePayload.body,
            owner: useCasePayload.owner,
        }))
    })
})