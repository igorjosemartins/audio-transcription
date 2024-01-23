const mongoose = require('mongoose');

const transcriptionSchema = new mongoose.Schema({
    t_id: String,
    status: String
});

module.exports = mongoose.model('TranscriptionModel', transcriptionSchema);