const express = require('express')
const app = express.Router()
var bcrypt = require('bcryptjs')
const { getToken, verifyToken } = require('./jwtHandler')
const mongoose = require('./db_config')
const Customer = require('./model/customersModel')
const Employee = require('./model/employeesModel')
const Doctor = require('./model/doctorsModel')
const Queue = require('./model/queuesModel')
const Room = require('./model/roomModel')
const Room_usage = require('./model/room_usageModel')

// --------------------------------------------

const result_failed = {
  result: "failed",
  data: ""
};

// ---------- employee registor
app.post('/employee/register', (req, res) => {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  req.body.password = hashedPassword;

  var employee = new Employee({
    _id: new mongoose.Types.ObjectId(),
    username: req.body.username,
    password: req.body.password,
    age: req.body.age || 15
  });
  employee.save(function (err, data) {
    if (err) {
      res.set({ 'status': '400' });
      res.status(400).json(result_failed);
    }
    else {
      const finalResult = {
        result: "success",
        data: " "
      };
      res.set({ 'status': '201' });
      res.status(201).json({ result: "success " + data.username })
    }
  });
});

// ---------- employee login
app.post('/employee/login', (req, res) => {
  Employee.find({ 'username': req.body.username }, (err, result) => {
    // console.log(result)
    if (err) {
      res.json(result_failed);
    } else {
      if (result.length > 0) {
        const passwordIsValid = bcrypt.compareSync(req.body.password, result[0].password);
        if (!passwordIsValid) return res.json(result_failed);

        var _username = result[0].username;
        var _id = result[0].id;
        var _type = "employee";

        var token = getToken({ id: _id, username: _username, type: _type })

        const finalResult = {
          result: "Employee Login success",
          token: token
        };
        res.set({ 'status': '200' });
        res.status(200).json(finalResult);
      } else {
        const finalResult = {
          result: "failed",
          data: " "
        };
        res.set({ 'status': '401' });
        res.status(401).json(finalResult);
      }
    }
  });
});

// ---------- customer registor
app.post('/customer/register', verifyToken, (req, res) => {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  req.body.password = hashedPassword;

  var customer = new Customer({
    _id: new mongoose.Types.ObjectId(),
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    phone: req.body.phone,
    address: req.body.address,
    allergy_history: req.body.allergy_history,
    birthday: req.body.birthday,
    personalid: req.body.personalid,
    record_date: new Date(),
    employee: res.is
  });
  customer.save(function (err, data) {
    if (err) {
      res.set({ 'status': '400' });
      res.json(result_failed);
    }
    else {
      const finalResult = {
        result: "success",
        data: " "
      };
      res.set({ 'status': '201' });
      res.status(201).json({ result: "success " + data.username })
    }
  });
});

// ---------- customer login
app.post('/customer/login', (req, res) => {
  Customer.find({ 'username': req.body.username }, (err, result) => {
    if (err) {
      res.json(result_failed);
    } else {
      if (result.length > 0) {
        const passwordIsValid = bcrypt.compareSync(req.body.password, result[0].password);
        if (!passwordIsValid) return res.json(result_failed);

        var _username = result[0].username;
        var _id = result[0].id;
        var _type = "customer";

        var token = getToken({ id: _id, username: _username, type: _type })

        const finalResult = {
          id: _id,
          result: "Customer Login success",
          token: token
        };
        res.set({ 'status': '200' });
        res.status(200).json(finalResult);
      } else {
        const finalResult = {
          result: "failed",
          data: " "
        };
        res.set({ 'status': '401' });
        res.status(401).json(finalResult);
      }
    }
  });
});

// ---------- doctor registor
app.post('/doctor/register', (req, res) => {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  req.body.password = hashedPassword;

  let doctor = new Doctor({
    _id: new mongoose.Types.ObjectId(),
    username: req.body.username,
    password: req.body.password,
    age: req.body.age || 15
  });
  doctor.save(function (err, data) {
    if (err) {
      res.set({ 'status': '400' });
      res.json(result_failed);
    }
    else {
      const finalResult = {
        result: "success",
        data: " "
      };
      res.set({ 'status': '201' });
      res.status(201).json({ result: "success " + data.username })
    }
  });
});

// ---------- doctor login
app.post('/doctor/login', (req, res) => {
  Doctor.find({ 'username': req.body.username }, (err, result) => {
    if (err) {
      res.json(result_failed);
    } else {
      if (result.length > 0) {
        const passwordIsValid = bcrypt.compareSync(req.body.password, result[0].password);
        if (!passwordIsValid) return res.json(result_failed);

        var _username = result[0].username;
        var _id = result[0].id;
        var _type = "doctor";

        var token = getToken({ id: _id, username: _username, type: _type })

        const finalResult = {
          result: "Doctor Login success",
          token: token
        };
        res.set({ 'status': '200' });
        res.status(200).json(finalResult);
      } else {
        const finalResult = {
          result: "failed",
          data: " "
        };
        res.set({ 'status': '401' });
        res.status(401).json(finalResult);
      }
    }
  });
});

// ----------สร้าง Queue ขั้นตอนการจอง
app.post('/queue', verifyToken, (req, res) => {
  async function findCustomer(id) {
    return await Customer.findById(id).exec();
  }
  async function findDoctor(id) {
    return await Doctor.findById(id).exec();
  }

  main();
  async function main() {
    try {
      data_customer = await findCustomer(req.body.customer);
      data_doctor = await findDoctor(req.body.doctor);
      if (data_customer != null) {
        if (data_doctor != null) {
          let queue = new Queue({
            customer: req.body.customer,
            employee: req.id,
            doctor: req.body.doctor,

            title: req.body.title || "เปลี่ยนยางจัดฟัน",
            description: req.body.description || "รายละเอียดบลาๆ",

            appointment_date: req.body.appointment_date,
            record_date: new Date(),

            status: "appointment"
          })
          queue.save({ new: true }, function (err, data) {
            if (err) {
              res.set({ 'status': '404' });
              res.status(404).json(err)
            }
            else {
              res.set({ 'status': '201' });
              res.status(201).json(data)
            }
          });
        }
        else {
          res.set({ 'status': '404' });
          res.status(404).json("Not Found Doctor")
        }
      }
      else {
        res.set({ 'status': '404' });
        res.status(404).json("Not Found Customer")
      }
    }
    catch (error) {
      console.log(error)
    }
  }
});

// ----------รับ Queue ขั้นตอนการรับคิว
app.put('/queue/booking', verifyToken, (req, res) => {
  async function findQueue(Queue_id) {
    return await Queue.findById(Queue_id).exec();
  }

  async function findRoom_usage(Doctor_id, midnight_date) {
    return await Room_usage.findOne({ doctor: Doctor_id, status: "active", usage_date: { $gte: midnight_date } }).populate('room').exec();
  }

  function checkPriority(dateNow, record_date) {
    if (record_date.getDate() == dateNow.getDate() && record_date.getMonth() == dateNow.getMonth() && record_date.getFullYear() == dateNow.getFullYear()) {
      return "B"
    }
    else return "A"
  }
  function checkAppointment_Date(dateNow, appointment_date) {
    if (appointment_date.getDate() == dateNow.getDate() && appointment_date.getMonth() == dateNow.getMonth() && appointment_date.getFullYear() == dateNow.getFullYear()) {
      return true
    }
    else return false
  }
  async function checkQueueBefore(priority, doctor, midnight_date) {
    try {
      data = await Queue.findOne({ doctor: doctor, priority: priority, appointment_date: { $gte: midnight_date } }).sort({ queue_order: -1 }).exec();
      if (data.queue_order >= 0) return data.queue_order
      else {
        data.queue_order = 0
        return data.queue_order
      }
    }
    catch (error) {
      console.log("catch")
      return 0
    }
  }
  main();

  async function main() {
    try {
      var dateNow = new Date();
      dateNow.setHours(dateNow.getHours() + 7);
      midnight_date = await dateNow
      await midnight_date.setHours(0)
      await midnight_date.setMinutes(0)
      await midnight_date.setSeconds(0)
      await midnight_date.setMilliseconds(0)
      findQueue = await findQueue(req.body.id);  //เก็บข้อมูลคิวที่กำลังรับหมายเลขคิว
      console.log(findQueue)
      if (findQueue == null) {
        res.set({ 'status': '404' });
        res.status(404).json("Not Found Queue")
      }
      findRoom_usage = await findRoom_usage(findQueue.doctor, midnight_date); // เก็บข้อมูลของห้องของหมอที่คนไข้ปัจจุบันนัดไว้
      var priority = await checkPriority(dateNow, findQueue.record_date);  // เก็บ priority Queue ปัจจุบัน
      checkAppointment_Date = await checkAppointment_Date(dateNow, findQueue.appointment_date);  // เช็คว่า Queue ที่นัดไว้ตรงกับวันที่ปัจจุบันไหม
      var QueueBefore = await checkQueueBefore(priority, findQueue.doctor, midnight_date);  //เช็ควันที่ของคิวนี้กับวันนที่ของคิวล่าสุดที่จองหมอคนเดียวกันและpriorityเท่ากัน
      if (checkAppointment_Date) {  // หากวันที่นัดตรงกับวันที่ปัจจุบันให้ทำ ...
        if (findQueue != null && findQueue.status == "appointment") {
          if (findRoom_usage != null && findRoom_usage.status == 'active') {
            Queue.findByIdAndUpdate(req.body.id, { room_usage: findRoom_usage._id, status: "booking_queue", queue_order: QueueBefore + 1, priority: priority, queue_date: dateNow }, { new: true }, (err, data) => {
              if (err) {
                res.set({ 'status': '400' });
                res.status(400).json(err)
              }
              else {
                res.set({ 'status': '201' });
                res.status(201).json(data)
              }
            });
          }
          else {
            res.set({ 'status': '400' });
            res.status(400).json("The doctor is not in the room or Do not find the doctor's room")
          }
        }
        else {
          res.set({ 'status': '400' });
          res.status(400).json("Do not queue repeat")
        }
      }
      else {
        res.set({ 'status': '400' });
        res.status(400).json("date_now not match appointment_date")
      }
    }
    catch (error) {
      if (error) {
        console.log(error)
      }
    }
  }
});

// ---------- เปลี่ยนสถานะ queue
app.put('/queue/status', verifyToken, (req, res) => {
  Queue.findByIdAndUpdate(req.body.queue, { status: "active" }, { new: true }).exec(function (err, data) {
    if (err) {
      res.set({ 'status': '400' });
      res.status(400).json(err)
    }
    else {
      res.set({ 'status': '201' });
      res.status(201).json(data)
    }
  })
})


// ---------- ค้าหา queue "ที่นัดหมายไว้" จากวันเดือนปีที่กำหนด
app.get('/queue/appointment', (req, res) => {
  var year = req.query.year
  var month = parseInt(req.query.month)
  month = month - 1
  var day = req.query.day
  var nextday = parseInt(day) + 1
  // let timezone = new Date().getTimezoneOffset();
  // timezone = timezone / 60 * (-1)
  let timezone = 7
  midnight_date = new Date(year, month, day, 0, 0, 0);
  nextdate = new Date(year, month, nextday, 0, 0, 0);
  Queue.find({ appointment_date: { $gte: midnight_date, $lt: nextdate } }).exec(function (err, data) {
    if (err) {
      res.set({ 'status': '404' });
      res.status(404).json("Not Found Queue")
    }
    else {
      res.set({ 'status': '200' });
      res.status(200).json(data)
    }
  });
})

// ---------- ค้าหา queue "ที่อยู่ในห้องทำฟัน" จากวันเดือนปีที่กำหนด
app.get('/queue/active', (req, res) => {
  var year = req.query.year
  var month = parseInt(req.query.month)
  month = month - 1
  var day = req.query.day
  var nextday = parseInt(day) + 1
  // let timezone = new Date().getTimezoneOffset();
  // timezone = timezone / 60 * (-1)
  let timezone = 7
  midnight_date = new Date(year, month, day, 0, 0, 0);
  nextdate = new Date(year, month, nextday, 0, 0, 0);
  Queue.find({ status: "active", queue_date: { $gte: midnight_date, $lt: nextdate } }).populate('room_usage').exec(function (err, data) {
    if (err) {
      res.set({ 'status': '404' });
      res.status(404).json("Not Found Queue")
    }
    else {
      res.set({ 'status': '200' });
      res.status(200).json(data)
    }
  });
})

// ---------- ค้าหา queue "ที่รับคิวไปแล้ว" จากวันเดือนปีที่กำหนด
app.get('/queue/booking', (req, res) => {
  var year = req.query.year
  var month = parseInt(req.query.month)
  month = month - 1
  var day = req.query.day
  var nextday = parseInt(day) + 1
  // let timezone = new Date().getTimezoneOffset();
  // timezone = timezone / 60 * (-1)
  let timezone = 7
  midnight_date = new Date(year, month, day, 0, 0, 0);
  nextdate = new Date(year, month, nextday, 0, 0, 0);
  Queue.find({ status: "booking_queue", queue_date: { $gte: midnight_date, $lt: nextdate } }).populate('room_usage').exec(function (err, data) {
    if (err) {
      res.set({ 'status': '404' });
      res.status(404).json("Not Found Queue")
    }
    else {
      res.set({ 'status': '200' });
      res.status(200).json(data)
    }
  });
})
// ---------- Monitor Queue
app.get('/monitor/queue', (req, res) => {
  var year = req.query.year
  var month = parseInt(req.query.month)
  month = month - 1
  var day = req.query.day
  var nextday = parseInt(day) + 1
  midnight_date = new Date(year, month, day, 0, 0, 0);
  nextdate = new Date(year, month, nextday, 0, 0, 0);
  Queue.find({ queue_date: { $gte: midnight_date, $lt: nextdate } }).populate('room_usage').exec(function (err, data) {
    if (err) {
      res.set({ 'status': '404' });
      res.status(404).json("Not Found Queue")
    }
    else {
      var room1_active = data.filter((infor) => {  //คิวที่อยู่ในห้องทำฟัน
        return infor.room_usage.room_name == 1 && infor.status == "active"
      })
      if (room1_active.length === 0) {
        var room1_active = [{ queue_order: '', priority: '', room_usage: { room_name: '' } }]
      }
      const room1_priority2 = data.filter((infor) => { //คิวที่กำลังนั่งรอพบแพทย์และจองมาล่วงหน้า
        return infor.room_usage.room_name == 1 && infor.priority == "A" && infor.status == "booking_queue"
      })
      const room1_priority1 = data.filter((infor) => { //คิวที่กำลังนั่งรอพบแพทย์และไม่ได้จองมาล่วงหน้า
        return infor.room_usage.room_name == 1 && infor.priority == "B" && infor.status == "booking_queue"
      })
      temp_room1_priority2 = { priority2: room1_priority2.length }
      temp_room1_priority1 = { priority1: room1_priority1.length }
      totalroom1 = room1_priority1.length + room1_priority2.length
      room1 = { room1: { active: room1_active[0], priority2: room1_priority2.length, priority1: room1_priority1.length, totalroom1 } }

      var room2_active = data.filter((infor) => {  //คิวที่อยู่ในห้องทำฟัน
        return infor.room_usage.room_name == 2 && infor.status == "active"
      })
      if (room2_active.length === 0) {
        var room2_active = [{ queue_order: '', priority: '', room_usage: { room_name: '' } }]
      }
      const room2_priority2 = data.filter((infor) => { //คิวที่กำลังนั่งรอพบแพทย์และจองมาล่วงหน้า
        return infor.room_usage.room_name == 2 && infor.priority == "A" && infor.status == "booking_queue"
      })
      const room2_priority1 = data.filter((infor) => { //คิวที่กำลังนั่งรอพบแพทย์และไม่ได้จองมาล่วงหน้า
        return infor.room_usage.room_name == 2 && infor.priority == "B" && infor.status == "booking_queue"
      })
      temp_room2_priority2 = { priority2: room2_priority2.length }
      temp_room2_priority1 = { priority1: room2_priority1.length }
      totalroom2 = room2_priority1.length + room2_priority2.length
      room2 = { room2: { active: room2_active[0], priority2: room2_priority2.length, priority1: room2_priority1.length, totalroom2 } }

      var room3_active = data.filter((infor) => {  //คิวที่อยู่ในห้องทำฟัน
        return infor.room_usage.room_name == 3 && infor.status == "active"
      })
      if (room3_active.length === 0) {
        var room3_active = [{ queue_order: '', priority: '', room_usage: { room_name: '' } }]
      }
      const room3_priority2 = data.filter((infor) => { //คิวที่กำลังนั่งรอพบแพทย์และจองมาล่วงหน้า
        return infor.room_usage.room_name == 3 && infor.priority == "A" && infor.status == "booking_queue"
      })
      const room3_priority1 = data.filter((infor) => { //คิวที่กำลังนั่งรอพบแพทย์และไม่ได้จองมาล่วงหน้า
        return infor.room_usage.room_name == 3 && infor.priority == "B" && infor.status == "booking_queue"
      })
      temp_room3_priority2 = { priority2: room3_priority2.length }
      temp_room3_priority1 = { priority1: room3_priority1.length }
      totalroom3 = room3_priority1.length + room3_priority2.length
      room3 = { room3: { active: room3_active[0], priority2: room3_priority2.length, priority1: room3_priority1.length, totalroom3 } }
      res.set({ 'status': '200' });
      res.status(200).json([room1, room2, room3])
    }
  });
})


// ---------- ค้าหา queue ทั้งหมด
app.get('/queue', (req, res) => {
  if (req.query.id) {
    Queue.find(req.query.id).exec(function (err, data) {
      if (err) {
        res.set({ 'status': '404' });
        res.status(404).json("Not Found Queue")
      }
      else {
        res.set({ 'status': '200' });
        res.status(200).json(data)
      }
    });
  }
  else if (req.query.customer_id && req.query.status) {
    Queue.find({ customer: req.query.customer_id, status: req.query.status }).exec(function (err, data) {
      if (err) {
        res.set({ 'status': '404' });
        res.status(404).json("Not Found Queue")
      }
      else {
        res.set({ 'status': '200' });
        res.status(200).json(data)
      }
    });
  }
  else if (req.query.personalid && req.query.status) {
    console.log("point 1")
    Customer.findOne({ personalid: req.query.personalid }).exec(function (err_customer, data_customer) {
      console.log("point 2")
      if (err_customer) {
        console.log("point 3")
        res.set({ 'status': '404' });
        res.status(404).json("Not Found Customer")
      }
      else {
        console.log("point 4")
        Queue.find({ customer: data_customer._id, status: req.query.status }).populate('customer').populate('doctor').exec(function (err, data) {
          if (err) {
            res.set({ 'status': '404' });
            res.status(404).json("Not Found Queue")
          }
          else {
            res.set({ 'status': '200' });
            res.status(200).json(data)
          }
        });
      }
    });
  }
  else if (req.query.customer_id) {
    Queue.find({ customer: req.query.customer_id }).exec(function (err, data) {
      if (err) {
        res.set({ 'status': '404' });
        res.status(404).json("Not Found Queue")
      }
      else {
        res.set({ 'status': '200' });
        res.status(200).json(data)
      }
    });
  }
  else if (req.query.employee_id) {
    Queue.find({ employee: req.query.employee_id }).exec(function (err, data) {
      if (err) {
        res.set({ 'status': '404' });
        res.status(404).json("Not Found Queue")
      }
      else {
        res.set({ 'status': '200' });
        res.status(200).json(data)
      }
    });
  }
  else if (req.query.doctor_id) {
    Queue.find({ doctor: req.query.doctor_id }).exec(function (err, data) {
      if (err) {
        res.set({ 'status': '404' });
        res.status(404).json("Not Found Queue")
      }
      else {
        res.set({ 'status': '200' });
        res.status(200).json(data)
      }
    });
  }
  else if (req.query.title) {
    Queue.find({ title: req.query.title }).exec(function (err, data) {
      if (err) {
        res.set({ 'status': '404' });
        res.status(404).json("Not Found Queue")
      }
      else {
        res.set({ 'status': '200' });
        res.status(200).json(data)
      }
    });
  }
  else if (req.query.appointment_date) {
    Queue.find({ appointment_date: req.query.appointment_date }).exec(function (err, data) {
      if (err) {
        res.set({ 'status': '404' });
        res.status(404).json("Not Found Queue")
      }
      else {
        res.set({ 'status': '200' });
        res.status(200).json(data)
      }
    });
  }
  else if (req.query.status) {
    Queue.find({ status: req.query.status }).exec(function (err, data) {
      if (err) {
        res.set({ 'status': '404' });
        res.status(404).json("Not Found Queue")
      }
      else {
        res.set({ 'status': '200' });
        res.status(200).json(data)
      }
    });
  }
  else if (req.query.priority) {
    Queue.find({ priority: req.query.priority }).exec(function (err, data) {
      if (err) {
        res.set({ 'status': '404' });
        res.status(404).json("Not Found Queue")
      }
      else {
        res.set({ 'status': '200' });
        res.status(200).json(data)
      }
    });
  }
  else if (req.query.queue_date) {
    Queue.find({ queue_date: req.query.queue_date }).exec(function (err, data) {
      if (err) {
        res.set({ 'status': '404' });
        res.status(404).json("Not Found Queue")
      }
      else {
        res.set({ 'status': '200' });
        res.status(200).json(data)
      }
    });
  }
  else if (req.query.queue_order) {
    Queue.find({ queue_order: req.query.queue_order }).exec(function (err, data) {
      if (err) {
        res.set({ 'status': '404' });
        res.status(404).json("Not Found Queue")
      }
      else {
        res.set({ 'status': '200' });
        res.status(200).json(data)
      }
    });
  }
  else {
    Queue.find().exec(function (err, data) {
      if (err) {
        res.set({ 'status': '404' });
        res.status(404).json("Not Found Queue")
      }
      else {
        res.set({ 'status': '200' });
        res.status(200).json(data)
      }
    });
  }
});

// ---------- feed
app.get('/feed', verifyToken, (req, res) => {
  res.json({ result: "success " + req.username + req.id })
});

// ---------- mycustomer
app.get('/myuser', verifyToken, (req, res) => {
  if (req.type == 'customer') {
    Customer.findOne({ _id: req.id }).exec(function (err, data) {
      if (err) return handleError(err);
      else res.status(200).json(data)
      console.log(data)
    });
  }
  else if (req.type == 'employee') {
    Employee.findOne({ _id: req.id }).exec(function (err, data) {
      if (err) return handleError(err);
      else res.status(200).json(data)
      console.log(data)
    });
  }
  else if (req.type == 'doctor') {
    Doctor.findOne({ _id: req.id }).exec(function (err, data) {
      if (err) return handleError(err);
      else res.status(200).json(data)
      console.log(data)
    });
  }
});

// ---------- post room
app.post('/room', verifyToken, (req, res) => {
  let room = new Room({
    _id: new mongoose.Types.ObjectId(),
    room_name: req.body.room_name
  })
  room.save({ new: true }, function (err, data) {
    if (err) {
      res.set({ 'status': '400' });
      res.status(400).json(err)
    }
    else {
      res.set({ 'status': '201' });
      res.status(201).json(data)
    }
  });
});

// ---------- get room
app.get('/room', verifyToken, (req, res) => {
  Room.find().exec(function (err, data) {
    if (err) {
      res.set({ 'status': '400' });
      res.status(400).json(err)
    }
    else {
      res.set({ 'status': '200' });
      res.status(200).json(data)
    }
  })  
});

// ---------- get doctor
app.get('/doctor', verifyToken, (req, res) => {
  Doctor.find().exec(function (err, data) {
    if (err) {
      res.set({ 'status': '404' });
      res.status(404).json(err)
    }
    else {
      res.set({ 'status': '200' });
      res.status(200).json(data)
    }
  });
});

// ---------- put room   .../room?room_name=2
app.put('/room', verifyToken, (req, res) => {
  Room.findOneAndUpdate({ room_name: req.query.room_name }, { room_name: req.body.room_name }, { new: true }, (err, data) => {
    if (data) {
      res.set({ 'status': '204' });
      res.status(204).json()
    }
    else {
      res.set({ 'status': '400' });
      res.status(400).json()
    }
  });
});

// ---------- delete room   .../room?room_name=2
app.delete('/room', verifyToken, (req, res) => {
  Room.findOneAndRemove({ 'room_name': req.query.room_name }, (err, data) => {
    if (data) {
      res.set({ 'status': '204' });
      res.status(204).json()
    }
    else {
      res.set({ 'status': '400' });
      res.status(400).json()
    }
  });
});

// ---------- post room_usage
app.post('/room_usage', verifyToken, (req, res) => {
  console.log("point 1")
  Room.findById(req.body.room, (err, data) => {
    console.log("point 2")
    if (err) {
      console.log("point 3")
      res.set({ 'status': '404' });
      res.status(404).json("Not Found Room")
    }
    else {
      console.log("point 4")
      let room_usage = new Room_usage({
        _id: new mongoose.Types.ObjectId(),

        room: req.body.room,
        room_name: data.room_name,
        employee: req.id,
        doctor: req.body.doctor,

        status: "pending",
        usage_date: req.body.usage_date,
        record_date: new Date()
      });
      room_usage.save({ new: true }, function (err, data) {
        console.log("point 5")
        if (err) {
          console.log("point 6")
          res.set({ 'status': '404' });
          res.status(400).json(err)
        }
        else {
          console.log("point 7")
          res.set({ 'status': '201' });
          res.status(201).json(data)
        }
      });
      console.log("point 8")
    }
  });
});

app.put('/room_usage', verifyToken, (req, res) => {
  Room_usage.findOneAndUpdate({ _id: req.body.id }, { status: req.body.status }, { new: true }, (err, data) => {
    if (data) {
      res.set({ 'status': '201' });
      res.status(201).json(data)
    }
    else {
      res.set({ 'status': '400' });
      res.status(400).json(err)
    }
  });
});

app.get('/customer', (req, res) => {
  if (req.query.personalid != null) {
    Customer.findOne({ personalid: req.query.personalid }).exec(function (err, data) {
      if (err) {
        res.set({ 'status': '404' });
        res.status(404).json("Not Found Customer")
      }
      else {
        res.set({ 'status': '200' });
        res.status(200).json(data)
      }
    });
  }
  else if (req.query.phone != null) {
    Customer.findOne({ phone: req.query.phone }).exec(function (err, data) {
      if (err) {
        res.set({ 'status': '404' });
        res.status(404).json("Not Found Customer")
      }
      else {
        res.set({ 'status': '200' });
        res.status(200).json(data)
      }
    });
  }
});


app.put('/test', verifyToken, (req, res) => {
  makedata = {
    a: "aaaa",
    b: "bbbb"
  }
  res.set({ 'status': '200' });
  res.status(200).json(makedata)
});

// Queue.find({ '_id': '5ba91f3e5dcc1c001524c151' }).populate('room_usage').exec(function (err, data) {
//   if (err) return handleError(err);
//   console.log(data);
// });

// Queue.remove({}, (err) => {
//   if(err) {
//       console.log(err);
//   }
//   console.log('remove successfully.');
// })

// var data_temp = {
//   set doctor_id(id) {
//     this.id = id
//   },
//   get doctor_id() {
//     if (this.id == 0) {
//       return undefined;
//     }
//     return this.id;
//   },
//   set current(name) {
//     this.name = name
//   },
//   get current() {
//     if (this.name == 0) {
//       return undefined;
//     }
//     return this.name;
//   },
// }
console.log(new Date())

module.exports = app;