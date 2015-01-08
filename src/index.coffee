url     = require('url')
redis   = require('redis')
errors  = require('./errors')

createError = errors.createError
RedisError  = errors.RedisError

class RedisConnectionManager
  _connectedClients:             {}
  _connectedClientsCallbacks:    {}
  _connectedClientsRetainCounts: {}

  connectedClientsForURL: (redisURL) ->
    unless @_connectedClients[redisURL]?
      @_connectedClients[redisURL] = {}

    return @_connectedClients[redisURL]

  connectedClientsCallbacksForURL: (redisURL) ->
    unless @_connectedClientsCallbacks[redisURL]?
      @_connectedClientsCallbacks[redisURL] = {}

    return @_connectedClientsCallbacks[redisURL]

  connectedClientsRetainCountsForURL: (redisURL) ->
    unless @_connectedClientsRetainCounts[redisURL]?
      @_connectedClientsRetainCounts[redisURL] = {}

    return @_connectedClientsRetainCounts[redisURL]

  obtainClient: (redisURL, id, cb) ->
    connectedClientsForURL             = @connectedClientsForURL redisURL
    connectedClientsCallbacksForURL    = @connectedClientsCallbacksForURL redisURL
    connectedClientsRetainCountsForURL = @connectedClientsRetainCountsForURL redisURL

    if connectedClientsForURL[id]?
      connectedClientsRetainCountsForURL[id] += 1
      return cb(null, connectedClientsForURL[id])

    return connectedClientsCallbacksForURL[id].push cb if connectedClientsCallbacksForURL[id]?

    connectedClientsCallbacksForURL[id] = [cb]
    connectedClientsRetainCountsForURL[id] = 0

    @_createClient redisURL, (err, client) ->
      connectedClientsForURL[id] = client unless err
      return unless connectedClientsCallbacksForURL[id]
      for callback in connectedClientsCallbacksForURL[id]
        connectedClientsRetainCountsForURL[id] += 1 if client

        callback(err, client)
      connectedClientsCallbacksForURL[id] = undefined

  returnClient: (redisURL, id) ->
    connectedClientsForURL             = @connectedClientsForURL redisURL

    connectedClientsRetainCountsForURL = @connectedClientsRetainCountsForURL redisURL
    connectedClientsRetainCountsForURL[id] -= 1

    unless connectedClientsRetainCountsForURL[id]
      connectedClientsForURL[id].quit()
      connectedClientsForURL[id] = undefined

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


### ###
# EXPORTS
exports.RedisConnectionManager = new RedisConnectionManager()
exports.RedisError = RedisError
