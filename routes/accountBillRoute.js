const accountBillController= require('../controllers/accountBillController')
const checkAdminRole= require('../middleware/checkAdminRole');
const checkReceptionistRole= require('../middleware/checkReceptionistRole');
const express= require('express');
const router= express.Router();
router.get('/api/v3/payment',checkReceptionistRole,accountBillController.getAllPayment);
router.post('/api/v3/statistic/payment',accountBillController.getStatistic);
module.exports= router;