const express = require('express')
const router = express.Router();
const transcriptionModel = require('../models/transcriptionModel');

router.delete('/delete-all-transcriptions', async (req, res) => {

    if (!process.env.AUTH_KEYS.includes(req.query.k) || !req.query.k) {
        console.log('[DELETE] (401) : Invalid auth key');
        return res.status(401).json({ error: 'Invalid auth key' });
    }

    const deleteResponse = await transcriptionModel.deleteMany({ t_id: /.*/ });

    console.log('[DELETE] (200) : OK');
    res.status(200).json({ deletedTranscriptions: deleteResponse.deletedCount });
});

module.exports = router;