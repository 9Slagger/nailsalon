var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var doctorSchema = Schema({
    _id: Schema.Types.ObjectId,
    username: {
        type: String,
        lowercase: true,
        unique: true
    },
    password: String,
    firstname: String,
    lastname: String,
    phone: String,
    address: String,
    birthday: Date,
    record_date: Date,
    queues: [{ type: Schema.Types.ObjectId, ref: 'queues' }]
});

var Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
