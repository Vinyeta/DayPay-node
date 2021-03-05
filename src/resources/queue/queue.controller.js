const MQservice = require('../../services/MQservice')


const sendMessage = async(req, res, next)=>{
    let { queueName, payload } = req.body;
    await MQservice.publishToQueue(queueName, payload);
    res.statusCode = 200;
    res.data = {"message-sent":true};
    next();
  }

  module.exports = {
      sendMessage
  }