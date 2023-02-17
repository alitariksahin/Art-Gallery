const amqplib = require("amqplib");

module.exports = async (artistService) => {
  try {
    const connection = await amqplib.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue("artist_queue", {durable: false});
    channel.consume("artist_queue", async (msg) => {
        const payload = JSON.parse(msg.content.toString());
        const response = await artistService.subscribeEvents(payload);
        channel.sendToQueue(msg.properties.replyTo, Buffer.from(response), {
            correlationId: msg.properties.correlationId
        });
        channel.ack(msg);
    }, {noAck: false});
  }catch(err) {
    console.log(err);
};

}
