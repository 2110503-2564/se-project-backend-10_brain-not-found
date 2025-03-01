
const express = require('express');
const {getMassageShops, getMassageShop, createMassageShop, updateMassageShop, deleteMassageShop} = require('../controllers/MassageShops');
//Include other resource routers
const appointmentRouter=require('./reservations');
const router = express.Router();
const {protect , authorize} = require('../middleware/auth')

//Re-route into other resource routers
router.use('/:massageshopId/reservations/',appointmentRouter);

router.route('/').get(getMassageShops).post(protect,authorize('admin'),createMassageShop);
router.route('/:id').get(getMassageShop).put(protect,authorize('admin'),updateMassageShop).delete(protect,authorize('admin'),deleteMassageShop);

module.exports = router;