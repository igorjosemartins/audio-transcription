const express = require('express');
const fs = require('fs');
const TranscriptionModel = require('../models/transcriptionModel');

const router = express.Router();

router.get('/status/:id', async (req, res) => {

    if (!process.env.AUTH_KEYS.includes(req.query.k) || !req.query.k) {
        console.log('[GET STATUS] (401) : Invalid auth key');
        return res.status(401).json({ error: 'Invalid auth key' });
    }

    const transcriptionId = req.params.id;

    const searchedTranscription = await TranscriptionModel.findOne({ t_id: transcriptionId });

    if (!searchedTranscription) {
        console.log('[GET STATUS] (404) : Transcript not found');
        return res.status(404).json({ error: 'Transcript not found' });
    }

    const transcriptionPath = `C:/Users/Igor/Desktop/API_transcricao/src/whisper/transcriptions/${transcriptionId}.vtt`;

    const existsFile = fs.existsSync(transcriptionPath);

    if (existsFile) {
        console.log('[GET STATUS] (200) : OK');
        return res.status(200).download(transcriptionPath);
    
    } else {
        console.log('[GET STATUS] (202) : Transcription in progress...');
        return res.status(202).json({ status: "Transcription in progress..." });
    }
});

module.exports = router;