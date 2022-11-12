/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool')

const CommentsTableTestHelper = {
    async addComments({
        id = 'comment-1', owner = 'user-123', thread = 'thread-1', 
        content = 'This is comment body', date = ''
    }) {
        const query = {
            text: 'INSERT INTO comments VALUES ($1, $2, $3, $4, $5, $6)',
            values: [id, owner, thread, content, false, date],
        }

        await pool.query(query)
    },

    async findCommentsById(id){
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id],
        }

        const result = await pool.query(query)
        return result.rows;
    },

    async deleteComment(id) {
        const query = {
            text: 'DELETE FROM comments WHERE id = $1',
            values: [id]
        }

        await pool.query(query)
    },

    async isCommentDeleted(id) {
        const query = {
            text: 'SELECT is_deleted FROM comments WHERE id = $1',
            values: [id]
        }

        const result =  await pool.query(query)
        const is_deleted = result.rows[0].is_deleted
        return is_deleted
    },

    async cleanTable(){
        await pool.query('DELETE FROM comments WHERE 1=1')
    }
}

module.exports = CommentsTableTestHelper