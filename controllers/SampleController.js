const Sample = require('../models/SampleModej');

exports.getSamples = async (req, res) => {
    try {
        const samples = await Sample.find();
        res.json(samples);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getSampleById = async (req, res) => {
    try {
        const sample = await Sample.findById(req.params.id);
        if (!sample) return res.status(404).json({ message: 'Sample not found' });
        res.json(sample);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createSample = async (req, res) => {
    const { name, value } = req.body;

    try {
        const newSample = new Sample({ name, value });
        const savedSample = await newSample.save();
        res.status(201).json(savedSample);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateSample = async (req, res) => {
    try {
        const sample = await Sample.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!sample) return res.status(404).json({ message: 'Sample not found' });
        res.json(sample);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteSample = async (req, res) => {
    try {
        const sample = await Sample.findByIdAndDelete(req.params.id);
        if (!sample) return res.status(404).json({ message: 'Sample not found' });
        res.json({ message: 'Sample deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
