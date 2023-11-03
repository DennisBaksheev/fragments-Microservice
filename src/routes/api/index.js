// src/routes/api/index.js
const express = require('express');
const { listFragments, getFragmentById } = require('./get');

const router = express.Router();

// Define the existing route
router.get('/fragments', listFragments);

router.get('/fragments/:id', getFragmentById);

module.exports = router;
