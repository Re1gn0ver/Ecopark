const bikeController= require('../controllers/bikeController')
const checkAdminRole= require('../middleware/checkAdminRole');
const checkStaffRole= require('../middleware/checkStaffRole')
const express= require('express');
const router= express.Router();

router.get("/api/v2/bikes",checkAdminRole,bikeController.getBikes);
router.get("/api/v2/bike/detail/:id",bikeController.getDetailBike)
router.post("/api/v2/bike/add",checkAdminRole,bikeController.addBike);
router.put("/api/v2/bike/edit/:id",checkAdminRole,bikeController.editBike);
router.post("/api/v2/bike/delete",checkAdminRole,bikeController.deleteBike);
router.get("/api/v2/station/free",bikeController.getStationWithFreeBike);
router.get("/api/v2/statistics/:id",checkAdminRole,bikeController.getStatistics);
router.get("/api/v2/bikes/free/:id",bikeController.getFreeBikeFromStation);

/**
 * api router cho staff
 */
router.get("/api/v2/station/bikes",bikeController.getListBikeForStaff)
router.get("/api/v2/bikes/search",bikeController.searchBikeByName);
router.get("/api/v2/bikes/filter",bikeController.filterBikeByStatus);

module.exports= router;