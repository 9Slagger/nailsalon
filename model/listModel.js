var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var listSchema = Schema({
    _id: Schema.Types.ObjectId,
    title: {
        type: String, unique: true
    },
    price: {
        type: Number, unique: true
    }
});

var List = mongoose.model('List', listSchema);

module.exports = List;