require('dotenv').config();
const mongoose = require('mongoose');
const TranscriptionModel = require('./models/transcriptionModel');
const Broker = require('rascal').BrokerAsPromised;
const config = require('../rascal-config.json');
const { execSync } = require('child_process');

async function connectDataBase() {
    await mongoose.connect(process.env.DATABASE_URL);
}

async function updateTranscriptionStatus(transcriptionId) {
    await TranscriptionModel.findOneAndUpdate({ t_id: transcriptionId }, { status: 'Concluido' });
}

connectDataBase().catch((err) => { return console.log(`[MongoDB] Error connecting to database : ${err.message}`) });

async function consume() {

    const broker = await Broker.create(config);
    broker.on('error', (err, { vhost, connectionUrl }) => {
        console.error(`\n\n[Rascal] Broker error : ${err.message} \nvhost : ${vhost} \nurL : ${connectionUrl}`);
    });

    try {
        const subscription = await broker.subscribe('s1', { "options": { "noAck": true } });
        console.log('\nWaiting new transcription...\n');

        subscription
            .on('message', (message, content) => {

                const transcriptionId = content.toString().replace(/"/g, "");
                updateTranscriptionStatus(transcriptionId)
                        .catch(err => { `[MongoDB] Error updating transcription status : ${err.message}` });

                console.log('-----------------------------------------------------------------');
                console.log(`New transcription in queue : ${transcriptionId}`);

                const whisperPath = `${__dirname}/whisper/transcription.py`;

                try {
                    console.log('\nTranscribing audio to text...');

                    const startTime = new Date();
                    execSync(`python3 ${whisperPath} ${transcriptionId}`);
                    const endTime = new Date();

                    const elapsedTime = endTime - startTime;
                    const hours = Math.floor(elapsedTime / (60 * 60 * 1000));
                    const minutes = Math.floor((elapsedTime % (60 * 60 * 1000)) / (60 * 1000));
                    const seconds = Math.floor((elapsedTime % (60 * 1000)) / 1000);

                    console.log(`Transcription completed in ${hours}h ${minutes}m ${seconds}s!`);
                    console.log('-----------------------------------------------------------------');

                } catch (err) {
                    console.error(`\n\n[Whisper] Error in transcription : ${err.message}`);
                }

                console.log('\nWaiting new transcription...\n');
            })
            .on('error', (err) => {
                console.error(`\n\n[Rascal] Subscriber error : ${err.message}`);
            })
            .on('invalid_content', (err, message) => {
                console.error(`\n\n[Rascal] Error Consumer Invalid Content : ${err.message}, \nMessage : ${message}`);
            });

    } catch (err) {
        throw new Error(`\n\n[Rascal] Config error : ${err.message}`);
    }
}

consume();