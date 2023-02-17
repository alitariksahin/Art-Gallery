
const uuid = require("uuid");

class Client {
    #cids = {}
    constructor(connection) {
        this.connection = connection;
    }

    async connect(){

        const channel = await this.connection.createChannel();
        return channel;
    }

    async send(payload, channel){
        const q = await channel.assertQueue(payload, {exclusive: true});
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
            channel.consume(payload, (msg) => {
                if (msg.properties.correlationId === this.#cids[payload]) {
                    resolve(JSON.parse(msg.content.toString()));                                
                }
            }, {noAck: true});
            setTimeout(()=> {
                resolve("timeout");
            },3000)
        });
        
    }

    disconnect(connection){
        this.#cids = {}
        this.#queues = {}
        connection.close();
    }
}

module.exports = Client;
