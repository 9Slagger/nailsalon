var mongoose = require('mongoose');
var keys = require('./config/keys');
mongoose.connect(keys.mongoURI, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = mongoose;