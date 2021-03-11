const amqp = require('amqplib/callback_api');

let ch = null;
const openRabitChannel = () => {
      amqp.connect(process.env.MQ_CONN_URL, function (err, conn) {
      conn.createChannel(function (err, channel) {
         ch = channel;
         console.log("Channel: ",ch);
         ch.consume("Daypay", queueConsumer(msg),    { noAck: false });
      });
   });
}

const publishToQueue = async (queueName, data) => {
   ch.sendToQueue(queueName, new Buffer.from(data), {persistent: true});
};

const queueConsumer = (msg) => {
            console.log('.....');
            setTimeout(function () {
               console.log("Message:", msg.content.toString());
               ch.ack(msg);
            }, 30000);
}
      

process.on('exit', (code) => {
   ch.close();
   console.log(`Closing rabbitmq channel`);
});



module.exports = {
   openRabitChannel,
   publishToQueue,
   queueConsumer
}