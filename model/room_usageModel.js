var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var room_usageSchema = Schema({
    room: { type: Schema.Types.ObjectId, ref: 'Room' },
    employee: { type: Schema.Types.ObjectId, ref: 'Employee' },
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor' },

    room_name: Number,
    status: String,
    usage_date: Date,
    record_date: Date
});

var Room_usage = mongoose.model('Room_usage', room_usageSchema);

module.exports = Room_usage;