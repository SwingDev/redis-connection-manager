var RedisConnectionManager, redis, url;

url = require('url');

redis = require('redis');

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
    client = redis.createClient(parsed_url.port, parsed_url.hostname, {
      retry_max_delay: 100
    });
    if (password) {
      client.auth(password, function(err) {
        if (err) {
          return cb(err);
        }
      });
    }
    client.select(database);
    return client.on('ready', function() {
      client.send_anyways = true;
      client.select(database);
      client.send_anyways = false;
      return cb(null, client);
    });
  };

  return RedisConnectionManager;

})();

module.exports = new RedisConnectionManager();

//# sourceMappingURL=data:application/json;base64,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QUE5QixFQUFvQyxVQUFVLENBQUMsUUFBL0MsRUFBeUQ7QUFBQSxNQUFFLGVBQUEsRUFBaUIsR0FBbkI7S0FBekQsQ0FOVCxDQUFBO0FBUUEsSUFBQSxJQUFHLFFBQUg7QUFDRSxNQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksUUFBWixFQUFzQixTQUFDLEdBQUQsR0FBQTtBQUNwQixRQUFBLElBQVcsR0FBWDtpQkFBQSxFQUFBLENBQUcsR0FBSCxFQUFBO1NBRG9CO01BQUEsQ0FBdEIsQ0FBQSxDQURGO0tBUkE7QUFBQSxJQVlBLE1BQU0sQ0FBQyxNQUFQLENBQWMsUUFBZCxDQVpBLENBQUE7V0FhQSxNQUFNLENBQUMsRUFBUCxDQUFVLE9BQVYsRUFBbUIsU0FBQSxHQUFBO0FBQ2pCLE1BQUEsTUFBTSxDQUFDLFlBQVAsR0FBc0IsSUFBdEIsQ0FBQTtBQUFBLE1BQ0EsTUFBTSxDQUFDLE1BQVAsQ0FBYyxRQUFkLENBREEsQ0FBQTtBQUFBLE1BRUEsTUFBTSxDQUFDLFlBQVAsR0FBc0IsS0FGdEIsQ0FBQTthQUdBLEVBQUEsQ0FBRyxJQUFILEVBQVMsTUFBVCxFQUppQjtJQUFBLENBQW5CLEVBZGE7RUFBQSxDQTlCZixDQUFBOztnQ0FBQTs7SUFKRixDQUFBOztBQUFBLE1Bc0RNLENBQUMsT0FBUCxHQUFxQixJQUFBLHNCQUFBLENBQUEsQ0F0RHJCLENBQUEiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJ1cmwgICAgID0gcmVxdWlyZSgndXJsJylcbnJlZGlzICAgPSByZXF1aXJlKCdyZWRpcycpXG5cbmNsYXNzIFJlZGlzQ29ubmVjdGlvbk1hbmFnZXJcbiAgX2Nvbm5lY3RlZENsaWVudHM6ICAgICAgICAgIHt9XG4gIF9jb25uZWN0ZWRDbGllbnRzQ2FsbGJhY2tzOiB7fVxuXG4gIGNvbm5lY3RlZENsaWVudHNGb3JVUkw6IChyZWRpc1VSTCkgLT5cbiAgICB1bmxlc3MgQF9jb25uZWN0ZWRDbGllbnRzW3JlZGlzVVJMXT9cbiAgICAgIEBfY29ubmVjdGVkQ2xpZW50c1tyZWRpc1VSTF0gPSB7fVxuXG4gICAgcmV0dXJuIEBfY29ubmVjdGVkQ2xpZW50c1tyZWRpc1VSTF1cblxuICBjb25uZWN0ZWRDbGllbnRzQ2FsbGJhY2tzRm9yVVJMOiAocmVkaXNVUkwpIC0+XG4gICAgdW5sZXNzIEBfY29ubmVjdGVkQ2xpZW50c0NhbGxiYWNrc1tyZWRpc1VSTF0/XG4gICAgICBAX2Nvbm5lY3RlZENsaWVudHNDYWxsYmFja3NbcmVkaXNVUkxdID0ge31cblxuICAgIHJldHVybiBAX2Nvbm5lY3RlZENsaWVudHNDYWxsYmFja3NbcmVkaXNVUkxdXG5cbiAgb2J0YWluQ2xpZW50OiAocmVkaXNVUkwsIGlkLCBjYikgLT5cbiAgICBjb25uZWN0ZWRDbGllbnRzRm9yVVJMICAgICAgICAgID0gQGNvbm5lY3RlZENsaWVudHNGb3JVUkwgcmVkaXNVUkxcbiAgICBjb25uZWN0ZWRDbGllbnRzQ2FsbGJhY2tzRm9yVVJMID0gQGNvbm5lY3RlZENsaWVudHNDYWxsYmFja3NGb3JVUkwgcmVkaXNVUkxcblxuICAgIHJldHVybiBjYihudWxsLCBjb25uZWN0ZWRDbGllbnRzRm9yVVJMW2lkXSkgaWYgY29ubmVjdGVkQ2xpZW50c0ZvclVSTFtpZF0/XG4gICAgcmV0dXJuIGNvbm5lY3RlZENsaWVudHNDYWxsYmFja3NGb3JVUkxbaWRdLnB1c2ggY2IgaWYgY29ubmVjdGVkQ2xpZW50c0NhbGxiYWNrc0ZvclVSTFtpZF0/XG5cbiAgICBjb25uZWN0ZWRDbGllbnRzQ2FsbGJhY2tzRm9yVVJMW2lkXSA9IFtjYl1cblxuICAgIEBfY3JlYXRlQ2xpZW50IHJlZGlzVVJMLCAoZXJyLCBjbGllbnQpIC0+XG4gICAgICBjb25uZWN0ZWRDbGllbnRzRm9yVVJMW2lkXSA9IGNsaWVudCB1bmxlc3MgZXJyXG4gICAgICBmb3IgY2FsbGJhY2sgaW4gY29ubmVjdGVkQ2xpZW50c0NhbGxiYWNrc0ZvclVSTFtpZF1cbiAgICAgICAgY2FsbGJhY2soZXJyLCBjbGllbnQpXG4gICAgICBjb25uZWN0ZWRDbGllbnRzQ2FsbGJhY2tzRm9yVVJMW2lkXSA9IHVuZGVmaW5lZFxuXG4gIF9jcmVhdGVDbGllbnQ6IChyZWRpc1VSTCwgY2IpIC0+XG4gICAgcGFyc2VkX3VybCAgPSB1cmwucGFyc2UgcmVkaXNVUkxcbiAgICBwYXJzZWRfYXV0aCA9IChwYXJzZWRfdXJsLmF1dGggPyAnJykuc3BsaXQgJzonXG4gICAgcGFzc3dvcmQgICAgPSBwYXJzZWRfYXV0aFsxXVxuICAgIHBhdGggICAgICAgID0gKHBhcnNlZF91cmwucGF0aG5hbWUgPyAnLycpLnNsaWNlIDFcbiAgICBkYXRhYmFzZSAgICA9IGlmIHBhdGgubGVuZ3RoIHRoZW4gcGF0aCBlbHNlICcwJ1xuXG4gICAgY2xpZW50ID0gcmVkaXMuY3JlYXRlQ2xpZW50IHBhcnNlZF91cmwucG9ydCwgcGFyc2VkX3VybC5ob3N0bmFtZSwgeyByZXRyeV9tYXhfZGVsYXk6IDEwMCB9XG5cbiAgICBpZiBwYXNzd29yZFxuICAgICAgY2xpZW50LmF1dGggcGFzc3dvcmQsIChlcnIpIC0+XG4gICAgICAgIGNiKGVycikgaWYgZXJyXG5cbiAgICBjbGllbnQuc2VsZWN0KGRhdGFiYXNlKVxuICAgIGNsaWVudC5vbiAncmVhZHknLCAoKSAtPlxuICAgICAgY2xpZW50LnNlbmRfYW55d2F5cyA9IHRydWVcbiAgICAgIGNsaWVudC5zZWxlY3QoZGF0YWJhc2UpXG4gICAgICBjbGllbnQuc2VuZF9hbnl3YXlzID0gZmFsc2VcbiAgICAgIGNiIG51bGwsIGNsaWVudFxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBSZWRpc0Nvbm5lY3Rpb25NYW5hZ2VyKClcbiJdfQ==