const express = require('express');
const router = express.Router();
const {
    getSamples,
    getSampleById,
    createSample,
    updateSample,
    deleteSample
} = require('../controllers/SampleController');

// GET all samples
router.get('/', getSamples);

// GET sample by ID
router.get('/:id', getSampleById);

// POST a new sample
router.post('/', createSample);

// PUT update a sample by ID
router.put('/:id', updateSample);

// DELETE a sample by ID
router.delete('/:id', deleteSample);

module.exports = router;
