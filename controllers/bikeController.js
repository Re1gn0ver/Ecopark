const { Bike } = require('../model/bike');
const { Category } = require('../model/category')
const { Station } = require('../model/station')
const { StaffStation } = require('../model/user')
const jwt = require("jsonwebtoken");

const addBike = async (req, res) => {
    let data = req.body;
    try {
        for (var i = 0; i < data.length; i++) {
            let c = await Category.find({ _id: data[i].model });
            let s = await Station.find({ _id: data[i].station });
            if (c && s) {
                for (var j = 0; j < data[i].number; j++) {
                    let numberPlate = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
                    let bike = new Bike({ category: data[i].model, station: data[i].station, status: "free", numberPlate: "29A" + numberPlate });
                    bike.save();
                }
                // return res.json({status:'success',msg:'Add bike successfully'})   
            } else {
                return res.json({ status: 'fail', msg: 'Can not add bike due to invalid id' })
            }
        }
        return res.json({ status: 'success', msg: 'Add bike successfully' });
    } catch (error) {
        console.log(error)
        res.json({ status: 'fail', error: error });
    }
}

const getBikes = async (req, res) => {
    let sort = req.query.sortBy;
    console.log(sort)
    switch (sort) {
        case "free":
            try {
                Bike.find({ status: sort, isDelete: false }).populate("category").populate({ path: "station", populate: { path: "location" } }).then(doc => {
                    return res.json({ status: 'success', data: doc })
                })
            } catch (error) {
                console.log(error);
            }
            break;
        case "hiring":
            try {
                Bike.find({ status: sort, isDelete: false }).populate("category").populate({ path: "station", populate: { path: "location" } }).then(doc => {
                    return res.json({ status: 'success', data: doc })
                })
            } catch (error) {
                console.log(error);
            }
            break;
        case "waiting":
            try {
                Bike.find({ status: sort, isDelete: false }).populate("category").populate({ path: "station", populate: { path: "location" } }).then(doc => {
                    return res.json({ status: 'success', data: doc })
                })
            } catch (error) {
                console.log(error);
            }
            break;
        case "priceLowToHigh":
            try {
                const bikes = await Bike.aggregate([
                    { "$match": { isDelete: false } },
                    {
                        $lookup: {
                            localField: "category",
                            foreignField: "_id",
                            from: "categories",
                            as: "category"
                        }
                    },
                    {
                        $unwind: "$category"
                    },
                    {
                        $sort: {
                            "category.cost": 1
                        }
                    }
                ])
                return res.json({ status: 'success', data: bikes })
            } catch (error) {
                console.log(error);
            }
            break;
        case "priceHighToLow":
            try {
                const bikes = await Bike.aggregate([
                    { "$match": { isDelete: false } },
                    {
                        $lookup: {
                            localField: "category",
                            foreignField: "_id",
                            from: "categories",
                            as: "category"
                        }
                    },
                    {
                        $unwind: "$category"
                    },
                    {
                        $sort: {
                            "category.cost": -1
                        }
                    }
                ])
                return res.json({ status: 'success', data: bikes })
            } catch (error) {
                console.log(error);
            }
        default:
            res.json({ status: 'fail', msg: 'sortBy parameter not found' })
            break;
    }
}

// chi tiết 1 xe
const getDetailBike = async (req, res) => {
    let id = req.params.id;
    Bike.find({ _id: id }).populate("category").populate({ path: "station", populate: { path: "location" } }).then(doc => {
        if (!doc) {
            return res.json({ status: 'fail', msg: 'Can not find bike with this id' })
        }
        return res.json({ status: 'success', data: doc })
    })
}

// chỉnh sửa tt xe
const editBike = async (req, res) => {
    let id = req.params;
    Bike.findOneAndUpdate({ _id: id }, req.body, { new: true }, (err, doc) => {
        if (err) {
            return res.json({ status: 'fail', msg: 'server error' })
        }
        if (!doc) {
            return res.json({ status: 'fail', msg: 'Can not find bike with this id' })
        }
        return res.json({ status: 'success', msg: 'update successfully' })
    })
}

const deleteBike = async (req, res) => {
    let listID = req.body;
    let check = false;
    try {
        for (var i = 0; i < listID.length; i++) {
            console.log(listID[i])
            Bike.findOneAndUpdate({ _id: listID[i] }, { isDelete: true }, { new: true }, (err, doc) => {
                if (!err) {
                    check = true;
                }
            })
        }
        if (check) {
            return res.json({ status: 'success', msg: 'delete successfully!' })
        } else {
            return res.json({ status: 'fail', msg: 'seem to have error ' })
        }
    } catch (err) {
        res.json({ status: 'fail', error: error });
    }
}

/**
 * Trả về danh sách thông tin của các bốt hiện tại đang có xe rảnh:
 */
const getStationWithFreeBike = async (req, res) => {
    let bikes;
    try {
        bikes = await Bike.find({ $and: [{ status: "free" }, { isDelete: false }] }).distinct('station');
        console.log(bikes);
    } catch (err) {
        console.log(err);
    }
    Station.find({ _id: { $in: bikes } }).populate("location").populate("staff").then(doc => {
        if (!doc) return res.json({ status: 'success', data: "Out of bike" })
        return res.json({ status: 'success', data: doc })
    })
}

/**
 * Danh sách xe free hiện có sau khi đã lựa chọn bốt
 */
const getFreeBikeFromStation = async (req, res) => {
    let stationID = req.params.id;
    Bike.find({ status: "free", station: stationID, isDelete: false }).populate("category").then(doc => {
        return res.json({ status: "success", data: doc })
    })
}


/**
 * thống kê xe sau khi chọn bốt
 */
const getStatistics = async (req, res) => {
    let stationID = req.params.id;
    getCounts(stationID).then(doc => { res.json({ status: 'success', data: doc }) }).catch((err) => console.log(err))
}


async function getCounts(stationID) {
    let [free, hiring, waiting, breakdown] = await Promise.all([Bike.countDocuments({ status: "free", station: stationID }), Bike.countDocuments({ status: "hiring", station: stationID }),
    Bike.countDocuments({ status: "waiting", station: stationID }), Bike.countDocuments({ status: "breakdown", station: stationID })]);
    return { free, hiring, waiting, breakdown };
}

// admin tìm kiếm xe
const adminSearchBike = async (req, res) => {
    let type = req.params.sortBy;
    let q = req.params.q;
    if (type == 'free' || type == 'hiring' || type == 'waiting') {
        Bike.find({ status: type, isDelete: false, numberPlate: { $regex: '.*' + q + '.*' } })
            .populate("category")
            .populate({ path: "station", populate: { path: "location" } })
            .then(doc => {
                return res.json({ status: 'success', data: doc })
            })
    } else if (type == 'priceHighToLow') {
        Bike.find({ status: type, isDelete: false, numberPlate: { $regex: '.*' + q + '.*' } })
            .populate("category")
            .populate({ path: "station", populate: { path: "location" } })
            .then(doc => {
                return res.json({ status: 'success', data: doc })
            })
    }
}

/**
 * lấy danh sách các xe đang ở tạng thái thuê
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */



// phần dành cho receptiinist


// phần dành cho staff
/**
 * lấy danh sách các xe bốt mình quản lý
 * tìm kiếm xe theo tên danh mục
 * lọc các xe trong bốt (free, hiring, breakdown, waiting)
 */
const getListBikeForStaff = async (req, res) => {
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
            let station = await Station.findOne({ staff: id });
            let q = req.query.type;
            if (!q) {
                Bike.find({ station: station._id, isDelete: false, status: "free" }).populate("category").populate("station").then(doc => {
                    return res.json({ status: 'success', data: doc })
                })
            } else {
                Bike.find({ station: station._id, isDelete: false, status: q }).populate("category").populate("station").then(doc => {
                    return res.json({ status: 'success', data: doc })
                })
            }
        }
    } else {
        return res.json({ status: 'fail', msg: 'token required' })
    }
}

const searchBikeByName = async (req, res) => {
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
            let station = await Station.findOne({ staff: id });
            let category = await Category.findOne({ name_lower: { $regex: '.*' + req.query.s.toLowerCase() + '.*' } });
            console.log(category)
            if (category) {
                Bike.find({ station: station._id, category: category._id }).populate("category").populate("station").then(doc => {
                    return res.json({ status: 'success', data: doc })
                })
            } else {
                return res.json({ status: 'fail', msg: 'tên danh mục ko tồn tại!' })
            }
        }
    } else {
        return res.json({ status: 'fail', msg: 'token required' })
    }
}

// staff lọc xe 
const filterBikeByStatus = async (req, res) => {
    let sort = req.query.sortBy;
    console.log(sort);
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
            let station = await Station.findOne({ staff: id });
            if (!sort) {
                return res.json({ status: 'fail', msg: 'Invalid data sort' })
            }
            if (sort === "free" || sort === "waiting" || sort === "hiring" || sort === "breakdown") {
                try {
                    Bike.find({ station: station._id, status: sort }).populate("category").populate({ path: "station", populate: { path: "location" } }).then(doc => {
                        return res.json({ status: 'success', data: doc })
                    })
                } catch (error) {
                    console.log(error);
                }
            } else if (sort == "priceHighToLow") {
                let c = await Category.find({ station: station._id, isDelete: false }).sort({ 'cost': -1 });
                return res.json({ status: 'success', data: c })
            } else if (sort == "priceLowToHigh") {
                let c = await Category.find({ station: station._id, isDelete: false }).sort({ 'cost': 1 });
                return res.json({ status: 'success', data: c })
            }
            else {
                return res.json({ status: 'fail', msg: 'Data search invalid' })
            }
        }
    } else {
        return res.json({ status: 'fail', msg: 'token required' })
    }
}

exports.addBike = addBike;
exports.getBikes = getBikes;
exports.getDetailBike = getDetailBike;
exports.editBike = editBike;
exports.deleteBike = deleteBike;
exports.getStationWithFreeBike = getStationWithFreeBike;
exports.getFreeBikeFromStation = getFreeBikeFromStation;
exports.getStatistics = getStatistics;
exports.getListBikeForStaff = getListBikeForStaff;
exports.searchBikeByName = searchBikeByName;
exports.filterBikeByStatus = filterBikeByStatus;
