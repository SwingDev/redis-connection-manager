var DbError, ErrorHandler, RedisError, _, createError, errCodes,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JzLmpzIiwic291cmNlcyI6WyJlcnJvcnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsMkRBQUE7RUFBQTs7O0FBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztBQUNKLFlBQUEsR0FBZ0IsT0FBQSxDQUFRLGVBQVI7O0FBQ2hCLE9BQUEsR0FBZ0IsWUFBWSxDQUFDOztBQUU3QixRQUFBLEdBQVcsQ0FBQyxjQUFELEVBQWlCLFdBQWpCOztBQUVYLFdBQUEsR0FBYyxTQUFDLEdBQUQsRUFBTSxNQUFOO0FBQ1osTUFBQTtFQUFBLElBQUEsQ0FBbUIsR0FBbkI7QUFBQSxXQUFPLEtBQVA7O0VBRUEsSUFBRyxHQUFHLENBQUMsT0FBUDtJQUNFLEdBQUEsR0FBTSxHQUFHLENBQUM7SUFDVixLQUFBLEdBQVEsQ0FBQyxDQUFDLFNBQUYsQ0FBWSxRQUFaLEVBQXNCLFNBQUMsSUFBRDtBQUM1QixhQUFPLEdBQUcsQ0FBQyxPQUFKLENBQVksSUFBWixDQUFBLEdBQW9CLENBQUM7SUFEQSxDQUF0QjtBQUdSLFlBQU8sS0FBUDtBQUFBLFdBQ08sQ0FEUDtBQUVJLGVBQU8sSUFBSSxVQUFKLENBQWUsb0JBQWYsRUFBcUMsR0FBckMsRUFBMEM7VUFBQSxnQkFBQSxFQUFrQixNQUFNLENBQUMsZ0JBQXpCO1NBQTFDLEVBQXFGLGNBQXJGO0FBRlgsV0FHTyxDQUhQO0FBSUksZUFBTyxJQUFJLFVBQUosQ0FBZSxnQkFBZixFQUFpQyxHQUFqQyxFQUFzQztVQUFBLGdCQUFBLEVBQWtCLE1BQU0sQ0FBQyxnQkFBekI7U0FBdEMsRUFBaUYsV0FBakY7QUFKWDtBQU1JLGVBQU8sSUFBSSxVQUFKLENBQWUsR0FBZixFQUFvQixHQUFwQixFQUF5QjtVQUFBLGdCQUFBLEVBQWtCLE1BQU0sQ0FBQyxnQkFBekI7U0FBekIsRUFBb0UsU0FBcEU7QUFOWCxLQUxGO0dBQUEsTUFBQTtBQWFFLFdBQU8sSUFBSSxVQUFKLENBQWUsSUFBZixFQUFxQixHQUFyQixFQUEwQjtNQUFBLGdCQUFBLEVBQWtCLE1BQU0sQ0FBQyxnQkFBekI7S0FBMUIsRUFBcUUsU0FBckUsRUFiVDs7QUFIWTs7O0FBbUJkOztBQUVNOzs7Ozs7O3VCQUVKLElBQUEsR0FBTTs7OztHQUZpQjs7O0FBS3pCOztBQUVBLE9BQU8sQ0FBQyxXQUFSLEdBQXNCOztBQUN0QixPQUFPLENBQUMsVUFBUixHQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIl8gPSByZXF1aXJlKCdsb2Rhc2gnKVxuRXJyb3JIYW5kbGVyICA9IHJlcXVpcmUoJ2Vycm9yLWhhbmRsZXInKVxuRGJFcnJvciAgICAgICA9IEVycm9ySGFuZGxlci5EYkVycm9yXG5cbmVyckNvZGVzID0gWydFQ09OTlJFRlVTRUQnLCAnRU5PVEZPVU5EJ11cblxuY3JlYXRlRXJyb3IgPSAoZXJyLCBjbGllbnQpIC0+XG4gIHJldHVybiBudWxsIHVubGVzcyBlcnJcblxuICBpZiBlcnIubWVzc2FnZVxuICAgIG1zZyA9IGVyci5tZXNzYWdlXG4gICAgaW5kZXggPSBfLmZpbmRJbmRleCBlcnJDb2RlcywgKGNvZGUpIC0+XG4gICAgICByZXR1cm4gbXNnLmluZGV4T2YoY29kZSkgPiAtMVxuXG4gICAgc3dpdGNoIGluZGV4XG4gICAgICB3aGVuIDBcbiAgICAgICAgcmV0dXJuIG5ldyBSZWRpc0Vycm9yKCdDb25uZWN0aW9uIHJlZnVzZWQnLCBlcnIsIGNvbm5lY3Rpb25PcHRpb246IGNsaWVudC5jb25uZWN0aW9uT3B0aW9uLCAnRUNPTk5SRUZVU0VEJylcbiAgICAgIHdoZW4gMVxuICAgICAgICByZXR1cm4gbmV3IFJlZGlzRXJyb3IoJ0hvc3Qgbm90IGZvdW5kJywgZXJyLCBjb25uZWN0aW9uT3B0aW9uOiBjbGllbnQuY29ubmVjdGlvbk9wdGlvbiwgJ0VOT1RGT1VORCcpXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBuZXcgUmVkaXNFcnJvcihtc2csIGVyciwgY29ubmVjdGlvbk9wdGlvbjogY2xpZW50LmNvbm5lY3Rpb25PcHRpb24sICdFUlJFTFNFJylcbiAgZWxzZVxuICAgIHJldHVybiBuZXcgUmVkaXNFcnJvcihudWxsLCBlcnIsIGNvbm5lY3Rpb25PcHRpb246IGNsaWVudC5jb25uZWN0aW9uT3B0aW9uLCAnRVJSRUxTRScpXG5cblxuIyMjICMjI1xuIyBSZWRpc0Vycm9yIC0gdW5pdmVyc2FsIFJlZGlzIGVycm9yJ3NcbmNsYXNzIFJlZGlzRXJyb3IgZXh0ZW5kcyBEYkVycm9yXG5cbiAgbmFtZTogJ1JlZGlzRXJyb3InXG5cblxuIyMjICMjI1xuIyBFWFBPUlRTXG5leHBvcnRzLmNyZWF0ZUVycm9yID0gY3JlYXRlRXJyb3JcbmV4cG9ydHMuUmVkaXNFcnJvciA9IFJlZGlzRXJyb3JcbiJdfQ==
