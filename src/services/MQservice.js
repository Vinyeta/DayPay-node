const amqp = require("amqplib/callback_api");
const transactionsController = require("../resources/transactions/transactions.controller");

let ch = null;
const openRabitChannel = () => {
  amqp.connect(process.env.MQ_CONN_URL, function (err, conn) {
    conn.createChannel(function (err, channel) {
      ch = channel;
      channel.assertQueue("Daypay", {
        durable: true,
      });
      ch.consume(
        "DayPay",
        function (msg) {
          console.log(".....");
          transactionsController.handleTransaction(msg.content.toString());
          ch.ack(msg);
        },
        { noAck: false }
      );
    });
  });
};

const publishToQueue = async (queueName, data) => {
  ch.sendToQueue(queueName, new Buffer.from(data), { persistent: true });
};

module.exports = {
  openRabitChannel,
  publishToQueue,
};
