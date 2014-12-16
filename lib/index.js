var DbError, ErrorHandler, RedisConnectionManager, RedisError, createErrorForRedis, errCodes, redis, url, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('lodash');

url = require('url');

redis = require('redis');

ErrorHandler = require('error-handler');

DbError = ErrorHandler.DbError;

RedisConnectionManager = (function() {
  function RedisConnectionManager() {}

  RedisConnectionManager.prototype._connectedClients = {};

  RedisConnectionManager.prototype._connectedClientsCallbacks = {};

  RedisConnectionManager.prototype.connectedClientsForURL = function(redisURL) {
    if (this._connectedClients[redisURL] == null) {
      this._connectedClients[redisURL] = {};
    }
    return this._connectedClients[redisURL];
  };

  RedisConnectionManager.prototype.connectedClientsCallbacksForURL = function(redisURL) {
    if (this._connectedClientsCallbacks[redisURL] == null) {
      this._connectedClientsCallbacks[redisURL] = {};
    }
    return this._connectedClientsCallbacks[redisURL];
  };

  RedisConnectionManager.prototype.obtainClient = function(redisURL, id, cb) {
    var connectedClientsCallbacksForURL, connectedClientsForURL;
    connectedClientsForURL = this.connectedClientsForURL(redisURL);
    connectedClientsCallbacksForURL = this.connectedClientsCallbacksForURL(redisURL);
    if (connectedClientsForURL[id] != null) {
      return cb(null, connectedClientsForURL[id]);
    }
    if (connectedClientsCallbacksForURL[id] != null) {
      return connectedClientsCallbacksForURL[id].push(cb);
    }
    connectedClientsCallbacksForURL[id] = [cb];
    return this._createClient(redisURL, function(err, client) {
      var callback, _i, _len, _ref;
      if (!err) {
        connectedClientsForURL[id] = client;
      }
      _ref = connectedClientsCallbacksForURL[id];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        callback(err, client);
      }
      return connectedClientsCallbacksForURL[id] = void 0;
    });
  };

  RedisConnectionManager.prototype._createClient = function(redisURL, cb) {
    var client, database, parsed_auth, parsed_url, password, path, _ref, _ref1;
    parsed_url = url.parse(redisURL);
    parsed_auth = ((_ref = parsed_url.auth) != null ? _ref : '').split(':');
    password = parsed_auth[1];
    path = ((_ref1 = parsed_url.pathname) != null ? _ref1 : '/').slice(1);
    database = path.length ? path : '0';
    client = redis.createClient(parsed_url.port, parsed_url.hostname);
    if (password) {
      client.auth(password, function(err) {
        if (err) {
          return cb(createErrorForRedis(err, client));
        }
      });
    }
    client.select(database);
    client.on('ready', function() {
      client.send_anyways = true;
      client.select(database);
      client.send_anyways = false;
      return cb(null, client);
    });
    return client.on('error', function(err) {
      return cb(createErrorForRedis(err, client));
    });
  };

  return RedisConnectionManager;

})();

module.exports = new RedisConnectionManager();

errCodes = ['ECONNREFUSED', 'ENOTFOUND'];

createErrorForRedis = function(err, client) {
  var index, msg;
  if (!err) {
    return null;
  }
  if (err.message) {
    msg = err.message;
    index = _.findIndex(errCodes, function(code) {
      return msg.indexOf(code) > -1;
    });
    switch (index) {
      case 0:
        return new RedisError('Connection refused', err, {
          connectionOption: client.connectionOption
        });
      case 1:
        return new RedisError('Host not found', err, {
          connectionOption: client.connectionOption
        });
      default:
        return new RedisError(null, err, {
          connectionOption: client.connectionOption
        });
    }
  } else {
    return new RedisError(null, err, {
      connectionOption: client.connectionOption
    });
  }
};


/* */

RedisError = (function(_super) {
  __extends(RedisError, _super);

  function RedisError() {
    return RedisError.__super__.constructor.apply(this, arguments);
  }

  RedisError.prototype.name = 'RedisError';

  return RedisError;

})(DbError);

//# sourceMappingURL=data:application/json;base64,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QSxJQUFBLEdBQU0sWUFBTixDQUFBOztvQkFBQTs7R0FGdUIsUUExRnpCLENBQUEiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJfICAgICAgID0gcmVxdWlyZSgnbG9kYXNoJylcbnVybCAgICAgPSByZXF1aXJlKCd1cmwnKVxucmVkaXMgICA9IHJlcXVpcmUoJ3JlZGlzJylcblxuRXJyb3JIYW5kbGVyID0gcmVxdWlyZSgnZXJyb3ItaGFuZGxlcicpXG5EYkVycm9yID0gRXJyb3JIYW5kbGVyLkRiRXJyb3JcblxuXG5jbGFzcyBSZWRpc0Nvbm5lY3Rpb25NYW5hZ2VyXG4gIF9jb25uZWN0ZWRDbGllbnRzOiAgICAgICAgICB7fVxuICBfY29ubmVjdGVkQ2xpZW50c0NhbGxiYWNrczoge31cblxuICBjb25uZWN0ZWRDbGllbnRzRm9yVVJMOiAocmVkaXNVUkwpIC0+XG4gICAgdW5sZXNzIEBfY29ubmVjdGVkQ2xpZW50c1tyZWRpc1VSTF0/XG4gICAgICBAX2Nvbm5lY3RlZENsaWVudHNbcmVkaXNVUkxdID0ge31cblxuICAgIHJldHVybiBAX2Nvbm5lY3RlZENsaWVudHNbcmVkaXNVUkxdXG5cbiAgY29ubmVjdGVkQ2xpZW50c0NhbGxiYWNrc0ZvclVSTDogKHJlZGlzVVJMKSAtPlxuICAgIHVubGVzcyBAX2Nvbm5lY3RlZENsaWVudHNDYWxsYmFja3NbcmVkaXNVUkxdP1xuICAgICAgQF9jb25uZWN0ZWRDbGllbnRzQ2FsbGJhY2tzW3JlZGlzVVJMXSA9IHt9XG5cbiAgICByZXR1cm4gQF9jb25uZWN0ZWRDbGllbnRzQ2FsbGJhY2tzW3JlZGlzVVJMXVxuXG4gIG9idGFpbkNsaWVudDogKHJlZGlzVVJMLCBpZCwgY2IpIC0+XG4gICAgY29ubmVjdGVkQ2xpZW50c0ZvclVSTCAgICAgICAgICA9IEBjb25uZWN0ZWRDbGllbnRzRm9yVVJMIHJlZGlzVVJMXG4gICAgY29ubmVjdGVkQ2xpZW50c0NhbGxiYWNrc0ZvclVSTCA9IEBjb25uZWN0ZWRDbGllbnRzQ2FsbGJhY2tzRm9yVVJMIHJlZGlzVVJMXG5cbiAgICByZXR1cm4gY2IobnVsbCwgY29ubmVjdGVkQ2xpZW50c0ZvclVSTFtpZF0pIGlmIGNvbm5lY3RlZENsaWVudHNGb3JVUkxbaWRdP1xuICAgIHJldHVybiBjb25uZWN0ZWRDbGllbnRzQ2FsbGJhY2tzRm9yVVJMW2lkXS5wdXNoIGNiIGlmIGNvbm5lY3RlZENsaWVudHNDYWxsYmFja3NGb3JVUkxbaWRdP1xuXG4gICAgY29ubmVjdGVkQ2xpZW50c0NhbGxiYWNrc0ZvclVSTFtpZF0gPSBbY2JdXG5cbiAgICBAX2NyZWF0ZUNsaWVudCByZWRpc1VSTCwgKGVyciwgY2xpZW50KSAtPlxuICAgICAgY29ubmVjdGVkQ2xpZW50c0ZvclVSTFtpZF0gPSBjbGllbnQgdW5sZXNzIGVyclxuICAgICAgI3JldHVybiB1bmxlc3MgY29ubmVjdGVkQ2xpZW50c0NhbGxiYWNrc0ZvclVSTFtpZF1cbiAgICAgIGZvciBjYWxsYmFjayBpbiBjb25uZWN0ZWRDbGllbnRzQ2FsbGJhY2tzRm9yVVJMW2lkXVxuICAgICAgICBjYWxsYmFjayhlcnIsIGNsaWVudClcbiAgICAgIGNvbm5lY3RlZENsaWVudHNDYWxsYmFja3NGb3JVUkxbaWRdID0gdW5kZWZpbmVkXG5cbiAgX2NyZWF0ZUNsaWVudDogKHJlZGlzVVJMLCBjYikgLT5cbiAgICBwYXJzZWRfdXJsICA9IHVybC5wYXJzZSByZWRpc1VSTFxuICAgIHBhcnNlZF9hdXRoID0gKHBhcnNlZF91cmwuYXV0aCA/ICcnKS5zcGxpdCAnOidcbiAgICBwYXNzd29yZCAgICA9IHBhcnNlZF9hdXRoWzFdXG4gICAgcGF0aCAgICAgICAgPSAocGFyc2VkX3VybC5wYXRobmFtZSA/ICcvJykuc2xpY2UgMVxuICAgIGRhdGFiYXNlICAgID0gaWYgcGF0aC5sZW5ndGggdGhlbiBwYXRoIGVsc2UgJzAnXG5cbiAgICBjbGllbnQgPSByZWRpcy5jcmVhdGVDbGllbnQgcGFyc2VkX3VybC5wb3J0LCBwYXJzZWRfdXJsLmhvc3RuYW1lXG5cbiAgICBpZiBwYXNzd29yZFxuICAgICAgY2xpZW50LmF1dGggcGFzc3dvcmQsIChlcnIpIC0+XG4gICAgICAgIGNiIGNyZWF0ZUVycm9yRm9yUmVkaXMoZXJyLCBjbGllbnQpIGlmIGVyclxuXG4gICAgY2xpZW50LnNlbGVjdChkYXRhYmFzZSlcbiAgICBjbGllbnQub24gJ3JlYWR5JywgKCkgLT5cbiAgICAgIGNsaWVudC5zZW5kX2FueXdheXMgPSB0cnVlXG4gICAgICBjbGllbnQuc2VsZWN0KGRhdGFiYXNlKVxuICAgICAgY2xpZW50LnNlbmRfYW55d2F5cyA9IGZhbHNlXG4gICAgICBjYiBudWxsLCBjbGllbnRcblxuICAgIGNsaWVudC5vbiAnZXJyb3InLCAoZXJyKSAtPlxuICAgICAgY2IgY3JlYXRlRXJyb3JGb3JSZWRpcyhlcnIsIGNsaWVudClcbiAgICAgIFxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBSZWRpc0Nvbm5lY3Rpb25NYW5hZ2VyKClcblxuXG5cbmVyckNvZGVzID0gWydFQ09OTlJFRlVTRUQnLCAnRU5PVEZPVU5EJ11cbmNyZWF0ZUVycm9yRm9yUmVkaXMgPSAoZXJyLCBjbGllbnQpIC0+XG4gIHJldHVybiBudWxsIHVubGVzcyBlcnJcblxuICBpZiBlcnIubWVzc2FnZVxuICAgIG1zZyA9IGVyci5tZXNzYWdlXG4gICAgaW5kZXggPSBfLmZpbmRJbmRleCBlcnJDb2RlcywgKGNvZGUpIC0+XG4gICAgICByZXR1cm4gbXNnLmluZGV4T2YoY29kZSkgPiAtMVxuICAgIHN3aXRjaCBpbmRleFxuICAgICAgd2hlbiAwXG4gICAgICAgIHJldHVybiBuZXcgUmVkaXNFcnJvcignQ29ubmVjdGlvbiByZWZ1c2VkJywgZXJyLCBjb25uZWN0aW9uT3B0aW9uOiBjbGllbnQuY29ubmVjdGlvbk9wdGlvbilcbiAgICAgIHdoZW4gMVxuICAgICAgICByZXR1cm4gbmV3IFJlZGlzRXJyb3IoJ0hvc3Qgbm90IGZvdW5kJywgZXJyLCBjb25uZWN0aW9uT3B0aW9uOiBjbGllbnQuY29ubmVjdGlvbk9wdGlvbilcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIG5ldyBSZWRpc0Vycm9yKG51bGwsIGVyciwgY29ubmVjdGlvbk9wdGlvbjogY2xpZW50LmNvbm5lY3Rpb25PcHRpb24pXG4gIGVsc2VcbiAgICByZXR1cm4gbmV3IFJlZGlzRXJyb3IobnVsbCwgZXJyLCBjb25uZWN0aW9uT3B0aW9uOiBjbGllbnQuY29ubmVjdGlvbk9wdGlvbilcblxuXG5cbiMjIyAjIyNcbiMgUmVkaXNFcnJvciAtIHVuaXZlcnNhbCBSZWRpcyBlcnJvcidzXG5jbGFzcyBSZWRpc0Vycm9yIGV4dGVuZHMgRGJFcnJvclxuXG4gIG5hbWU6ICdSZWRpc0Vycm9yJ1xuXG4iXX0=