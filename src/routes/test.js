const express = require('express');
const rascal = require('../rascalProducer');

const router = express.Router();

router.get('/test', (req, res) => {
    rascal.produce('test message').catch((e) => { console.error(`[AMQP] Error Rascal Producer : ${e}`) });
});

module.exports = router;