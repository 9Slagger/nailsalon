var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var queueSchema = Schema({
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    employee: { type: Schema.Types.ObjectId, ref: 'Employee' },
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor' },
    room_usage: { type: Schema.Types.ObjectId, ref: 'Room_usage' },

    title: String,//เปลี่ยนยางจัดฟัน
    description: String,//รายละเอียด

    appointment_date: Date,//วันเวลาที่นัด
    record_date: Date,//วันเวลาที่บันทึกการนัด

    queue_order: Number,//ลำดับคิว
    priority: Number,//ลำดับความสำคัญ
    queue_date: Date,//วันเวลาที่รับคิว

    status: String,
});

var Queue = mongoose.model('Queue', queueSchema);

module.exports = Queue;