var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roomSchema = Schema({
    _id: Schema.Types.ObjectId,
    room_name: {
        type: Number,
        unique: true
    },

    room_usage: [{ type: Schema.Types.ObjectId, ref: 'Room_usage' }]
});

var Room = mongoose.model('Room', roomSchema);

module.exports = Room;