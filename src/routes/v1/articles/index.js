const steem = require('steem')
const removeMd = require('remove-markdown')

module.exports = (fastify, opts, next) => {
  fastify.get('/articles/trending', opts, (req, reply) => {
    reply.header('Content-Type', 'application/json').code(200)
    const query = {
      tag: null,
      limit: 20,
      truncate_body: 228,
      start_author: null,
      start_permlink: null
    }
    steem.api.getDiscussionsByTrending(query, (err, res) => {
      if (err) throw err
      reply.send(formatResponse(res))
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
        truncate_body: 228,
        start_author: req.params.author,
        start_permlink: req.params.permlink
      }
      steem.api.getDiscussionsByTrending(query, (err, res) => {
        if (err) throw err

        reply.send(formatResponse(res))
      })
    }
  })
  next()
}
const formatResponse = res => {
  return res.map(el => {
    const metadata = JSON.parse(el.json_metadata)
    const tags = metadata.tags
    const users = metadata.users
    const images = metadata.image
    const links = metadata.links
    return {
      id: el.id,
      author: el.author,
      permlink: el.permlink,
      category: el.category,
      parentAuthor: el.parent_author,
      parentPermlink: el.parent_permlink,
      title: el.title,
      description: removeMd(el.body),
      created: el.created,
      depth: el.depth,
      children: el.children,
      tags: tags,
      users: users,
      images: images,
      links: links,
      pendingPayoutValue: el.pending_payout_value,
      activeVotes: el.active_votes
    }
  })
}
