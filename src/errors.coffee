_ = require('lodash')
ErrorHandler  = require('error-handler')
DbError       = ErrorHandler.DbError

errCodes = ['ECONNREFUSED', 'ENOTFOUND']

createError = (err, client) ->
  return null unless err

  if err.message
    msg = err.message
    index = _.findIndex errCodes, (code) ->
      return msg.indexOf(code) > -1

    switch index
      when 0
        return new RedisError('Connection refused', err, connectionOption: client.connectionOption, 'ECONNREFUSED')
      when 1
        return new RedisError('Host not found', err, connectionOption: client.connectionOption, 'ENOTFOUND')
      else
        return new RedisError(null, err, connectionOption: client.connectionOption, 'ERRELSE')
  else
    return new RedisError(null, err, connectionOption: client.connectionOption, 'ERRELSE')


### ###
# RedisError - universal Redis error's
class RedisError extends DbError

  name: 'RedisError'


### ###
# EXPORTS
exports.createError = createError
exports.RedisError = RedisError
