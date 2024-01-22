const mongoose = require('mongoose');

const transcriptionSchema = new mongoose.Schema({
    t_id: String
});

module.exports = mongoose.model('TranscriptionModel', transcriptionSchema);