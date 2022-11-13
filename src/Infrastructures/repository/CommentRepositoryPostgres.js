const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const CreatedComment = require('../../Domains/comments/entities/CreatedComment')
const CommentRepository = require('../../Domains/comments/CommentRepository')

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super()
        this._pool = pool
        this._idGenerator = idGenerator
    }

    async addComment(createComment) {
        const { content, thread, owner } = createComment
        const id = `comment-${this._idGenerator()}`

        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
            values: [id, owner, thread, content]
        }

        const result = await this._pool.query(query)

        return new CreatedComment({ ...result.rows[0] })
    }

    async verifyCommentAvaibility(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id]
        }

        const result = await this._pool.query(query)
        if(!result.rowCount) {
            throw new NotFoundError('komentar tidak ditemukan')
        }
    }

    async verifyCommentOwner(id, owner) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
            values: [id, owner]
        }

        const result = await this._pool.query(query)
        if(!result.rowCount){
            throw new AuthorizationError('Unauthorized')
        }
    }

    async findCommentsByThreadId(thread) {
        const query = {
            text: `SELECT comments.id, users.username, comments.date, comments.content, comments.is_deleted FROM comments
                    INNER JOIN users
                    ON comments.owner = users.id
                    WHERE comments.thread = $1 ORDER BY date ASC`,
            values: [thread]
        }

        const result = await this._pool.query(query)
        return result.rows
    }

    async deleteComment(id) {
        const query = {
            text: 'UPDATE comments SET is_deleted = true WHERE id = $1',
            values: [id]
        }

        await this._pool.query(query)
    }
}

module.exports = CommentRepositoryPostgres