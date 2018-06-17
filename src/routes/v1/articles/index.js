const steem = require('steem')
const removeMd = require('remove-markdown')
const marked = require('marked')

module.exports = (fastify, opts, next) => {
  fastify.get('/articles/trending', opts, (req, reply) => {
    reply.header('Content-Type', 'application/json').code(200)
    const query = {
      tag: req.query.tag || null,
      limit: req.query.limit || 20,
      truncate_body: 228,
      start_author: req.query.startAuthor || null,
      start_permlink: req.query.startPermlink || null
    }
    steem.api.getDiscussionsByTrending(query, (err, res) => {
      reply.send({
        data: formatResponseArray(res) || null,
        error: null || err
      })
    })
  })

  fastify.get('/articles/:author/:permlink', opts, (req, reply) => {
    reply.header('Content-Type', 'application/json').code(200)
    if (req.params === undefined || !req.params.author || !req.params.permlink) {
      reply.send({ data: null, error: 'Missing query params' })
    } else {
      steem.api.getContent(req.params.author, req.params.permlink, (err, res) => {
        reply.send({
          data: formatResponseObject(res) || null,
          error: null || err
        })
      })
    }
  })

  fastify.get('/articles/:category/:author/:permlink/comments', opts, (req, reply) => {
    reply.header('Content-Type', 'application/json').code(200)
    if (req.params === undefined || !req.params.category | !req.params.author || !req.params.permlink) {
      reply.send({ data: null, error: 'Missing query params' })
    } else {
      steem.api.getState(`/${req.params.category}/@${req.params.author}/${req.params.permlink}`, (err, res) => {
        reply.send({
          data: formatCommentsResponse(res) || null,
          error: null || err
        })
      })
    }
  })

  next()
}

const formatCommentsResponse = res => {
  const response = []
  const content = res.content

  Object.keys(content).forEach(key => {
    response.push(content[key])
  })
  return response
}

const formatResponseObject = el => {
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
    body: marked(el.body),
    replies: el.replies || [],
    created: el.created,
    depth: el.depth,
    comments: el.children,
    tags: tags || [],
    users: users || [],
    images: images || [],
    links: links || [],
    pendingPayoutValue: el.pending_payout_value,
    votes: el.net_votes
  }
}

const formatResponseArray = res => res.map(el => formatResponseObject(el))
