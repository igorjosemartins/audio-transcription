// WORKER :
//      -> verificar o status do processamento no BD ❌
//      -> processar a transcrição do áudio ❌
//      -> registrar "concluido" ao finalizar a transcrição no BD ❌

console.log('worker started');

const queue = require('./queue');
const { execSync } = require('child_process');
const mongoose = require('mongoose');
const TranscriptionModel = require('./models/transcriptionModel');

async function connectDataBase() {
    await mongoose.connect(process.env.DATABASE_URL);
}

connectDataBase().catch((error) => { console.log(`Erro ao conectar ao MongoDB: ${error}`) });

queue.consume("fila1", async (id) => {
    
    const transcriptionId = id.content.toString();

    const whisperPath = `${__dirname}/whisper/transcription.py`;

    try {
        console.log('transcribing audio to text...');
        execSync(`python3 ${whisperPath} ${transcriptionId}`);
        console.log('transcription completed!');

        await TranscriptionModel.findByIdAndUpdate(
            transcriptionId, 
            { status: 'Concluido' },
            { new: true }
        );

    } catch(error) {
        console.error(`Erro ao executar o script 'transcription.py' : ${error}`);
    }
})