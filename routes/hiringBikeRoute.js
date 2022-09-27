const express= require('express');
const router= express.Router();
const hiringController= require('../controllers/hiringBillcontroller');
const checkReceptionist= require('../middleware/checkReceptionistRole')

// user
router.post('/api/v3/user/book/bike',hiringController.bookBike);
router.get('/api/v3/user/booking/history',hiringController.getBill);
router.get('/api/v3/user/cancel/bike',hiringController.cancelBookBike);
router.get('/api/v3/user/confirm/bike/:id',hiringController.confirmBookBike);

//staff
router.post('/api/v3/staff/verify/hiring/bill',hiringController.verifyHiringBill);
router.post('/api/v3/staff/verify/return/bill',hiringController.verifyLendingBill);
router.get('/api/v3/staff/dashboard',hiringController.getLatestDate);

// receptionist
router.post('/api/v3/receptionist/hiring/statistic',checkReceptionist,hiringController.getStatisticHiringBill)

// admin
router.get('/api/v3/admin/category/hiring/statistic',hiringController.getStatisticCategoryHiring)

module.exports= router;