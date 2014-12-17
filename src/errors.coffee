_ = require('lodash')
ErrorHandler = require('error-handler')

DbError = ErrorHandler.DbError
errCodes = ['ECONNREFUSED', 'ENOTFOUND']

createError = (err, client) ->
  return null unless err

  if err.message
    msg = err.message
    index = _.findIndex errCodes, (code) ->
      return msg.indexOf(code) > -1

    switch index
      when 0
        return new RedisConnError('Connection refused', err, connectionOption: client.connectionOption)
      when 1
        return new RedisConnError('Host not found', err, connectionOption: client.connectionOption)
      else
        return new RedisConnError(null, err, connectionOption: client.connectionOption)
  else
    return new RedisConnError(null, err, connectionOption: client.connectionOption)


### ###
# RedisConnError - universal Redis connection error's
class RedisConnError extends DbError

  name: 'RedisConnError'


exports.createError = createError
exports.RedisConnError = RedisConnError
