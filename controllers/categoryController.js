const { Receptionist, StaffStation, Admin, User } = require('../model/user');
const { Category } = require('../model/category')
const { Bike } = require('../model/bike')
const { Station } = require('../model/station')
const jwt = require("jsonwebtoken");
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
/**
 * add category
 * get category 
 * xem chi tiết 1 category 
 * thống kê số xe trong các loại xe
 * thôngs kê số lượng xe được thuê trong các loại xe
 */
const getStatisticHiringCategory = async (req, res) => {

}

const addCategory = async (req, res) => {
    const { cost, image, description, name } = req.body;
    let name_lower = name.toLowerCase();
    let category = new Category({ cost, image, description, name, name_lower });
    Category.findOne({ name_lower: name_lower }, function (err, doc) {
        if (err) {
            return res.json({ status: 'fail', msg: 'server error' })
        } else if (doc) {
            return res.json({ status: 'fail', msg: 'Tên danh mục đã tồn tại!' })
        }
    })
    await category.save().then(doc => {
        res.json({ status: 'success', data: doc })
    })
}

const uploadImage = multer({ storage: storage }).single('img');

const addNewCategory = async (req, res) => {
    const { cost, image, description, name } = req.body;
    console.log(req.body)
    console.log(req.file.path)
    let name_lower = name.toLowerCase();
    let category = new Category({ cost, image, description, name, name_lower, img: req.file.path });
    Category.findOne({ name_lower: name_lower }, function (err, doc) {
        if (err) {
            return res.json({ status: 'fail', msg: 'server error' })
        } else if (doc) {
            return res.json({ status: 'fail', msg: 'Tên danh mục đã tồn tại!' })
        }
    })
    await category.save().then(doc => {
        return res.json({ status: 'success', data: doc })
    })
}

const getCategory = async (req, res) => {
    let q = req.query.sortBy;
    if (!q) {
        Category.find({ isDelete: false }, (err, doc) => {
            return res.json({ status: 'successs', data: doc })
        })
    } else if (q == 'priceHighToLow') {
        let c = await Category.find({ isDelete: false }).sort({ 'cost': -1 });
        return res.json({ status: 'success', data: c })
    } else if (q == 'priceLowToHigh') {
        let c = await Category.find({ isDelete: false }).sort({ 'cost': 1 });
        return res.json({ status: 'success', data: c })
    }
}
const searchCategory = async (req, res) => {
    let q = req.query.q;
    console.log(q);
    if (!q) {
        return res.json({ status: 'fail', msg: 'missing parameter' })
    }
    let c = await Category.find({ name_lower: { $regex: '.*' + q + '.*' }, isDelete: false });
    return res.json({ status: 'success', data: c });
}

const getDetailCategory = async (req, res) => {
    let id = req.params.id;
    if (!id) {
        return res.json({ status: 'fail', msg: 'Missing id parameter' })
    }
    let category = await Category.findOne({ _id: id });
    if (!category) {
        return res.json({ status: 'fail', msg: 'Category is not found' })
    }
    if (category.isDelete) {
        return res.json({ status: 'fail', msg: 'Category has been deleted' })
    }
    if (category && !category.isDelete) {
        let bikes = await Bike.find({ category: category._id, isDelete: false });
        return res.json({ status: 'success', data: category, length: bikes.length })
    }
}

const editCategory = async (req, res) => {
    let id = req.params.id;
    if (!id) {
        return res.json({ status: 'fail', msg: 'Missing id parameter' })
    }
    Category.findOneAndUpdate({ _id: id, isDelete: "false" }, req.body, { new: true }, (err, doc) => {
        if (err) {
            return res.json({ status: 'fail', msg: 'server error' })
        }
        if (!doc) {
            return res.json({ status: 'fail', msg: 'category is not found or has been deleted' })
        }
        return res.json({ status: 'successs', msg: 'Update category successfully' })
    })

}

const deleteCategory = async (req, res) => {
    let id = req.params.id;
    if (!id) {
        return res.json({ status: 'fail', msg: 'Missing id parameter' })
    }
    Category.findOneAndUpdate({ _id: id, isDelete: "false" }, { isDelete: true }, { new: true }, (err, doc) => {
        if (err) {
            return res.json({ status: 'fail', msg: 'server error' })
        }
        if (!doc) {
            return res.json({ status: 'fail', msg: 'category is not found or has been deleted' })
        }
        return res.json({ status: 'successs', msg: 'delete category successfully' })
    })
    let bikes = await Bike.find({ category: id });
    for (var i = 0; i < bikes.length; i++) {
        Bike.findOneAndUpdate({ _id: bikes[i], isDelete: "false" }, { isDelete: true }, { new: true }, (err, doc) => { });
    }
}


// lấy danh mục xe mà staff quản lý
// thống kê số xe trong các loại xe mà staff đó quản lý
const getListCategoryForStaff = async (req, res) => {
    let token;
    let check = false
    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, function (err, decodedToken) {
            if (err) {
                return res.json({ status: 'fail', msg: "Invalid token" })
            }
            staff = StaffStation.find({ _id: decodedToken.userID })
            if (staff) {
                check = true;
                id = decodedToken.userID;
            } else {
                return res.json({ status: 'fail', msg: 'Invalid token for staff!' })
            }
        });
        if (check) {
            let station = await Station.findOne({ staff: id, isDelete: false });
            if (!station) {
                return res.json({ status: 'success', msg: 'This station seems to have no category' })
            } else {
                let q = req.query.sortBy;
                let listCategory = await Bike.find({ station: station._id, isDelete: false }).distinct("category");
                if (q == 'priceHighToLow') {
                    let c = await Category.find({ _id: { $in: listCategory }, isDelete: false }).sort({ 'cost': -1 });
                    return res.json({ status: 'success', data: c })
                } else if (q == 'priceLowToHigh') {
                    let c = await Category.find({ _id: { $in: listCategory }, isDelete: false }).sort({ 'cost': 1 });
                    return res.json({ status: 'success', data: c })
                } else {
                    Category.find({ _id: { $in: listCategory }, isDelete: false }, (err, doc) => {
                        if (err) {
                            return res.json({ status: 'fail', msg: 'server error' })
                        }
                        if (!doc) {
                            return res.json({ status: 'success', msg: 'Hiện tại bổt ko có xe' })
                        }
                        return res.json({ status: 'success', data: doc })
                    })
                }
            }
        }
    } else {
        return res.json({ status: 'fail', msg: 'token required' })
    }
}

const getDetailCategoryForStaff = async (req, res) => {
    let token;
    let check = false
    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, function (err, decodedToken) {
            if (err) {
                return res.json({ status: 'fail', msg: "Invalid token" })
            }
            staff = StaffStation.find({ _id: decodedToken.userID })
            if (staff) {
                check = true;
                id = decodedToken.userID;
            } else {
                return res.json({ status: 'fail', msg: 'Invalid token for staff!' })
            }
        });
        if (check) {
            let station = await Station.findOne({ staff: id, isDelete: false });
            if (!station) {
                return res.json({ status: 'success', msg: 'This station seems to have no category' })
            } else {
                let categoryID = req.params.id;
                let bikes = await Bike.find({ category: categoryID, station: station._id, isDelete: false });
                Category.findOne({ _id: categoryID, isDelete: false }, (err, doc) => {
                    if (err) {
                        return res.json({ status: 'fail', msg: 'server error' })
                    }
                    return res.json({ status: 'success', data: doc, length: bikes.length })
                })

            }
        }
    } else {
        return res.json({ status: 'fail', msg: 'token required' })
    }
}

const getStatistic = async (req, res) => {
    let token;
    let check = false
    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, function (err, decodedToken) {
            if (err) {
                return res.json({ status: 'fail', msg: "Invalid token" })
            }
            staff = StaffStation.find({ _id: decodedToken.userID })
            if (staff) {
                check = true;
                id = decodedToken.userID;
            } else {
                return res.json({ status: 'fail', msg: 'Invalid token for staff!' })
            }
        });
        if (check) {
            let station = await Station.findOne({ staff: id, isDelete: false });
            if (!station) {
                return res.json({ status: 'success', msg: 'This station seems to have no category' })
            } else {
                let listCategory = await Bike.find({ station: station._id, isDelete: false }).distinct("category");
                let statistic = [];
                listCategory.forEach(function (item) {
                    getCount(item, station._id).then(document => {
                        statistic.push(document);
                        if (statistic.length == listCategory.length) {
                            getCounts(station._id).then(d => {
                                return res.json({ status: 'success', data1: statistic, data2: d })
                            })
                        }
                    })
                })
            }
        }
    } else {
        return res.json({ status: 'fail', msg: 'token required' })
    }
}

async function getCount(categoryID, stationID) {
    let [category, number] = await Promise.all([
        Category.findOne({ _id: categoryID }).distinct('name'),
        Bike.countDocuments({ station: stationID, category: categoryID, isDelete: false })
    ]);
    return { category, number };
}

async function getCounts(stationID) {
    let [free, hiring, waiting, breakdown] = await Promise.all([
        Bike.countDocuments({ status: "free", station: stationID, isDelete: false }),
        Bike.countDocuments({ status: "hiring", station: stationID, isDelete: false }),
        Bike.countDocuments({ status: "waiting", station: stationID, isDelete: false }),
        Bike.countDocuments({ status: "breakdown", station: stationID, isDelete: false })
    ]);
    return { free, hiring, waiting, breakdown };
}


/**
 * chức năng cho người dùng
 * - sau khi chọn bốt xe thì chọn tiếp các loại xe đang trong bốt mà ở trạng thai rảnh
 */
const getFreeCategoryInStation = async (req, res) => {
    let id = req.params.stationID;
    let category = await Bike.find({ station: id, isDelete: false, status: "free" }).distinct('category');
    // console.log(category);
    let c = [...new Set(category)];
    let tmp = [];
    for (var i = 0; i < c.length; i++) {
        let c1 = await Category.find({ _id: c[i], isDelete: false });
        tmp.push(c1);
        if (tmp.length == c.length) {
            return res.json({ status: 'success', data: tmp })
        }
    }
    console.log(c)
}

exports.getFreeCategoryInStation = getFreeCategoryInStation;
exports.getListCategoryForStaff = getListCategoryForStaff;
exports.addCategory = addCategory;
exports.getCategory = getCategory;
exports.getDetailCategory = getDetailCategory;
exports.editCategory = editCategory;
exports.deleteCategory = deleteCategory;
exports.addNewCategory = addNewCategory;
exports.uploadImage = uploadImage;
exports.searchCategory = searchCategory;
exports.getStatistic = getStatistic;
exports.getDetailCategoryForStaff = getDetailCategoryForStaff
