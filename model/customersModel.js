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
        unique: true,
        minlength: 10,
        maxlength: 10
    },
    personalid :{
        type: Number,
        unique: true,
        min: 1000000000000,
        max: 9999999999999
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