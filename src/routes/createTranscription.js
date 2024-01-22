require('dotenv').config();
const crypto = require('crypto');
const express = require('express');
const multer = require('multer');
const Redis = require('ioredis');
const TranscriptionModel = require('../models/transcriptionModel');

const redis = new Redis();
const router = express.Router();

const storage = multer.diskStorage({
    destination: 'src/audios',
    filename: function (req, res, cb) {
        cb(null, `${crypto.randomUUID()}.wav`)
    }
});

const wavFilter = (req, file, cb) => {
    cb(null, false);

    if (file.mimetype === 'audio/wave') {
        cb(null, true);
    }
}
const upload = multer({ storage: storage, fileFilter: wavFilter });

router.post('/create', upload.single('audio'), async (req, res) => {

    if (!process.env.AUTH_KEYS.includes(req.query.k) || !req.query.k) {
        console.log('[POST] (401) : Invalid auth key');
        return res.status(401).json({ error: 'Invalid auth key' });
    }

    if (!req.file) {
        console.log('[POST] (400) : The upload file must exist and be in WAV format');
        return res.status(400).json({ error: 'The upload file must exist and be in WAV format' });
    }

    const transcriptionId = req.file.filename.split('.')[0];

    const newTranscription = new TranscriptionModel({ t_id: transcriptionId });
    await newTranscription.save();

    redis.publish('ch1', transcriptionId);

    console.log('[POST] (200) : Transcription accepted and in progress...');
    res.status(200).json({ id: transcriptionId, status: "Transcription accepted and in progress..." });
});

module.exports = router;