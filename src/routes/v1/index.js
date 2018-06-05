module.exports = (fastify, opts, next) => {
  fastify.get('/', opts, (req, reply) => {
    reply.header('Content-Type', 'application/json').code(200)
    reply.send({message: `Api say Hello`})
  })
  next()
}
