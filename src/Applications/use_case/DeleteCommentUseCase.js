class DeleteCommentUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository
        this._commentRepository = commentRepository
    }

    async execute(useCasePayload) {
        await this._threadRepository.verifyThreadAvaibility(useCasePayload.thread)
        await this._commentRepository.verifyCommentAvaibility(useCasePayload.id)
        await this._commentRepository.verifyCommentOwner(useCasePayload.id, useCasePayload.owner)
        await this._commentRepository.deleteComment(useCasePayload.id)
    }
}

module.exports = DeleteCommentUseCase