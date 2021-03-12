const amqp = require('amqplib/callback_api');

let ch = null;
const openRabitChannel = () => {
      amqp.connect(process.env.MQ_CONN_URL, function (err, conn) {
      conn.createChannel(function (err, channel) {
         ch = channel;
         channel.assertQueue("Daypay", {
            durable: true
          });
          ch.consume("DayPay", function(msg){
            console.log('.....');
            setTimeout(function () {
               console.log("Message:", msg.content);
            },10000);
            ch.ack(msg);
},    { noAck: false });
      });
   });
}

const publishToQueue = async (queueName, data) => {
   ch.sendToQueue(queueName, new Buffer.from(data), {persistent: true});
};

const queueConsumer = (msg) => {
            console.log('.....');
            setTimeout(function () {
               console.log("Message:", msg);
               ch.ack(msg);
            },1000);
}
      

// process.on('exit', (code) => {
//    ch.close();
//    console.log(`Closing rabbitmq channel`);
// });



module.exports = {
   openRabitChannel,
   publishToQueue,
   queueConsumer
}