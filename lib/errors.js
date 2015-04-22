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
        }, 'ECONNREFUSED');
      case 1:
        return new RedisError('Host not found', err, {
          connectionOption: client.connectionOption
        }, 'ENOTFOUND');
      default:
        return new RedisError(msg, err, {
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

RedisError = (function(_super) {
  __extends(RedisError, _super);

  function RedisError() {
    return RedisError.__super__.constructor.apply(this, arguments);
  }

  RedisError.prototype.name = 'RedisError';

  return RedisError;

})(DbError);


/* */

exports.createError = createError;

exports.RedisError = RedisError;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVycm9ycy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSwyREFBQTtFQUFBO2lTQUFBOztBQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQUFKLENBQUE7O0FBQUEsWUFDQSxHQUFnQixPQUFBLENBQVEsZUFBUixDQURoQixDQUFBOztBQUFBLE9BRUEsR0FBZ0IsWUFBWSxDQUFDLE9BRjdCLENBQUE7O0FBQUEsUUFJQSxHQUFXLENBQUMsY0FBRCxFQUFpQixXQUFqQixDQUpYLENBQUE7O0FBQUEsV0FNQSxHQUFjLFNBQUMsR0FBRCxFQUFNLE1BQU4sR0FBQTtBQUNaLE1BQUEsVUFBQTtBQUFBLEVBQUEsSUFBQSxDQUFBLEdBQUE7QUFBQSxXQUFPLElBQVAsQ0FBQTtHQUFBO0FBRUEsRUFBQSxJQUFHLEdBQUcsQ0FBQyxPQUFQO0FBQ0UsSUFBQSxHQUFBLEdBQU0sR0FBRyxDQUFDLE9BQVYsQ0FBQTtBQUFBLElBQ0EsS0FBQSxHQUFRLENBQUMsQ0FBQyxTQUFGLENBQVksUUFBWixFQUFzQixTQUFDLElBQUQsR0FBQTtBQUM1QixhQUFPLEdBQUcsQ0FBQyxPQUFKLENBQVksSUFBWixDQUFBLEdBQW9CLENBQUEsQ0FBM0IsQ0FENEI7SUFBQSxDQUF0QixDQURSLENBQUE7QUFJQSxZQUFPLEtBQVA7QUFBQSxXQUNPLENBRFA7QUFFSSxlQUFXLElBQUEsVUFBQSxDQUFXLG9CQUFYLEVBQWlDLEdBQWpDLEVBQXNDO0FBQUEsVUFBQSxnQkFBQSxFQUFrQixNQUFNLENBQUMsZ0JBQXpCO1NBQXRDLEVBQWlGLGNBQWpGLENBQVgsQ0FGSjtBQUFBLFdBR08sQ0FIUDtBQUlJLGVBQVcsSUFBQSxVQUFBLENBQVcsZ0JBQVgsRUFBNkIsR0FBN0IsRUFBa0M7QUFBQSxVQUFBLGdCQUFBLEVBQWtCLE1BQU0sQ0FBQyxnQkFBekI7U0FBbEMsRUFBNkUsV0FBN0UsQ0FBWCxDQUpKO0FBQUE7QUFNSSxlQUFXLElBQUEsVUFBQSxDQUFXLEdBQVgsRUFBZ0IsR0FBaEIsRUFBcUI7QUFBQSxVQUFBLGdCQUFBLEVBQWtCLE1BQU0sQ0FBQyxnQkFBekI7U0FBckIsRUFBZ0UsU0FBaEUsQ0FBWCxDQU5KO0FBQUEsS0FMRjtHQUFBLE1BQUE7QUFhRSxXQUFXLElBQUEsVUFBQSxDQUFXLElBQVgsRUFBaUIsR0FBakIsRUFBc0I7QUFBQSxNQUFBLGdCQUFBLEVBQWtCLE1BQU0sQ0FBQyxnQkFBekI7S0FBdEIsRUFBaUUsU0FBakUsQ0FBWCxDQWJGO0dBSFk7QUFBQSxDQU5kLENBQUE7O0FBeUJBO0FBQUEsS0F6QkE7O0FBQUE7QUE2QkUsK0JBQUEsQ0FBQTs7OztHQUFBOztBQUFBLHVCQUFBLElBQUEsR0FBTSxZQUFOLENBQUE7O29CQUFBOztHQUZ1QixRQTNCekIsQ0FBQTs7QUFnQ0E7QUFBQSxLQWhDQTs7QUFBQSxPQWtDTyxDQUFDLFdBQVIsR0FBc0IsV0FsQ3RCLENBQUE7O0FBQUEsT0FtQ08sQ0FBQyxVQUFSLEdBQXFCLFVBbkNyQixDQUFBIiwiZmlsZSI6ImVycm9ycy5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIl8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuRXJyb3JIYW5kbGVyICA9IHJlcXVpcmUoJ2Vycm9yLWhhbmRsZXInKVxuRGJFcnJvciAgICAgICA9IEVycm9ySGFuZGxlci5EYkVycm9yXG5cbmVyckNvZGVzID0gWydFQ09OTlJFRlVTRUQnLCAnRU5PVEZPVU5EJ11cblxuY3JlYXRlRXJyb3IgPSAoZXJyLCBjbGllbnQpIC0+XG4gIHJldHVybiBudWxsIHVubGVzcyBlcnJcblxuICBpZiBlcnIubWVzc2FnZVxuICAgIG1zZyA9IGVyci5tZXNzYWdlXG4gICAgaW5kZXggPSBfLmZpbmRJbmRleCBlcnJDb2RlcywgKGNvZGUpIC0+XG4gICAgICByZXR1cm4gbXNnLmluZGV4T2YoY29kZSkgPiAtMVxuXG4gICAgc3dpdGNoIGluZGV4XG4gICAgICB3aGVuIDBcbiAgICAgICAgcmV0dXJuIG5ldyBSZWRpc0Vycm9yKCdDb25uZWN0aW9uIHJlZnVzZWQnLCBlcnIsIGNvbm5lY3Rpb25PcHRpb246IGNsaWVudC5jb25uZWN0aW9uT3B0aW9uLCAnRUNPTk5SRUZVU0VEJylcbiAgICAgIHdoZW4gMVxuICAgICAgICByZXR1cm4gbmV3IFJlZGlzRXJyb3IoJ0hvc3Qgbm90IGZvdW5kJywgZXJyLCBjb25uZWN0aW9uT3B0aW9uOiBjbGllbnQuY29ubmVjdGlvbk9wdGlvbiwgJ0VOT1RGT1VORCcpXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBuZXcgUmVkaXNFcnJvcihtc2csIGVyciwgY29ubmVjdGlvbk9wdGlvbjogY2xpZW50LmNvbm5lY3Rpb25PcHRpb24sICdFUlJFTFNFJylcbiAgZWxzZVxuICAgIHJldHVybiBuZXcgUmVkaXNFcnJvcihudWxsLCBlcnIsIGNvbm5lY3Rpb25PcHRpb246IGNsaWVudC5jb25uZWN0aW9uT3B0aW9uLCAnRVJSRUxTRScpXG5cblxuIyMjICMjI1xuIyBSZWRpc0Vycm9yIC0gdW5pdmVyc2FsIFJlZGlzIGVycm9yJ3NcbmNsYXNzIFJlZGlzRXJyb3IgZXh0ZW5kcyBEYkVycm9yXG5cbiAgbmFtZTogJ1JlZGlzRXJyb3InXG5cblxuIyMjICMjI1xuIyBFWFBPUlRTXG5leHBvcnRzLmNyZWF0ZUVycm9yID0gY3JlYXRlRXJyb3JcbmV4cG9ydHMuUmVkaXNFcnJvciA9IFJlZGlzRXJyb3JcbiJdfQ==