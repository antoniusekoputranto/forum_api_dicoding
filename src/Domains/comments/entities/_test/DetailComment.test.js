const DetailComment = require('../DetailComment')

describe('a DetailComment entities', () => {
    it('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            username: 'dicoding',
            date: 'date',
        }

        // Action and Assert
        expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error when payload did no meet data type specification', () => {
        // Arrange
        const payload = {
            id: 123,
            username: true,
            date: ['date'],
            content: [3435]
        }

        // Action and Assert
        expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should crete detailComment object correctly', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            username: 'dicoding',
            date: 'date',
            content: 'Comment'
        }

        // Action
        const { id, username, date, content } = new DetailComment(payload)

        // Assert
        expect(id).toEqual(payload.id)
        expect(username).toEqual(payload.username)
        expect(date).toEqual(payload.date)
        expect(content).toEqual(payload.content)
    })
})