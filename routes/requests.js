const express = require('express');
const { createRequest , getRequests } = require('../controllers/request');
const router = express.Router();
const {protect,authorize} = require('../middleware/auth');
const { create } = require('../models/User');
const { get } = require('mongoose');


router.route('/')
    .get(protect,authorize('admin','shopOwner'),getRequests)
    .post(protect,authorize('shopOwner'),createRequest);

module.exports = router;