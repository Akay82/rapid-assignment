const mongoose = require('mongoose');

const SampleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Sample', SampleSchema);
