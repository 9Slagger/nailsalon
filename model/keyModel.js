var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var keySchema = Schema({
    _id: Schema.Types.ObjectId,
    firstname: String,
});

var Key = mongoose.model('Key', keySchema);

module.exports = Key;