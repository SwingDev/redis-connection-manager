var DbError, ErrorHandler, RedisError, createError, errCodes, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ = require('lodash');

ErrorHandler = require('error-handler');

DbError = ErrorHandler.DbError;

errCodes = ['ECONNREFUSED', 'ENOTFOUND'];

createError = function(err, client) {
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

exports.createError = createError;

exports.RedisError = RedisError;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVycm9ycy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSwyREFBQTtFQUFBO2lTQUFBOztBQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQUFKLENBQUE7O0FBQUEsWUFDQSxHQUFlLE9BQUEsQ0FBUSxlQUFSLENBRGYsQ0FBQTs7QUFBQSxPQUdBLEdBQVUsWUFBWSxDQUFDLE9BSHZCLENBQUE7O0FBQUEsUUFJQSxHQUFXLENBQUMsY0FBRCxFQUFpQixXQUFqQixDQUpYLENBQUE7O0FBQUEsV0FNQSxHQUFjLFNBQUMsR0FBRCxFQUFNLE1BQU4sR0FBQTtBQUNaLE1BQUEsVUFBQTtBQUFBLEVBQUEsSUFBQSxDQUFBLEdBQUE7QUFBQSxXQUFPLElBQVAsQ0FBQTtHQUFBO0FBRUEsRUFBQSxJQUFHLEdBQUcsQ0FBQyxPQUFQO0FBQ0UsSUFBQSxHQUFBLEdBQU0sR0FBRyxDQUFDLE9BQVYsQ0FBQTtBQUFBLElBQ0EsS0FBQSxHQUFRLENBQUMsQ0FBQyxTQUFGLENBQVksUUFBWixFQUFzQixTQUFDLElBQUQsR0FBQTtBQUM1QixhQUFPLEdBQUcsQ0FBQyxPQUFKLENBQVksSUFBWixDQUFBLEdBQW9CLENBQUEsQ0FBM0IsQ0FENEI7SUFBQSxDQUF0QixDQURSLENBQUE7QUFJQSxZQUFPLEtBQVA7QUFBQSxXQUNPLENBRFA7QUFFSSxlQUFXLElBQUEsVUFBQSxDQUFXLG9CQUFYLEVBQWlDLEdBQWpDLEVBQXNDO0FBQUEsVUFBQSxnQkFBQSxFQUFrQixNQUFNLENBQUMsZ0JBQXpCO1NBQXRDLENBQVgsQ0FGSjtBQUFBLFdBR08sQ0FIUDtBQUlJLGVBQVcsSUFBQSxVQUFBLENBQVcsZ0JBQVgsRUFBNkIsR0FBN0IsRUFBa0M7QUFBQSxVQUFBLGdCQUFBLEVBQWtCLE1BQU0sQ0FBQyxnQkFBekI7U0FBbEMsQ0FBWCxDQUpKO0FBQUE7QUFNSSxlQUFXLElBQUEsVUFBQSxDQUFXLElBQVgsRUFBaUIsR0FBakIsRUFBc0I7QUFBQSxVQUFBLGdCQUFBLEVBQWtCLE1BQU0sQ0FBQyxnQkFBekI7U0FBdEIsQ0FBWCxDQU5KO0FBQUEsS0FMRjtHQUFBLE1BQUE7QUFhRSxXQUFXLElBQUEsVUFBQSxDQUFXLElBQVgsRUFBaUIsR0FBakIsRUFBc0I7QUFBQSxNQUFBLGdCQUFBLEVBQWtCLE1BQU0sQ0FBQyxnQkFBekI7S0FBdEIsQ0FBWCxDQWJGO0dBSFk7QUFBQSxDQU5kLENBQUE7O0FBeUJBO0FBQUEsS0F6QkE7O0FBQUE7QUE2QkUsK0JBQUEsQ0FBQTs7OztHQUFBOztBQUFBLHVCQUFBLElBQUEsR0FBTSxZQUFOLENBQUE7O29CQUFBOztHQUZ1QixRQTNCekIsQ0FBQTs7QUFBQSxPQWdDTyxDQUFDLFdBQVIsR0FBc0IsV0FoQ3RCLENBQUE7O0FBQUEsT0FpQ08sQ0FBQyxVQUFSLEdBQXFCLFVBakNyQixDQUFBIiwiZmlsZSI6ImVycm9ycy5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIl8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuRXJyb3JIYW5kbGVyID0gcmVxdWlyZSgnZXJyb3ItaGFuZGxlcicpXG5cbkRiRXJyb3IgPSBFcnJvckhhbmRsZXIuRGJFcnJvclxuZXJyQ29kZXMgPSBbJ0VDT05OUkVGVVNFRCcsICdFTk9URk9VTkQnXVxuXG5jcmVhdGVFcnJvciA9IChlcnIsIGNsaWVudCkgLT5cbiAgcmV0dXJuIG51bGwgdW5sZXNzIGVyclxuXG4gIGlmIGVyci5tZXNzYWdlXG4gICAgbXNnID0gZXJyLm1lc3NhZ2VcbiAgICBpbmRleCA9IF8uZmluZEluZGV4IGVyckNvZGVzLCAoY29kZSkgLT5cbiAgICAgIHJldHVybiBtc2cuaW5kZXhPZihjb2RlKSA+IC0xXG5cbiAgICBzd2l0Y2ggaW5kZXhcbiAgICAgIHdoZW4gMFxuICAgICAgICByZXR1cm4gbmV3IFJlZGlzRXJyb3IoJ0Nvbm5lY3Rpb24gcmVmdXNlZCcsIGVyciwgY29ubmVjdGlvbk9wdGlvbjogY2xpZW50LmNvbm5lY3Rpb25PcHRpb24pXG4gICAgICB3aGVuIDFcbiAgICAgICAgcmV0dXJuIG5ldyBSZWRpc0Vycm9yKCdIb3N0IG5vdCBmb3VuZCcsIGVyciwgY29ubmVjdGlvbk9wdGlvbjogY2xpZW50LmNvbm5lY3Rpb25PcHRpb24pXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBuZXcgUmVkaXNFcnJvcihudWxsLCBlcnIsIGNvbm5lY3Rpb25PcHRpb246IGNsaWVudC5jb25uZWN0aW9uT3B0aW9uKVxuICBlbHNlXG4gICAgcmV0dXJuIG5ldyBSZWRpc0Vycm9yKG51bGwsIGVyciwgY29ubmVjdGlvbk9wdGlvbjogY2xpZW50LmNvbm5lY3Rpb25PcHRpb24pXG5cblxuIyMjICMjI1xuIyBSZWRpc0Vycm9yIC0gdW5pdmVyc2FsIFJlZGlzIGNvbm5lY3Rpb24gZXJyb3Inc1xuY2xhc3MgUmVkaXNFcnJvciBleHRlbmRzIERiRXJyb3JcblxuICBuYW1lOiAnUmVkaXNFcnJvcidcblxuXG5leHBvcnRzLmNyZWF0ZUVycm9yID0gY3JlYXRlRXJyb3JcbmV4cG9ydHMuUmVkaXNFcnJvciA9IFJlZGlzRXJyb3JcbiJdfQ==