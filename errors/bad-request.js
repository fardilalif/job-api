const CustomError = require('./custom-error.js');
const { StatusCodes } = require('http-status-codes');

class BadRequest extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequest;
