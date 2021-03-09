const amqp = require('amqplib/callback_api');

let ch = null;
amqp.connect(process.env.MQ_CONN_URL, function (err, conn) {
   conn.createChannel(function (err, channel) {
      ch = channel;
   });
});

const publishToQueue = async (queueName, data) => {
    ch.sendToQueue(queueName, new Buffer.from(data));
 };

 process.on('exit', (code) => {
    ch.close();
    console.log(`Closing rabbitmq channel`);
 });


 module.exports = {
     publishToQueue
 }