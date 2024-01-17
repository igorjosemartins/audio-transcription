const Broker = require('rascal').BrokerAsPromised;
const config = require('../rascal-config.json');

async function sendToQueue(message) {
  
  const broker = await Broker.create(config);
  broker.on('error', console.error);

  const publication = await broker.publish('p1', message);
  publication.on('error', console.error);
}

module.exports = {
  sendToQueue
}