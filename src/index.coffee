url     = require('url')
redis   = require('redis')
errors  = require('./errors')

createError = errors.createError
RedisError = errors.RedisError

class RedisConnectionManager
  _connectedClients:          {}
  _connectedClientsCallbacks: {}

  connectedClientsForURL: (redisURL) ->
    unless @_connectedClients[redisURL]?
      @_connectedClients[redisURL] = {}

    return @_connectedClients[redisURL]

  connectedClientsCallbacksForURL: (redisURL) ->
    unless @_connectedClientsCallbacks[redisURL]?
      @_connectedClientsCallbacks[redisURL] = {}

    return @_connectedClientsCallbacks[redisURL]

  obtainClient: (redisURL, id, cb) ->
    connectedClientsForURL          = @connectedClientsForURL redisURL
    connectedClientsCallbacksForURL = @connectedClientsCallbacksForURL redisURL

    return cb(null, connectedClientsForURL[id]) if connectedClientsForURL[id]?
    return connectedClientsCallbacksForURL[id].push cb if connectedClientsCallbacksForURL[id]?

    connectedClientsCallbacksForURL[id] = [cb]

    @_createClient redisURL, (err, client) ->
      connectedClientsForURL[id] = client unless err
      #return unless connectedClientsCallbacksForURL[id]
      for callback in connectedClientsCallbacksForURL[id]
        callback(err, client)
      connectedClientsCallbacksForURL[id] = undefined

  _createClient: (redisURL, cb) ->
    parsed_url  = url.parse redisURL
    parsed_auth = (parsed_url.auth ? '').split ':'
    password    = parsed_auth[1]
    path        = (parsed_url.pathname ? '/').slice 1
    database    = if path.length then path else '0'

    client = redis.createClient parsed_url.port, parsed_url.hostname

    if password
      client.auth password, (err) ->
        cb createError(err, client) if err

    client.select(database)
    client.on 'ready', () ->
      client.send_anyways = true
      client.select(database)
      client.send_anyways = false
      cb null, client

    client.on 'error', (err) ->
      cb createError(err, client)


exports.RedisConnectionManager = new RedisConnectionManager()
exports.RedisError = RedisError
