const CreateComment = require('../CreateComment')

describe('a CreateThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            content: 'Comment',
            thread: 'thread-1',
        }

        // Action and Assert
        expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            content: ['Comment'],
            thread: 'thread-1',
            owner: 'user-1'
        }

        // Action and Assert
        expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should create createComment object correctly', () => {
        // Arrange
        const payload = {
            content: 'Comment',
            thread: 'thread-1',
            owner: 'user-1'
        }

        // Action
        const {content, thread, owner} = new CreateComment(payload)

        // Assert
        expect(content).toEqual(payload.content)
        expect(thread).toEqual(payload.thread),
        expect(owner).toEqual(payload.owner)
    })
})