const DetailThread = require('../DetailThread')

describe('a DetailThread entities', () => {
    it('shoudl throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'thread-123',
            title: 'Thread Title',
            body: 'Thread Body',
            date: 'date',
            username: 'dicoding',
        }

        // Action and Assert
        expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 123,
            title: ['Thread Title'],
            body: ['Thread Body'],
            date: 4345,
            username: [3423],
            comments: 'Comment'
        }

        // Action and Assert
        expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should create detailThread object correctlt', () => {
        // Arrange
        const payload = {
            id: 'thread-123',
            title: 'Thread Title',
            body: 'Thread Body',
            date: 'date',
            username: 'dicoding',
            comments: []
        }

        // Action
        const { id, title, body, date, username, comments } = new DetailThread(payload)

        // Assert
        expect(id).toEqual(payload.id)
        expect(title).toEqual(payload.title)
        expect(body).toEqual(payload.body)
        expect(date).toEqual(payload.date)
        expect(username).toEqual(payload.username)
        expect(comments).toEqual(payload.comments)
    })
})