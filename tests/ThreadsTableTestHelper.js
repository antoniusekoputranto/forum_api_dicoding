/* istanbul ignore file */

const NotFoundError = require('../src/Commons/exceptions/NotFoundError')
const pool = require('../src/Infrastructures/database/postgres/pool')

const ThreadsTableTestHelper = {
    async addThreads({
        id = 'thread-1', owner = 'user-123', title = 'First Thread', 
        body = 'This is thread body', date = ''
    }) {
        const query = {
            text: 'INSERT INTO threads VALUES ($1, $2, $3, $4, $5)',
            values: [id, owner, title, body, date],
        }

        await pool.query(query)
    },

    async findThreadById(id) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [id],
        }

        const result = await pool.query(query)
        if(result.rows.lenth === 0){
            throw new NotFoundError('thread tidak ditemukan')
        }

        return result.rows
    },

    async cleanTable(){
        await pool.query('DELETE FROM threads WHERE 1=1')
    }
}

module.exports = ThreadsTableTestHelper