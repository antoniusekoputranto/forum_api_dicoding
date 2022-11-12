const routes = (handler) => ([
    {
        method: 'POST',
        path: '/threads',
        handler: handler.postThreadHandler,
        options: {
            auth: 'auth_jwt'
        },
    },
    {
        method: 'GET',
        path: '/threads/{threadId}',
        handler: handler.getDetailThreadHandler,
    },
])

module.exports = routes