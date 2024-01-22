require('dotenv').config();
const { execSync } = require('child_process');
const Redis = require('ioredis');

const redis = new Redis();

redis.subscribe('ch1', (err, count) => {
    
    if (err) {
        throw new Error(`[Redis] Failed to subscribe : ${err.message}`);
    }

    console.log(`Waiting new transcription...`);

    redis.on('message', (channel, message) => {
        
        const transcriptionId = message;

        console.log('-----------------------------------------------------------------');
        console.log(`New transcription in queue : ${transcriptionId}`);

        const whisperPath = `${__dirname}/whisper/transcription.py`;

        try {
            console.log('Transcribing audio to text...');

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
            console.error(`[Whisper] Error in transcription : ${err.message}`);
        }

        console.log('Waiting new transcription...');
    });
});