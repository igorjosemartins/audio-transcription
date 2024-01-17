const express = require('express')
const router = express.Router();
const transcriptionModel = require('../models/transcriptionModel');

router.delete('/delete-all-transcriptions', async (req, res) => {
    
    const deleteResponse = await transcriptionModel.deleteMany({ status: /Processando|Concluido/});

    res.json({ deletedTranscriptions: deleteResponse.deletedCount });
});

module.exports = router;