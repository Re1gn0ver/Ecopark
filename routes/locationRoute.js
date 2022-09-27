const locationController= require('../controllers/locationController');
const checkAdminRole= require('../middleware/checkAdminRole');
const checkReceptionistRole= require('../middleware/checkReceptionistRole');
const express= require('express');
const router= express.Router();

router.post('/api/v2/location/add',checkAdminRole,locationController.addLocation);
router.get('/api/v2/location',checkAdminRole,locationController.getLocation);
router.get('/api/v2/locations',checkAdminRole,locationController.getListLocationNotInAStation);
module.exports= router;