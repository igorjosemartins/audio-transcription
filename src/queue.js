function connect() {
    return require('amqplib').connect("amqp://localhost", { timeout: 3600000 })
        .then(conn => conn.createChannel());
}

function createQueue(channel, queue) {
    return new Promise((resolve, reject) => {
        try {
            channel.assertQueue(queue, { durable: true });
            resolve(channel);
        }
        catch (err) { reject(err) }
    });
}

function sendToQueue(queue, id) {
    connect()
        .then(channel => createQueue(channel, queue))
        .then(channel => channel.sendToQueue(queue, Buffer.from(JSON.stringify(id))))
        .catch(err => console.log(err))
}

function consume(queue, callback) {
    connect()
        .then(channel => createQueue(channel, queue))
        .then(channel => channel.consume(queue, callback, { noAck: true }))
        .catch(err => console.log(err));
}

module.exports = {
    sendToQueue,
    consume
}