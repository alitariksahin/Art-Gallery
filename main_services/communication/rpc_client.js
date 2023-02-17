const amqplib = require("amqplib");
const uuid = require("uuid");


 const sendAndConsume = async (payload) => {  
        const connection = await amqplib.connect(process.env.RABBITMQ_URL)
        const channel = await connection.createChannel();
        const q = await channel.assertQueue("", {exclusive: true});
        channel.prefetch(1);
        const cid = uuid.v4();
        channel.sendToQueue("artist_queue", Buffer.from(JSON.stringify(payload)), {
            replyTo: q.queue,
            correlationId: cid
        });
        return new Promise(resolve => {
            channel.consume(q.queue, (msg) => {              
                if (msg.properties.correlationId === cid) {
                    connection.close();
                    resolve(JSON.parse(msg.content.toString()));                                
                }
            }, {noAck: true});
            setTimeout(()=> {
                resolve("timeout");
            },3000)
        });
        
    }


module.exports = sendAndConsume;
