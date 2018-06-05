const steem = require('steem')
module.exports = (fastify, opts, next) => {
  fastify.get('/trends/:query', opts, async (req, reply) => {
    reply.header('Content-Type', 'application/json').code(200)
    if (req.params === undefined || !req.params.query) {
      reply.send({ error: 'Missing query param' })
    } else {
      steem.api.getState(`/trends/${req.params.query}`, (err, result) => {
        if (err) throw err
        reply.send(result)
      })
    }
  })
  next()
}
