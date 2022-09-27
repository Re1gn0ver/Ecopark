const stationController= require('../controllers/stationController');
const checkAdminRole= require('../middleware/checkAdminRole');
const express= require('express');
const router= express.Router();

router.post('/api/v2/station/add',checkAdminRole,stationController.addStation);
router.get('/api/v2/station',checkAdminRole,stationController.getStation);
router.get('/api/v2/station/detail/:id',checkAdminRole,stationController.detailStation)
router.get('/api/v2/search/station',checkAdminRole,stationController.searchStationByName);
router.put("/api/v2/station/edit/:id",checkAdminRole,stationController.editStation);
router.delete("/api/v2/station/delete/:id",checkAdminRole,stationController.deleteStation);
router.get("/api/v2/station/detail/statistic/:id",checkAdminRole,stationController.getStatisticOfStation);
module.exports= router;