const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const CreatedThread = require('../../Domains/threads/entities/CreatedThread')
const ThreadRepository = require('../../Domains/threads/ThreadRepository')

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super()
        this._pool = pool
        this._idGenerator = idGenerator
    }

    async addThread(createThread) {
        const { title, body, owner } = createThread
        const id = `thread-${this._idGenerator()}`

        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
            values: [id, owner, title, body]
        }

        const result = await this._pool.query(query)

        return new CreatedThread(result.rows[0])
    }

    async verifyThreadAvaibility(id) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [id]
        }

        const result = await this._pool.query(query)
        if(result.rows.length === 0){
            throw new NotFoundError('thread tidak ditemukan')
        }
    }

    async getDetailThread(id) {
        const query = {
            text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username FROM threads
                    INNER JOIN users
                    ON threads.owner = users.id
                    WHERE threads.id = $1`,
            values: [id],
        }

        const result = await this._pool.query(query)

        return result.rows[0]
    }
}

module.exports = ThreadRepositoryPostgres