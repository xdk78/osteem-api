module.exports = (fastify, opts, next) => {
  fastify.get('/articles', opts, async (req, reply) => {
    reply.header('Content-Type', 'application/json').code(200)
    reply.send({message: `articles here`})
  })
  next()
}
