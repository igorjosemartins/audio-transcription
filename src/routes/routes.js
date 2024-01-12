const express = require('express');
const fs = require('fs');
const multer = require('multer');
const TranscriptionModel = require('../models/transcriptionModel');
const upload = multer({ dest: 'src/multer_uploads' });
const router = express.Router();

function createWavFile(transcriptionId, multerPath, newPath) {
    
    const audioFile = fs.readFileSync(multerPath);
    const audioDirectory = `${newPath}/${transcriptionId}.wav`;

    fs.writeFileSync(audioDirectory, audioFile);
}

// API:
//      -> criar ID único para cada arquivo ✅
//      -> registrar no BD o ID + status "processando" ✅
//      -> mandar o ID + áudio pra fila ✅
//      -> retornar o arquivo de texto + status ❌

router.post('/test', upload.single('audio'), (req, res) => {
    const transcriptionId = '56418d4a-b25c-46c0-98b8-b5f08f4e395c';
    const multerPath = req.file.path;
    const audioPath = 'C:/Users/Igor/Desktop/API_transcricao/src/audios';

    createWavFile(transcriptionId, multerPath, audioPath);

    res.sendStatus(200);
})

router.get('/transcription/status/:id', async (req, res) => {

    const transcriptionId = req.params.id;

    const searchedTranscription = await TranscriptionModel.findById(transcriptionId);

    if (!searchedTranscription) {
        return res.status(404).json({ message: "Transcrição não encontrada" });
    }

    if (searchedTranscription.status === 'Concluido') {
        // retorna o arquivo de texto

    }
})

router.post('/transcription/create', upload.single('audio'), async (req, res) => {

    let status = "Processando";

    const newTranscription = new TranscriptionModel({ status });
    await newTranscription.save();

    const transcriptionId = newTranscription._id;
    const multerPath = req.file.path;
    const audioPath = 'C:/Users/Igor/Desktop/API_transcricao/src/audios';

    createWavFile(transcriptionId, multerPath, audioPath);

    queue.sendToQueue("fila1", transcriptionId);

    res.status(201).json({ message: "Transcrição em andamento", id: transcriptionId });
});

module.exports = router;