const Broker = require('rascal').BrokerAsPromised;
const config = require('../rascal-config.json');

async function sendToQueue(message) {

  const broker = await Broker.create(config);
  broker.on('error', console.error);

  try {
    const publication = await broker.publish('p1', message);
    
    publication
      .on('error', (err, messageId) => {
        console.error(`[Rascal] Publisher error : ${err.message} \nMessageId : ${messageId}`);
      });

  } catch (err) {
    throw new Error(`[Rascal] Config error : ${err.message}`);
  }
}

module.exports = {
  sendToQueue
}