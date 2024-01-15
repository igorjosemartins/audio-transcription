require('dotenv').config();
const queue = require('./queue');
const { execSync } = require('child_process');
const mongoose = require('mongoose');
const TranscriptionModel = require('./models/transcriptionModel');

console.log('worker started');

async function connectDataBase() {
    await mongoose.connect(process.env.DATABASE_URL);
}

connectDataBase().catch((error) => { return console.log(`Erro ao conectar ao MongoDB: ${error}`) });

queue.consume("fila1", async (id) => {

    console.log('\nnew transcription in queue');

    const transcriptionId = id.content.toString().replace(/"/g, "");

    const whisperPath = `${__dirname}/whisper/transcription.py`;

    try {
        console.log('\ntranscribing audio to text...');
        execSync(`python3 ${whisperPath} ${transcriptionId}`);
        console.log('transcription completed!');

    } catch (error) {
        console.error(`Transcription error in 'transcription.py' : ${error}`);
    }

    try {
        await TranscriptionModel.findByIdAndUpdate(
            transcriptionId,
            { status: 'Concluido' }
        );

    } catch (error) {
        console.error(`Error updating transcript status in MongoDB : ${error}`)
    }
})