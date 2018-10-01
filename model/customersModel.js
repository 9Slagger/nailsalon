var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var customerSchema = Schema({
    _id: Schema.Types.ObjectId,
    username: {
        type: String,
        lowercase: true,
        unique: true
    },
    password: String,
    firstname: String,
    lastname: String,
    phone: {
        type: String,
        unique: true
    },
    personalid :{
        type: Number,
        unique: true
    },
    address: String,
    allergy_history: String,
    birthday: Date,
    record_date: Date,
    employee: { type: Schema.Types.ObjectId, ref: 'Employee' },
    queues: [{ type: Schema.Types.ObjectId, ref: 'queues' }]
});

var Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;