const categoryController= require('../controllers/categoryController');
const checkAdminRole= require('../middleware/checkAdminRole');
const checkReceptionistRole= require('../middleware/checkReceptionistRole');
const express= require('express');
const router= express.Router();

router.post('/api/v2/category/add',checkAdminRole,categoryController.addCategory);
router.post('/api/v2/add/category',checkAdminRole,categoryController.uploadImage,categoryController.addNewCategory)
router.get('/api/v2/category',checkAdminRole,categoryController.getCategory);
router.get('/api/v2/category/detail/:id',categoryController.getDetailCategory);
router.put('/api/v2/category/edit:id',checkAdminRole,categoryController.editCategory);
router.delete('/api/v2/category/delete/:id',checkAdminRole,categoryController.deleteCategory);
router.get('/api/v2/staff/manage/category',categoryController.getListCategoryForStaff);
router.get('/api/v3/category/search',checkAdminRole,categoryController.searchCategory);
router.get('/api/v3/category/statistic',categoryController.getStatistic);

// chức năng của staff
router.get('/api/v3/staff/category/detail/:id',categoryController.getDetailCategoryForStaff);

// chức năng cho user sau khi chọn bốt thì chọn tiếp các loại xe có xe đang ở trangh thái rảnh
router.get('/api/v3/category/free/:stationID',categoryController.getFreeCategoryInStation);
module.exports= router;