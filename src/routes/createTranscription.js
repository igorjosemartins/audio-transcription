const crypto = require('crypto');
const express = require('express');
const multer = require('multer');
const rascal = require('../rascalProducer');
const TranscriptionModel = require('../models/transcriptionModel');

const router = express.Router();

const storage = multer.diskStorage({
    destination: 'src/audios',
    filename: function (req, res, cb) {
        cb(null, `${crypto.randomUUID()}.wav`)
    }
});
const upload = multer({ storage: storage });

router.post('/create', upload.single('audio'), async (req, res) => {

    const transcriptionId = req.file.filename.split('.')[0];

    const newTranscription = new TranscriptionModel({ t_id: transcriptionId, status: "Processando" });
    await newTranscription.save();

    rascal.sendToQueue(transcriptionId);

    res.status(200).json({ id: transcriptionId, status: "Transcrição em andamento" });
});

module.exports = router;