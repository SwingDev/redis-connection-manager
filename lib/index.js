var RedisConnectionManager, RedisError, createError, errors, redis, url;

url = require('url');

redis = require('redis');

errors = require('./errors');

createError = errors.createError;

RedisError = errors.RedisError;

RedisConnectionManager = (function() {
  function RedisConnectionManager() {}

  RedisConnectionManager.prototype._connectedClients = {};

  RedisConnectionManager.prototype._connectedClientsCallbacks = {};

  RedisConnectionManager.prototype._connectedClientsRetainCounts = {};

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

  RedisConnectionManager.prototype.connectedClientsRetainCountsForURL = function(redisURL) {
    if (this._connectedClientsRetainCounts[redisURL] == null) {
      this._connectedClientsRetainCounts[redisURL] = {};
    }
    return this._connectedClientsRetainCounts[redisURL];
  };

  RedisConnectionManager.prototype.obtainClient = function(redisURL, id, cb) {
    var connectedClientsCallbacksForURL, connectedClientsForURL, connectedClientsRetainCountsForURL;
    connectedClientsForURL = this.connectedClientsForURL(redisURL);
    connectedClientsCallbacksForURL = this.connectedClientsCallbacksForURL(redisURL);
    connectedClientsRetainCountsForURL = this.connectedClientsRetainCountsForURL(redisURL);
    if (connectedClientsForURL[id] != null) {
      connectedClientsRetainCountsForURL[id] += 1;
      return cb(null, connectedClientsForURL[id]);
    }
    if (connectedClientsCallbacksForURL[id] != null) {
      return connectedClientsCallbacksForURL[id].push(cb);
    }
    connectedClientsCallbacksForURL[id] = [cb];
    connectedClientsRetainCountsForURL[id] = 0;
    return this._createClient(redisURL, function(err, client) {
      var callback, i, len, ref;
      if (!err) {
        connectedClientsForURL[id] = client;
      }
      if (!connectedClientsCallbacksForURL[id]) {
        return;
      }
      ref = connectedClientsCallbacksForURL[id];
      for (i = 0, len = ref.length; i < len; i++) {
        callback = ref[i];
        if (client) {
          connectedClientsRetainCountsForURL[id] += 1;
        }
        callback(err, client);
      }
      return connectedClientsCallbacksForURL[id] = void 0;
    });
  };

  RedisConnectionManager.prototype.returnClient = function(redisURL, id) {
    var connectedClientsForURL, connectedClientsRetainCountsForURL;
    connectedClientsForURL = this.connectedClientsForURL(redisURL);
    connectedClientsRetainCountsForURL = this.connectedClientsRetainCountsForURL(redisURL);
    connectedClientsRetainCountsForURL[id] -= 1;
    if (!connectedClientsRetainCountsForURL[id]) {
      connectedClientsForURL[id].quit();
      return connectedClientsForURL[id] = void 0;
    }
  };

  RedisConnectionManager.prototype._createClient = function(redisURL, cb) {
    var client, database, parsed_auth, parsed_url, password, path, ref, ref1;
    parsed_url = url.parse(redisURL);
    parsed_auth = ((ref = parsed_url.auth) != null ? ref : '').split(':');
    password = parsed_auth[1];
    path = ((ref1 = parsed_url.pathname) != null ? ref1 : '/').slice(1);
    database = path.length ? path : '0';
    client = redis.createClient(parsed_url.port, parsed_url.hostname);
    if (password) {
      return client.auth(password, (function(_this) {
        return function(err) {
          if (err) {
            return cb(createError(err, client));
          }
          return _this._afterConnectionAndAuth(client, database, cb);
        };
      })(this));
    } else {
      return this._afterConnectionAndAuth(client, database, cb);
    }
  };

  RedisConnectionManager.prototype._afterConnectionAndAuth = function(client, database, cb) {
    client.select(database);
    client.on('ready', function() {
      client.send_anyways = true;
      client.select(database);
      client.send_anyways = false;
      return cb(null, client);
    });
    return client.on('error', function(err) {
      if (err) {
        return cb(createError(err, client));
      }
      return cb(null);
    });
  };

  return RedisConnectionManager;

})();


/* */

exports.RedisConnectionManager = new RedisConnectionManager();

exports.RedisError = RedisError;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbImluZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBOztBQUFBLEdBQUEsR0FBVSxPQUFBLENBQVEsS0FBUjs7QUFDVixLQUFBLEdBQVUsT0FBQSxDQUFRLE9BQVI7O0FBQ1YsTUFBQSxHQUFVLE9BQUEsQ0FBUSxVQUFSOztBQUVWLFdBQUEsR0FBYyxNQUFNLENBQUM7O0FBQ3JCLFVBQUEsR0FBYyxNQUFNLENBQUM7O0FBRWY7OzttQ0FDSixpQkFBQSxHQUErQjs7bUNBQy9CLDBCQUFBLEdBQStCOzttQ0FDL0IsNkJBQUEsR0FBK0I7O21DQUUvQixzQkFBQSxHQUF3QixTQUFDLFFBQUQ7SUFDdEIsSUFBTyx3Q0FBUDtNQUNFLElBQUMsQ0FBQSxpQkFBa0IsQ0FBQSxRQUFBLENBQW5CLEdBQStCLEdBRGpDOztBQUdBLFdBQU8sSUFBQyxDQUFBLGlCQUFrQixDQUFBLFFBQUE7RUFKSjs7bUNBTXhCLCtCQUFBLEdBQWlDLFNBQUMsUUFBRDtJQUMvQixJQUFPLGlEQUFQO01BQ0UsSUFBQyxDQUFBLDBCQUEyQixDQUFBLFFBQUEsQ0FBNUIsR0FBd0MsR0FEMUM7O0FBR0EsV0FBTyxJQUFDLENBQUEsMEJBQTJCLENBQUEsUUFBQTtFQUpKOzttQ0FNakMsa0NBQUEsR0FBb0MsU0FBQyxRQUFEO0lBQ2xDLElBQU8sb0RBQVA7TUFDRSxJQUFDLENBQUEsNkJBQThCLENBQUEsUUFBQSxDQUEvQixHQUEyQyxHQUQ3Qzs7QUFHQSxXQUFPLElBQUMsQ0FBQSw2QkFBOEIsQ0FBQSxRQUFBO0VBSko7O21DQU1wQyxZQUFBLEdBQWMsU0FBQyxRQUFELEVBQVcsRUFBWCxFQUFlLEVBQWY7QUFDWixRQUFBO0lBQUEsc0JBQUEsR0FBcUMsSUFBQyxDQUFBLHNCQUFELENBQXdCLFFBQXhCO0lBQ3JDLCtCQUFBLEdBQXFDLElBQUMsQ0FBQSwrQkFBRCxDQUFpQyxRQUFqQztJQUNyQyxrQ0FBQSxHQUFxQyxJQUFDLENBQUEs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QWMsUUFBZDtNQUNBLE1BQU0sQ0FBQyxZQUFQLEdBQXNCO2FBQ3RCLEVBQUEsQ0FBRyxJQUFILEVBQVMsTUFBVDtJQUppQixDQUFuQjtXQU1BLE1BQU0sQ0FBQyxFQUFQLENBQVUsT0FBVixFQUFtQixTQUFDLEdBQUQ7TUFDakIsSUFBc0MsR0FBdEM7QUFBQSxlQUFPLEVBQUEsQ0FBRyxXQUFBLENBQVksR0FBWixFQUFpQixNQUFqQixDQUFILEVBQVA7O2FBQ0EsRUFBQSxDQUFHLElBQUg7SUFGaUIsQ0FBbkI7RUFSdUI7Ozs7Ozs7QUFZM0I7O0FBRUEsT0FBTyxDQUFDLHNCQUFSLEdBQWlDLElBQUksc0JBQUosQ0FBQTs7QUFDakMsT0FBTyxDQUFDLFVBQVIsR0FBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJ1cmwgICAgID0gcmVxdWlyZSgndXJsJylcbnJlZGlzICAgPSByZXF1aXJlKCdyZWRpcycpXG5lcnJvcnMgID0gcmVxdWlyZSgnLi9lcnJvcnMnKVxuXG5jcmVhdGVFcnJvciA9IGVycm9ycy5jcmVhdGVFcnJvclxuUmVkaXNFcnJvciAgPSBlcnJvcnMuUmVkaXNFcnJvclxuXG5jbGFzcyBSZWRpc0Nvbm5lY3Rpb25NYW5hZ2VyXG4gIF9jb25uZWN0ZWRDbGllbnRzOiAgICAgICAgICAgICB7fVxuICBfY29ubmVjdGVkQ2xpZW50c0NhbGxiYWNrczogICAge31cbiAgX2Nvbm5lY3RlZENsaWVudHNSZXRhaW5Db3VudHM6IHt9XG5cbiAgY29ubmVjdGVkQ2xpZW50c0ZvclVSTDogKHJlZGlzVVJMKSAtPlxuICAgIHVubGVzcyBAX2Nvbm5lY3RlZENsaWVudHNbcmVkaXNVUkxdP1xuICAgICAgQF9jb25uZWN0ZWRDbGllbnRzW3JlZGlzVVJMXSA9IHt9XG5cbiAgICByZXR1cm4gQF9jb25uZWN0ZWRDbGllbnRzW3JlZGlzVVJMXVxuXG4gIGNvbm5lY3RlZENsaWVudHNDYWxsYmFja3NGb3JVUkw6IChyZWRpc1VSTCkgLT5cbiAgICB1bmxlc3MgQF9jb25uZWN0ZWRDbGllbnRzQ2FsbGJhY2tzW3JlZGlzVVJMXT9cbiAgICAgIEBfY29ubmVjdGVkQ2xpZW50c0NhbGxiYWNrc1tyZWRpc1VSTF0gPSB7fVxuXG4gICAgcmV0dXJuIEBfY29ubmVjdGVkQ2xpZW50c0NhbGxiYWNrc1tyZWRpc1VSTF1cblxuICBjb25uZWN0ZWRDbGllbnRzUmV0YWluQ291bnRzRm9yVVJMOiAocmVkaXNVUkwpIC0+XG4gICAgdW5sZXNzIEBfY29ubmVjdGVkQ2xpZW50c1JldGFpbkNvdW50c1tyZWRpc1VSTF0/XG4gICAgICBAX2Nvbm5lY3RlZENsaWVudHNSZXRhaW5Db3VudHNbcmVkaXNVUkxdID0ge31cblxuICAgIHJldHVybiBAX2Nvbm5lY3RlZENsaWVudHNSZXRhaW5Db3VudHNbcmVkaXNVUkxdXG5cbiAgb2J0YWluQ2xpZW50OiAocmVkaXNVUkwsIGlkLCBjYikgLT5cbiAgICBjb25uZWN0ZWRDbGllbnRzRm9yVVJMICAgICAgICAgICAgID0gQGNvbm5lY3RlZENsaWVudHNGb3JVUkwgcmVkaXNVUkxcbiAgICBjb25uZWN0ZWRDbGllbnRzQ2FsbGJhY2tzRm9yVVJMICAgID0gQGNvbm5lY3RlZENsaWVudHNDYWxsYmFja3NGb3JVUkwgcmVkaXNVUkxcbiAgICBjb25uZWN0ZWRDbGllbnRzUmV0YWluQ291bnRzRm9yVVJMID0gQGNvbm5lY3RlZENsaWVudHNSZXRhaW5Db3VudHNGb3JVUkwgcmVkaXNVUkxcblxuICAgIGlmIGNvbm5lY3RlZENsaWVudHNGb3JVUkxbaWRdP1xuICAgICAgY29ubmVjdGVkQ2xpZW50c1JldGFpbkNvdW50c0ZvclVSTFtpZF0gKz0gMVxuICAgICAgcmV0dXJuIGNiKG51bGwsIGNvbm5lY3RlZENsaWVudHNGb3JVUkxbaWRdKVxuXG4gICAgcmV0dXJuIGNvbm5lY3RlZENsaWVudHNDYWxsYmFja3NGb3JVUkxbaWRdLnB1c2ggY2IgaWYgY29ubmVjdGVkQ2xpZW50c0NhbGxiYWNrc0ZvclVSTFtpZF0/XG5cbiAgICBjb25uZWN0ZWRDbGllbnRzQ2FsbGJhY2tzRm9yVVJMW2lkXSA9IFtjYl1cbiAgICBjb25uZWN0ZWRDbGllbnRzUmV0YWluQ291bnRzRm9yVVJMW2lkXSA9IDBcblxuICAgIEBfY3JlYXRlQ2xpZW50IHJlZGlzVVJMLCAoZXJyLCBjbGllbnQpIC0+XG4gICAgICBjb25uZWN0ZWRDbGllbnRzRm9yVVJMW2lkXSA9IGNsaWVudCB1bmxlc3MgZXJyXG4gICAgICByZXR1cm4gdW5sZXNzIGNvbm5lY3RlZENsaWVudHNDYWxsYmFja3NGb3JVUkxbaWRdXG4gICAgICBmb3IgY2FsbGJhY2sgaW4gY29ubmVjdGVkQ2xpZW50c0NhbGxiYWNrc0ZvclVSTFtpZF1cbiAgICAgICAgY29ubmVjdGVkQ2xpZW50c1JldGFpbkNvdW50c0ZvclVSTFtpZF0gKz0gMSBpZiBjbGllbnRcblxuICAgICAgICBjYWxsYmFjayhlcnIsIGNsaWVudClcbiAgICAgIGNvbm5lY3RlZENsaWVudHNDYWxsYmFja3NGb3JVUkxbaWRdID0gdW5kZWZpbmVkXG5cbiAgcmV0dXJuQ2xpZW50OiAocmVkaXNVUkwsIGlkKSAtPlxuICAgIGNvbm5lY3RlZENsaWVudHNGb3JVUkwgICAgICAgICAgICAgPSBAY29ubmVjdGVkQ2xpZW50c0ZvclVSTCByZWRpc1VSTFxuXG4gICAgY29ubmVjdGVkQ2xpZW50c1JldGFpbkNvdW50c0ZvclVSTCA9IEBjb25uZWN0ZWRDbGllbnRzUmV0YWluQ291bnRzRm9yVVJMIHJlZGlzVVJMXG4gICAgY29ubmVjdGVkQ2xpZW50c1JldGFpbkNvdW50c0ZvclVSTFtpZF0gLT0gMVxuXG4gICAgdW5sZXNzIGNvbm5lY3RlZENsaWVudHNSZXRhaW5Db3VudHNGb3JVUkxbaWRdXG4gICAgICBjb25uZWN0ZWRDbGllbnRzRm9yVVJMW2lkXS5xdWl0KClcbiAgICAgIGNvbm5lY3RlZENsaWVudHNGb3JVUkxbaWRdID0gdW5kZWZpbmVkXG5cbiAgX2NyZWF0ZUNsaWVudDogKHJlZGlzVVJMLCBjYikgLT5cbiAgICBwYXJzZWRfdXJsICA9IHVybC5wYXJzZSByZWRpc1VSTFxuICAgIHBhcnNlZF9hdXRoID0gKHBhcnNlZF91cmwuYXV0aCA/ICcnKS5zcGxpdCAnOidcbiAgICBwYXNzd29yZCAgICA9IHBhcnNlZF9hdXRoWzFdXG4gICAgcGF0aCAgICAgICAgPSAocGFyc2VkX3VybC5wYXRobmFtZSA/ICcvJykuc2xpY2UgMVxuICAgIGRhdGFiYXNlICAgID0gaWYgcGF0aC5sZW5ndGggdGhlbiBwYXRoIGVsc2UgJzAnXG5cbiAgICBjbGllbnQgPSByZWRpcy5jcmVhdGVDbGllbnQgcGFyc2VkX3VybC5wb3J0LCBwYXJzZWRfdXJsLmhvc3RuYW1lXG5cbiAgICBpZiBwYXNzd29yZFxuICAgICAgY2xpZW50LmF1dGggcGFzc3dvcmQsIChlcnIpID0+XG4gICAgICAgIHJldHVybiBjYiBjcmVhdGVFcnJvcihlcnIsIGNsaWVudCkgaWYgZXJyXG4gICAgICAgIEBfYWZ0ZXJDb25uZWN0aW9uQW5kQXV0aCBjbGllbnQsIGRhdGFiYXNlLCBjYlxuICAgIGVsc2VcbiAgICAgIEBfYWZ0ZXJDb25uZWN0aW9uQW5kQXV0aCBjbGllbnQsIGRhdGFiYXNlLCBjYlxuXG4gIF9hZnRlckNvbm5lY3Rpb25BbmRBdXRoOiAoY2xpZW50LCBkYXRhYmFzZSwgY2IpIC0+XG4gICAgY2xpZW50LnNlbGVjdCBkYXRhYmFzZVxuICAgIGNsaWVudC5vbiAncmVhZHknLCAtPlxuICAgICAgY2xpZW50LnNlbmRfYW55d2F5cyA9IHRydWVcbiAgICAgIGNsaWVudC5zZWxlY3QgZGF0YWJhc2VcbiAgICAgIGNsaWVudC5zZW5kX2FueXdheXMgPSBmYWxzZVxuICAgICAgY2IgbnVsbCwgY2xpZW50XG5cbiAgICBjbGllbnQub24gJ2Vycm9yJywgKGVycikgLT5cbiAgICAgIHJldHVybiBjYiBjcmVhdGVFcnJvcihlcnIsIGNsaWVudCkgaWYgZXJyXG4gICAgICBjYiBudWxsXG5cbiMjIyAjIyNcbiMgRVhQT1JUU1xuZXhwb3J0cy5SZWRpc0Nvbm5lY3Rpb25NYW5hZ2VyID0gbmV3IFJlZGlzQ29ubmVjdGlvbk1hbmFnZXIoKVxuZXhwb3J0cy5SZWRpc0Vycm9yID0gUmVkaXNFcnJvclxuIl19
