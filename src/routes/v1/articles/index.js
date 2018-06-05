const steem = require('steem')
module.exports = (fastify, opts, next) => {
  fastify.get('/articles/trending', opts, (req, reply) => {
    reply.header('Content-Type', 'application/json').code(200)
    const query = {
      tag: null,
      limit: 20,
      truncateBody: 228,
      start_author: null,
      start_permlink: null
    }
    steem.api.getDiscussionsByTrending(query, (err, result) => {
      if (err) throw err
      reply.send(result)
    })
  })

  fastify.get('/articles/trending/:author/:permlink', opts, (req, reply) => {
    reply.header('Content-Type', 'application/json').code(200)
    if (req.params === undefined || !req.params.author || !req.params.permlink) {
      reply.send({error: 'Missing query param'})
    } else {
      const query = {
        tag: null,
        limit: 20,
        truncateBody: 228,
        start_author: req.params.author,
        start_permlink: req.params.permlink
      }
      steem.api.getDiscussionsByTrending(query, (err, result) => {
        if (err) throw err
        reply.send(result)
      })
    }
  })
  next()
}
