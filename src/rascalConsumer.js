require('dotenv').config()
const Broker = require('rascal').BrokerAsPromised;
const config = require('../rascal-config.json');
const { execSync } = require('child_process');
const mongoose = require('mongoose');
const TranscriptionModel = require('./models/transcriptionModel');

async function connectDataBase() {
    await mongoose.connect(process.env.DATABASE_URL);
}

connectDataBase().catch((error) => { return console.log(`Erro ao conectar ao MongoDB : ${error}`) });

async function consume() {

    console.log('\nwaiting new transcription...');

    const broker = await Broker.create(config);
    broker.on('error', console.error);

    const subscription = await broker.subscribe('s1');

    subscription.on('message', async (message, content, ackOrNack) => {

        console.log('\nnew transcription in queue!\n');

        const transcriptionId = content.toString().replace(/"/g, "");

        const whisperPath = `${__dirname}/whisper/transcription.py`;

        try {
            console.log('transcribing audio to text...');
            execSync(`python3 ${whisperPath} ${transcriptionId}`);
            console.log('transcription completed!');
            ackOrNack();

        } catch (error) {
            console.error(`\n[WHISPER] Transcription error : ${error}`);
        }

        try {
            await TranscriptionModel.findOneAndUpdate(
                {
                    t_id: transcriptionId
                },
                {
                    status: 'Concluido'
                });

        } catch (error) {
            console.error(`\n[MongoDB] Error updating transcript status : ${error}`);
        }
    });

    subscription.on('error', console.error);
    subscription.on('invalid_content', (e, message, ackOrNack) => {
        console.error(`\n[AMQP] Error Rascal Consumer Invalid Content => ${e}`);
        ackOrNack();
    });
}

consume();