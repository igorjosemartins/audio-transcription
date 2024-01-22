require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const createTranscription = require('./src/routes/createTranscription');
const getTranscriptionStatus = require('./src/routes/getTranscriptionStatus');
const deleteAllTranscriptions = require('./src/routes/deleteAllTranscriptions');

const app = express();
const port = process.env.PORT || 3333;

async function connectDataBase() {
    await mongoose.connect(process.env.DATABASE_URL);
}

app.listen(port, () => {
    connectDataBase().catch((err) => {
        return console.log(`[MongoDB] Error connecting to database : ${err.message}`);
    });

    app.use(cors({ origin: "*" }));
    app.use(express.urlencoded({ extended: true }));
    
    app.use('/api-transcription', [createTranscription, getTranscriptionStatus, deleteAllTranscriptions]);

    console.log(`Server listening on : ${port}`);
});