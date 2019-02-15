var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var nailSchema = Schema({
    _id: Schema.Types.ObjectId,
    Thumbnail: {
        type: String,
        unique: true
    },
    Price: {
        type: Number,
        unique: true
    },
    store: { type: Schema.Types.ObjectId, ref: 'Store' },
});

var Nail = mongoose.model('Nail', nailSchema);

module.exports = Nail;