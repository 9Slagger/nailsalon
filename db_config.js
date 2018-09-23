var mongoose = require('mongoose');
var keys = require('./config/keys');
// mongoose.connect('mongodb://localhost/dental');
// mongodb://<dbuser>:<dbpassword>@ds111963.mlab.com:11963/dental
mongoose.connect(keys.mongoURI, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = mongoose;