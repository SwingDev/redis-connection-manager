var DbError, ErrorHandler, RedisError, _, createError, errCodes,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require('lodash');

ErrorHandler = require.main.require('error-handler');

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
        }, 'ECONNREFUSED');
      case 1:
        return new RedisError('Host not found', err, {
          connectionOption: client.connectionOption
        }, 'ENOTFOUND');
      default:
        return new RedisError(null, err, {
          connectionOption: client.connectionOption
        }, 'ERRELSE');
    }
  } else {
    return new RedisError(null, err, {
      connectionOption: client.connectionOption
    }, 'ERRELSE');
  }
};


/* */

RedisError = (function(superClass) {
  extend(RedisError, superClass);

  function RedisError() {
    return RedisError.__super__.constructor.apply(this, arguments);
  }

  RedisError.prototype.name = 'RedisError';

  return RedisError;

})(DbError);


/* */

exports.createError = createError;

exports.RedisError = RedisError;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVycm9ycy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSwyREFBQTtFQUFBOzZCQUFBOztBQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQUFKLENBQUE7O0FBQUEsWUFDQSxHQUFnQixPQUFPLENBQUMsSUFBSSxDQUFDLE9BQWIsQ0FBcUIsZUFBckIsQ0FEaEIsQ0FBQTs7QUFBQSxPQUVBLEdBQWdCLFlBQVksQ0FBQyxPQUY3QixDQUFBOztBQUFBLFFBSUEsR0FBVyxDQUFDLGNBQUQsRUFBaUIsV0FBakIsQ0FKWCxDQUFBOztBQUFBLFdBTUEsR0FBYyxTQUFDLEdBQUQsRUFBTSxNQUFOLEdBQUE7QUFDWixNQUFBLFVBQUE7QUFBQSxFQUFBLElBQUEsQ0FBQSxHQUFBO0FBQUEsV0FBTyxJQUFQLENBQUE7R0FBQTtBQUVBLEVBQUEsSUFBRyxHQUFHLENBQUMsT0FBUDtBQUNFLElBQUEsR0FBQSxHQUFNLEdBQUcsQ0FBQyxPQUFWLENBQUE7QUFBQSxJQUNBLEtBQUEsR0FBUSxDQUFDLENBQUMsU0FBRixDQUFZLFFBQVosRUFBc0IsU0FBQyxJQUFELEdBQUE7QUFDNUIsYUFBTyxHQUFHLENBQUMsT0FBSixDQUFZLElBQVosQ0FBQSxHQUFvQixDQUFBLENBQTNCLENBRDRCO0lBQUEsQ0FBdEIsQ0FEUixDQUFBO0FBSUEsWUFBTyxLQUFQO0FBQUEsV0FDTyxDQURQO0FBRUksZUFBVyxJQUFBLFVBQUEsQ0FBVyxvQkFBWCxFQUFpQyxHQUFqQyxFQUFzQztBQUFBLFVBQUEsZ0JBQUEsRUFBa0IsTUFBTSxDQUFDLGdCQUF6QjtTQUF0QyxFQUFpRixjQUFqRixDQUFYLENBRko7QUFBQSxXQUdPLENBSFA7QUFJSSxlQUFXLElBQUEsVUFBQSxDQUFXLGdCQUFYLEVBQTZCLEdBQTdCLEVBQWtDO0FBQUEsVUFBQSxnQkFBQSxFQUFrQixNQUFNLENBQUMsZ0JBQXpCO1NBQWxDLEVBQTZFLFdBQTdFLENBQVgsQ0FKSjtBQUFBO0FBTUksZUFBVyxJQUFBLFVBQUEsQ0FBVyxJQUFYLEVBQWlCLEdBQWpCLEVBQXNCO0FBQUEsVUFBQSxnQkFBQSxFQUFrQixNQUFNLENBQUMsZ0JBQXpCO1NBQXRCLEVBQWlFLFNBQWpFLENBQVgsQ0FOSjtBQUFBLEtBTEY7R0FBQSxNQUFBO0FBYUUsV0FBVyxJQUFBLFVBQUEsQ0FBVyxJQUFYLEVBQWlCLEdBQWpCLEVBQXNCO0FBQUEsTUFBQSxnQkFBQSxFQUFrQixNQUFNLENBQUMsZ0JBQXpCO0tBQXRCLEVBQWlFLFNBQWpFLENBQVgsQ0FiRjtHQUhZO0FBQUEsQ0FOZCxDQUFBOztBQXlCQTtBQUFBLEtBekJBOztBQUFBO0FBNkJFLGdDQUFBLENBQUE7Ozs7R0FBQTs7QUFBQSx1QkFBQSxJQUFBLEdBQU0sWUFBTixDQUFBOztvQkFBQTs7R0FGdUIsUUEzQnpCLENBQUE7O0FBZ0NBO0FBQUEsS0FoQ0E7O0FBQUEsT0FrQ08sQ0FBQyxXQUFSLEdBQXNCLFdBbEN0QixDQUFBOztBQUFBLE9BbUNPLENBQUMsVUFBUixHQUFxQixVQW5DckIsQ0FBQSIsImZpbGUiOiJlcnJvcnMuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJfID0gcmVxdWlyZSgnbG9kYXNoJylcbkVycm9ySGFuZGxlciAgPSByZXF1aXJlLm1haW4ucmVxdWlyZSgnZXJyb3ItaGFuZGxlcicpXG5EYkVycm9yICAgICAgID0gRXJyb3JIYW5kbGVyLkRiRXJyb3JcblxuZXJyQ29kZXMgPSBbJ0VDT05OUkVGVVNFRCcsICdFTk9URk9VTkQnXVxuXG5jcmVhdGVFcnJvciA9IChlcnIsIGNsaWVudCkgLT5cbiAgcmV0dXJuIG51bGwgdW5sZXNzIGVyclxuXG4gIGlmIGVyci5tZXNzYWdlXG4gICAgbXNnID0gZXJyLm1lc3NhZ2VcbiAgICBpbmRleCA9IF8uZmluZEluZGV4IGVyckNvZGVzLCAoY29kZSkgLT5cbiAgICAgIHJldHVybiBtc2cuaW5kZXhPZihjb2RlKSA+IC0xXG5cbiAgICBzd2l0Y2ggaW5kZXhcbiAgICAgIHdoZW4gMFxuICAgICAgICByZXR1cm4gbmV3IFJlZGlzRXJyb3IoJ0Nvbm5lY3Rpb24gcmVmdXNlZCcsIGVyciwgY29ubmVjdGlvbk9wdGlvbjogY2xpZW50LmNvbm5lY3Rpb25PcHRpb24sICdFQ09OTlJFRlVTRUQnKVxuICAgICAgd2hlbiAxXG4gICAgICAgIHJldHVybiBuZXcgUmVkaXNFcnJvcignSG9zdCBub3QgZm91bmQnLCBlcnIsIGNvbm5lY3Rpb25PcHRpb246IGNsaWVudC5jb25uZWN0aW9uT3B0aW9uLCAnRU5PVEZPVU5EJylcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIG5ldyBSZWRpc0Vycm9yKG51bGwsIGVyciwgY29ubmVjdGlvbk9wdGlvbjogY2xpZW50LmNvbm5lY3Rpb25PcHRpb24sICdFUlJFTFNFJylcbiAgZWxzZVxuICAgIHJldHVybiBuZXcgUmVkaXNFcnJvcihudWxsLCBlcnIsIGNvbm5lY3Rpb25PcHRpb246IGNsaWVudC5jb25uZWN0aW9uT3B0aW9uLCAnRVJSRUxTRScpXG5cblxuIyMjICMjI1xuIyBSZWRpc0Vycm9yIC0gdW5pdmVyc2FsIFJlZGlzIGVycm9yJ3NcbmNsYXNzIFJlZGlzRXJyb3IgZXh0ZW5kcyBEYkVycm9yXG5cbiAgbmFtZTogJ1JlZGlzRXJyb3InXG5cblxuIyMjICMjI1xuIyBFWFBPUlRTXG5leHBvcnRzLmNyZWF0ZUVycm9yID0gY3JlYXRlRXJyb3JcbmV4cG9ydHMuUmVkaXNFcnJvciA9IFJlZGlzRXJyb3JcbiJdfQ==