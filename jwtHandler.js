var jwt = require('jsonwebtoken');

const secretKey = "key1234"

function getToken(json) {
  return token = jwt.sign(json, secretKey, {
    expiresIn: (86400)*(365) // 86400 sec = 24 hours
  });
}

function verifyToken(req, res, next) {
  // console.log("Verify Token: " + JSON.stringify(req.headers));
  var token = req.headers['x-access-token'];
  if (!token)
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  jwt.verify(token, secretKey, function (err, decoded) {
    if (err)
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    else {
      // เริ่มส่วนที่จะดัดแปลง
      // คิดว่าจะดัดแปลงให้ var data = User.find(id: decoded.id)
      // แล้วส่ง res data ไปให้ api เพื่อให้ได้ข้อมูลที่ครบและ เป็น object
      req.username = decoded.username
      req.id = decoded.id
      req.type = decoded.type
      // จบส่วนที่จะดัดแปลง
      next();
    }
  });
}

module.exports = { getToken, verifyToken };
