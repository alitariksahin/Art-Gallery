const amqplib = require("amqplib");
const uuid = require("uuid");

class Client {
    #cids = {}
    #queues = {}
    constructor() {
    }

    async connect(){
        const connection = await amqplib.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        return {channel, connection};
    }

    async send(payload, channel){
        const q = await channel.assertQueue("", {exclusive: true});
        this.#queues[payload] = q.queue;
        channel.prefetch(1);
        const cid = uuid.v4();
        this.#cids[payload] = cid
        channel.sendToQueue("artist_queue", Buffer.from(JSON.stringify(payload)), {
            replyTo: q.queue,
            correlationId: cid
        });
    }

    async consume(payload, channel){
        return new Promise(resolve => {
            channel.consume(this.#queues[payload], (msg) => {
                if (msg.properties.correlationId === this.#cids[payload]) {
                    resolve(JSON.parse(msg.content.toString()));                                
                }
            }, {noAck: true});
            setTimeout(()=> {
                resolve("timeout");
            },500)
        });
        
    }

    disconnect(connection){
        this.#cids = {}
        this.#queues = {}
        connection.close();
    }
}

module.exports = Client;
