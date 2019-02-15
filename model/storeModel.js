var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var storeSchema = Schema({
    _id: Schema.Types.ObjectId,
    Storename: {
        type: String,
        unique: true
    },
    Address: {
        type: String,
        unique: true
    },
    Map: {
        type: String,
        unique: true
    },
    Fbname: {
        type: String,
        unique: true
    },
    Fbpage: {
        type: String,
        unique: true
    },
    Igname: {
        type: String,
        unique: true
    },
    Igpage: {
        type: String,
        unique: true
    },
    nails: [{ type: Schema.Types.ObjectId, ref: 'Nails' }]
});

var Store = mongoose.model('Store', storeSchema);

module.exports = Store;