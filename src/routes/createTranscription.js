const express = require('express');
const fs = require('fs');
const multer = require('multer');
const queue = require('../queue');
const TranscriptionModel = require('../models/transcriptionModel');

const upload = multer({ dest: 'src/multer_uploads' });
const router = express.Router();

function createWavFile(transcriptionId, multerPath, newPath) {
    
    const audioFile = fs.readFileSync(multerPath);
    const audioDirectory = `${newPath}/${transcriptionId}.wav`;

    fs.writeFileSync(audioDirectory, audioFile);
}

router.post('/create', upload.single('audio'), async (req, res) => {

    let status = "Processando";

    const newTranscription = new TranscriptionModel({ status });
    await newTranscription.save();

    const transcriptionId = newTranscription._id;
    const multerPath = req.file.path;
    const audioPath = 'C:/Users/Igor/Desktop/API_transcricao/src/audios';

    createWavFile(transcriptionId, multerPath, audioPath);

    queue.sendToQueue("fila1", transcriptionId);

    res.status(200).json({ status: "Transcrição em andamento", id: transcriptionId });
});

module.exports = router;