var DbError, ErrorHandler, RedisConnError, createError, errCodes, _,
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
        return new RedisConnError('Connection refused', err, {
          connectionOption: client.connectionOption
        });
      case 1:
        return new RedisConnError('Host not found', err, {
          connectionOption: client.connectionOption
        });
      default:
        return new RedisConnError(null, err, {
          connectionOption: client.connectionOption
        });
    }
  } else {
    return new RedisConnError(null, err, {
      connectionOption: client.connectionOption
    });
  }
};


/* */

RedisConnError = (function(_super) {
  __extends(RedisConnError, _super);

  function RedisConnError() {
    return RedisConnError.__super__.constructor.apply(this, arguments);
  }

  RedisConnError.prototype.name = 'RedisConnError';

  return RedisConnError;

})(DbError);

exports.createError = createError;

exports.RedisConnError = RedisConnError;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVycm9ycy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSwrREFBQTtFQUFBO2lTQUFBOztBQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQUFKLENBQUE7O0FBQUEsWUFDQSxHQUFlLE9BQUEsQ0FBUSxlQUFSLENBRGYsQ0FBQTs7QUFBQSxPQUdBLEdBQVUsWUFBWSxDQUFDLE9BSHZCLENBQUE7O0FBQUEsUUFJQSxHQUFXLENBQUMsY0FBRCxFQUFpQixXQUFqQixDQUpYLENBQUE7O0FBQUEsV0FNQSxHQUFjLFNBQUMsR0FBRCxFQUFNLE1BQU4sR0FBQTtBQUNaLE1BQUEsVUFBQTtBQUFBLEVBQUEsSUFBQSxDQUFBLEdBQUE7QUFBQSxXQUFPLElBQVAsQ0FBQTtHQUFBO0FBRUEsRUFBQSxJQUFHLEdBQUcsQ0FBQyxPQUFQO0FBQ0UsSUFBQSxHQUFBLEdBQU0sR0FBRyxDQUFDLE9BQVYsQ0FBQTtBQUFBLElBQ0EsS0FBQSxHQUFRLENBQUMsQ0FBQyxTQUFGLENBQVksUUFBWixFQUFzQixTQUFDLElBQUQsR0FBQTtBQUM1QixhQUFPLEdBQUcsQ0FBQyxPQUFKLENBQVksSUFBWixDQUFBLEdBQW9CLENBQUEsQ0FBM0IsQ0FENEI7SUFBQSxDQUF0QixDQURSLENBQUE7QUFJQSxZQUFPLEtBQVA7QUFBQSxXQUNPLENBRFA7QUFFSSxlQUFXLElBQUEsY0FBQSxDQUFlLG9CQUFmLEVBQXFDLEdBQXJDLEVBQTBDO0FBQUEsVUFBQSxnQkFBQSxFQUFrQixNQUFNLENBQUMsZ0JBQXpCO1NBQTFDLENBQVgsQ0FGSjtBQUFBLFdBR08sQ0FIUDtBQUlJLGVBQVcsSUFBQSxjQUFBLENBQWUsZ0JBQWYsRUFBaUMsR0FBakMsRUFBc0M7QUFBQSxVQUFBLGdCQUFBLEVBQWtCLE1BQU0sQ0FBQyxnQkFBekI7U0FBdEMsQ0FBWCxDQUpKO0FBQUE7QUFNSSxlQUFXLElBQUEsY0FBQSxDQUFlLElBQWYsRUFBcUIsR0FBckIsRUFBMEI7QUFBQSxVQUFBLGdCQUFBLEVBQWtCLE1BQU0sQ0FBQyxnQkFBekI7U0FBMUIsQ0FBWCxDQU5KO0FBQUEsS0FMRjtHQUFBLE1BQUE7QUFhRSxXQUFXLElBQUEsY0FBQSxDQUFlLElBQWYsRUFBcUIsR0FBckIsRUFBMEI7QUFBQSxNQUFBLGdCQUFBLEVBQWtCLE1BQU0sQ0FBQyxnQkFBekI7S0FBMUIsQ0FBWCxDQWJGO0dBSFk7QUFBQSxDQU5kLENBQUE7O0FBeUJBO0FBQUEsS0F6QkE7O0FBQUE7QUE2QkUsbUNBQUEsQ0FBQTs7OztHQUFBOztBQUFBLDJCQUFBLElBQUEsR0FBTSxnQkFBTixDQUFBOzt3QkFBQTs7R0FGMkIsUUEzQjdCLENBQUE7O0FBQUEsT0FnQ08sQ0FBQyxXQUFSLEdBQXNCLFdBaEN0QixDQUFBOztBQUFBLE9BaUNPLENBQUMsY0FBUixHQUF5QixjQWpDekIsQ0FBQSIsImZpbGUiOiJlcnJvcnMuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJfID0gcmVxdWlyZSgnbG9kYXNoJylcbkVycm9ySGFuZGxlciA9IHJlcXVpcmUoJ2Vycm9yLWhhbmRsZXInKVxuXG5EYkVycm9yID0gRXJyb3JIYW5kbGVyLkRiRXJyb3JcbmVyckNvZGVzID0gWydFQ09OTlJFRlVTRUQnLCAnRU5PVEZPVU5EJ11cblxuY3JlYXRlRXJyb3IgPSAoZXJyLCBjbGllbnQpIC0+XG4gIHJldHVybiBudWxsIHVubGVzcyBlcnJcblxuICBpZiBlcnIubWVzc2FnZVxuICAgIG1zZyA9IGVyci5tZXNzYWdlXG4gICAgaW5kZXggPSBfLmZpbmRJbmRleCBlcnJDb2RlcywgKGNvZGUpIC0+XG4gICAgICByZXR1cm4gbXNnLmluZGV4T2YoY29kZSkgPiAtMVxuXG4gICAgc3dpdGNoIGluZGV4XG4gICAgICB3aGVuIDBcbiAgICAgICAgcmV0dXJuIG5ldyBSZWRpc0Nvbm5FcnJvcignQ29ubmVjdGlvbiByZWZ1c2VkJywgZXJyLCBjb25uZWN0aW9uT3B0aW9uOiBjbGllbnQuY29ubmVjdGlvbk9wdGlvbilcbiAgICAgIHdoZW4gMVxuICAgICAgICByZXR1cm4gbmV3IFJlZGlzQ29ubkVycm9yKCdIb3N0IG5vdCBmb3VuZCcsIGVyciwgY29ubmVjdGlvbk9wdGlvbjogY2xpZW50LmNvbm5lY3Rpb25PcHRpb24pXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBuZXcgUmVkaXNDb25uRXJyb3IobnVsbCwgZXJyLCBjb25uZWN0aW9uT3B0aW9uOiBjbGllbnQuY29ubmVjdGlvbk9wdGlvbilcbiAgZWxzZVxuICAgIHJldHVybiBuZXcgUmVkaXNDb25uRXJyb3IobnVsbCwgZXJyLCBjb25uZWN0aW9uT3B0aW9uOiBjbGllbnQuY29ubmVjdGlvbk9wdGlvbilcblxuXG4jIyMgIyMjXG4jIFJlZGlzQ29ubkVycm9yIC0gdW5pdmVyc2FsIFJlZGlzIGNvbm5lY3Rpb24gZXJyb3Inc1xuY2xhc3MgUmVkaXNDb25uRXJyb3IgZXh0ZW5kcyBEYkVycm9yXG5cbiAgbmFtZTogJ1JlZGlzQ29ubkVycm9yJ1xuXG5cbmV4cG9ydHMuY3JlYXRlRXJyb3IgPSBjcmVhdGVFcnJvclxuZXhwb3J0cy5SZWRpc0Nvbm5FcnJvciA9IFJlZGlzQ29ubkVycm9yXG4iXX0=