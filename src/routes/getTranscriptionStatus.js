const express = require('express');
const fs = require('fs');
const TranscriptionModel = require('../models/transcriptionModel');

const router = express.Router();

router.get('/status/:id', async (req, res) => {

    const transcriptionId = req.params.id;

    const searchedTranscription = await TranscriptionModel.findOne({ t_id: transcriptionId });

    if (!searchedTranscription) {
        return res.status(404).json({ error: "Transcript not found!" });
    }

    if (searchedTranscription.status === 'Concluido') {
        
        const transcriptionPath = `C:/Users/Igor/Desktop/API_transcricao/src/whisper/transcriptions/${transcriptionId}.vtt`;
        
        const existsFile = fs.existsSync(transcriptionPath);

        if (!existsFile) {
            return res.status(404).json({ error: "File not found!" });
        }

        res.status(200).download(transcriptionPath);
    
    } else {
        res.status(202).json({ status: "Transcrição em andamento" });
    }
})

module.exports = router;