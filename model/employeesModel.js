var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var employeeSchema = Schema({
    _id: Schema.Types.ObjectId,
    username: {
        type: String,
        lowercase: true,
        unique: true
    },
    password: String,
    age: Number,
    queues: [{ type: Schema.Types.ObjectId, ref: 'queues' }]
});

var Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;