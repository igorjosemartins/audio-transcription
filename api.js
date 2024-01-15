require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const createTranscription = require('./src/routes/createTranscription');
const getTranscriptionStatus = require('./src/routes/getTranscriptionStatus');

const app = express();
const port = process.env.PORT || 3000;

async function connectDataBase() {
    await mongoose.connect(process.env.DATABASE_URL);
}

app.listen(port, () => {
    connectDataBase().catch((error) => {
        return console.log(`Erro ao conectar ao MongoDB: ${error}`);
    })

    app.use(cors({ origin: "*" }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    app.use('/api-transcription', createTranscription);
    app.use('/api-transcription', getTranscriptionStatus);

    console.log(`Servidor ouvindo na porta: ${port}`);
})