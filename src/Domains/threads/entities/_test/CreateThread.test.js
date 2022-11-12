const CreateThread = require('../CreateThread')

describe('a CreateThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange

        const payload = {
            title: 'title',
            owner: 'user-123'
        }

        // Action and Assert

        expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange

        const payload = {
            title: 'title',
            body: true,
            owner: 'user-123'
        }

        // Action and Assert

        expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should create createThread object correctly', () => {
        // Arrange 
        const payload = {
            title: 'Thread Title',
            body: 'Thread body that user write',
            owner: 'user-123'
        }

        // Action
        const {title, body, owner} = new CreateThread(payload)

        // Assert
        expect(title).toEqual(payload.title)
        expect(body).toEqual(payload.body)
        expect(owner).toEqual(payload.owner)
    })
})