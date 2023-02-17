
const uuid = require("uuid");

class Client {
    constructor(connection) {
        this.connection = connection;
    }

    async sendAndConsume(payload){
        const channel = await this.connection.createChannel();
        const q = await channel.assertQueue(payload, {exclusive: true});
        channel.prefetch(1);
        const cid = uuid.v4();
        channel.sendToQueue("artist_queue", Buffer.from(JSON.stringify(payload)), {
            replyTo: q.queue,
            correlationId: cid
        });
        return new Promise(resolve => {
            channel.consume(payload, (msg) => {
                if (msg.properties.correlationId === cid) {
                    resolve(JSON.parse(msg.content.toString()));                                
                }
            }, {noAck: true});
            setTimeout(()=> {
                resolve("timeout");
            },3000)
        });
        
    }
}

module.exports = Client;
