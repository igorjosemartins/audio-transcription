const mongoose = require('mongoose');

const transcriptionSchema = new mongoose.Schema({
    status: String
});

module.exports = mongoose.model('TranscriptionModel', transcriptionSchema);