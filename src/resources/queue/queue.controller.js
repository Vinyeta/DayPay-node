const MQservice = require("../../services/MQservice");

const sendMessage = async (req, res, next) => {
  let payload = req.body;
  await MQservice.publishToQueue("DayPay", JSON.stringify(payload));
  res.statusCode = 200;
  res.data = { "message-sent": true };
  next();
  return res.status(200).json("message sent to queue");
};

module.exports = {
  sendMessage,
};
