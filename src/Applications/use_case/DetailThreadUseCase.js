const DetailComment = require("../../Domains/comments/entities/DetailComment")
const DetailThread = require("../../Domains/threads/entities/DetailThread")

class DetailthreadUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository,
        this._commentRepository = commentRepository
    }

    async execute(useCasePayload){
        await this._threadRepository.verifyThreadAvaibility(useCasePayload.thread)
        const thread = await this._threadRepository.getDetailThread(useCasePayload.thread)
        const comments = await this._commentRepository.findCommentsByThreadId(useCasePayload.thread)
        const detailComments = []
        for(let i=0; i<comments.length; i++) {
            detailComments.push(new DetailComment({
                    id: comments[i].id,
                    username: comments[i].username,
                    date: comments[i].date,
                    content: comments[i].is_deleted ? '**komentar telah dihapus**' : comments[i].content
                })
            )
        }
        thread.comments = detailComments
        return thread
    }
}

module.exports = DetailthreadUseCase