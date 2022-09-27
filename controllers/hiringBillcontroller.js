const { User, StaffStation } = require('../model/user')
const { HiringBill } = require('../model/hiringBill');
const { Station } = require('../model/station');
const { Category } = require('../model/category');
const { Bike } = require('../model/bike');
const jwt = require('jsonwebtoken');
const { verify } = require('crypto');

/**
 * chức năng của user:
 * đặt xe
 * hủy xe
 * xem thông tin hóa đơn
 */
const confirmBookBike = async (req, res) => {
    let id = req.params.id;
    HiringBill.findOneAndUpdate({ _id: id, endDate: null, endStation: null }, { total: -1, rentDate: Date.now() }, { new: true }, (err, doc) => {
        if (err) {
            return res.json({ status: 'fail', msg: 'server error' })
        }
        if (!doc) {
            return res.json({ status: 'fail', msg: 'Xe đã được trả ở một bốt khác' })
        }
        return res.json({ status: 'success', msg: 'Book bike successfully', bill: doc });
    })
}
const bookBike = async (req, res) => {
    let check = false;
    let id;
    if (!req.headers.authorization) {
        return res.json({ status: 'fail', msg: 'token required' })
    }
    const token = req.headers.authorization.split(' ')[1];
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, function (err, decodedToken) {
            if (err) {
                return res.json({ status: 'fail', msg: "Invalid token" })
            }
            user = User.find({ _id: decodedToken.userID })
            if (user) {
                check = true;
                id = decodedToken.userID;
            } else {
                return res.json({ status: 'fail', msg: 'User not found!' })
            }
        });
        if (check) {
            let bill = await HiringBill.findOne({ user: id, endDate: null, endStation: null, isCancel: false, total: { $lte: 0 } });
            console.log(bill)
            if (bill) {
                return res.json({ status: 'false', msg: 'Bạn đang có 1 đơn đặt xe rồi' })
            }
            let { stationID, categoryID } = req.body;
            if (!stationID) {
                return res.json({ status: 'fail', msg: 'staionID is missing' })
            }
            let station = await Station.findOne({ _id: stationID })
            let category = await Category.findOne({ _id: categoryID });
            if (station && category) {
                console.log(station, category)
                let bike = await Bike.findOne({ status: "free", station: stationID, category: categoryID, isDelete: false });
                if (!bike) {
                    return res.json({ status: 'fail', msg: 'Hiện tại bốt xe không có xe nào rảnh' })
                }
                let hiringBill = new HiringBill({ user: id, station: stationID, endStation: null, bike: bike._id, rentDate: null, endDate: null, total: null });
                let b = await Bike.findOneAndUpdate({ _id: bike._id }, { status: "waiting" }, { new: true });
                hiringBill.save().then(doc => {
                    return res.json({ status: 'success', msg: 'Booking successfully', bill: doc, bike: b })
                })
            } else {
                return res.json({ status: 'fail', msg: 'Fail to book bike' })
            }
        }
    }
}

// chức năng hủy xe
const cancelBookBike = async (req, res) => {
    let check = false;
    let id;
    if (!req.headers.authorization) {
        return res.json({ status: 'fail', msg: 'token required' })
    }
    const token = req.headers.authorization.split(' ')[1];
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, function (err, decodedToken) {
            if (err) {
                return res.json({ status: 'fail', msg: "Invalid token" })
            }
            let user = User.find({ _id: decodedToken.userID })
            if (user) {
                check = true;
                id = decodedToken.userID;
            } else {
                return res.json({ status: 'fail', msg: 'User not found!' })
            }
        });
        if (check) {
            let bill = await HiringBill.findOne({ user: id, rentDate: { $ne: null }, endDate: null, endStation: null });
            if (Date.now() - bill.rentDate > 300000) {
                return res.json({ status: 'fail', msg: 'Quá thời hạn 5 phút, bạn ko thể hủy xe' })
            } else {
                HiringBill.findOneAndUpdate({ _id: bill._id, isCancel: false }, { isCancel: true }, { new: true }, (err, doc) => {
                    if (err) return res.json({ status: 'fail', msg: 'server error' })
                    if (!doc) {
                        return res.json({ status: 'fail', msg: 'Khong tồn tại đơn đặt xe ' })
                    }
                    return res.json({ status: 'success', msg: 'Hủy xe thành công', check: false })
                })
            }
        }
    }
}

// xem thông tin đơn đặt
const getBill = async (req, res) => {
    let check = false;
    let id;
    if (!req.headers.authorization) {
        return res.json({ status: 'fail', msg: 'token required' })
    }
    const token = req.headers.authorization.split(' ')[1];
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, function (err, decodedToken) {
            if (err) {
                return res.json({ status: 'fail', msg: "Invalid token" })
            }
            user = User.find({ _id: decodedToken.userID })
            if (user) {
                check = true;
                id = decodedToken.userID;
            } else {
                return res.json({ status: 'fail', msg: 'User not found!' })
            }
        });
        if (check) {
            HiringBill.find({ user: id, isDelete: false })
                .populate("station")
                .populate("endStation")
                .populate({
                    path: 'bike', model: 'bike', populate: [{
                        path: 'category', model: 'category'
                    }]
                })
                .then(doc => {
                    return res.json({ status: 'success', data: doc })
                })
        }
    }
}

/**
 * chức năng của staff
 * phê duyệt đơn đặt xe khi user bắt đầu thuê xe
 * phê duyệt trả xe
 *  xem danh sach xe ms dc thue nhat va xe moi ra khoi bot gan nhat 
 */
const verifyHiringBill = async (req, res) => {
    let check = false;
    let id;
    if (!req.headers.authorization) {
        return res.json({ status: 'fail', msg: 'token required' })
    }
    let { billID, date } = req.body;
    console.log(billID, date)
    const token = req.headers.authorization.split(' ')[1];
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, function (err, decodedToken) {
            if (err) {
                return res.json({ status: 'fail', msg: "Invalid token" })
            }
            staff = StaffStation.find({ _id: decodedToken.userID })
            if (staff) {
                check = true;
                id = decodedToken.userID;
            } else {
                return res.json({ status: 'fail', msg: 'Staff not found!' })
            }
        });
        if (check) {
            let station = await Station.findOne({ staff: id, isDelete: false });
            let bill = await HiringBill.findOne({ _id: billID });
            if (bill && station) {
                if (JSON.stringify(bill.station) === JSON.stringify(station._id)) {
                    await Bike.findOneAndUpdate({ _id: bill.bike }, { status: 'hiring' }, { new: true });
                    HiringBill.findOneAndUpdate({ _id: billID }, { rentDate: date, total: 0 }, { new: true }, (err, doc) => {
                        if (err) return res.json({ status: "fail", msg: "Something wrong with server" })
                        return res.json({ status: 'success', msg: 'Xác nhận thuê xe.Thời gian thuê xe được tính từ ' + doc.rentDate });
                    })
                } else {
                    return res.json({ status: 'fail', msg: 'Xe của bạn không thuộc bốt này!' })
                }
            } else {
                return res.json({ status: 'fail', msg: 'Bill or station not found' })
            }
        }
    }
}

const verifyLendingBill = async (req, res) => {
    let check = false;
    let id;
    if (!req.headers.authorization) {
        return res.json({ status: 'fail', msg: 'token required' })
    }
    let { billID, date, status } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, function (err, decodedToken) {
            if (err) {
                return res.json({ status: 'fail', msg: "Invalid token" })
            }
            staff = StaffStation.find({ _id: decodedToken.userID })
            if (staff) {
                check = true;
                id = decodedToken.userID;
            } else {
                return res.json({ status: 'fail', msg: 'Staff not found!' })
            }
        });
        if (check) {
            let station = await Station.findOne({ staff: id, isDelete: false });
            let bill = await HiringBill.findOne({ _id: billID });
            if (bill && station) {
                let bill = await HiringBill.findOneAndUpdate({ _id: billID }, { endDate: date, endStation: station._id }, { new: true });
                let totalTime = bill.endDate - bill.rentDate;
                let bike = await Bike.findOneAndUpdate({ _id: bill.bike }, { status: status }, { new: true });
                let category = await Category.findOne({ _id: bike.category, isDelete: false });
                let hour = (totalTime / 1000) / 3600;
                let minute = (totalTime - (hour * 3600000)) / 60000;
                let u = await User.findOne({ _id: bill.user });
                let totalMoney = u.balance - hour * category.cost;
                console.log(hour, minute, totalMoney);
                let user = await User.findOneAndUpdate({ _id: bill.user }, { balance: totalMoney }, { new: true });
                let b = await HiringBill.findOneAndUpdate({ _id: billID }, { total: hour * category.cost }, { new: true })
                return res.json({ status: 'success', msg: 'Trả xe thành công', bill: b });
            } else {
                return res.json({ status: 'fail', msg: 'Bill or station not found' })
            }
        }
    }
}

const getLatestDate = async (req, res) => {
    let check = false;
    let id;
    if (!req.headers.authorization) {
        return res.json({ status: 'fail', msg: 'token required' })
    }
    const token = req.headers.authorization.split(' ')[1];
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, function (err, decodedToken) {
            if (err) {
                return res.json({ status: 'fail', msg: "Invalid token" })
            }
            staff = StaffStation.find({ _id: decodedToken.userID })
            if (staff) {
                check = true;
                id = decodedToken.userID;
            } else {
                return res.json({ status: 'fail', msg: 'Staff not found!' })
            }
        });
        if (check) {
            let station = await Station.findOne({ staff: id, isDelete: false });
            let billHiring = await HiringBill.find({ endDate: null, endStation: null, rentDate: { $ne: null }, station: station._id });
            let billReturning = await HiringBill.find({ endDate: { $ne: null }, endStation: station._id });
            console.log(station, billHiring, billReturning[billReturning.length - 1])
            if (billHiring.length == 0 || billHiring === undefined) {
                console.log(12)
                return res.json({ status: 'success', latestHiringBill: billHiring[billHiring.length - 1], lastestReturnBill: billReturning[billReturning.length - 1], station: station, staff: staff })
            } else {
                // let obj= JSON.stringify(latestHiringBill:null,lastestReturnBill:billReturning[billReturning.length-1],station:station,staff:staff)
                //return res.json({status:'success',data:})
            }
        }
    }


}

// chức năng của receptioonist
const getStatisticHiringBill = async (req, res) => {
    let { startDate, endDate } = req.body;
    let payment = await HiringBill.find({ endStation: { $ne: null }, endDate: { $gte: startDate, $lte: endDate } });
    return res.json({ status: 'success', data: payment })
}


// chức năng của admin
const getStatisticCategoryHiring = async (req, res) => {
    let s = []
    let c = await Category.find({}).distinct("_id");
    HiringBill.find({ isCancel: false, isDelete: false, endDate: { $ne: null } })
        .populate({ path: 'bike', model: 'bike', populate: [{ path: 'category', model: 'category', select: 'name' }] }).then(doc => {
            doc.forEach(function (d) {
                s.push(d.bike.category._id)
                if (s.length == doc.length) {
                    return res.json({ data: s });
                }
            })
        })

}
async function countMoney() {

}


exports.bookBike = bookBike;
exports.getBill = getBill;
exports.cancelBookBike = cancelBookBike;
exports.verifyHiringBill = verifyHiringBill;
exports.confirmBookBike = confirmBookBike;
exports.verifyLendingBill = verifyLendingBill;
exports.getLatestDate = getLatestDate
exports.getStatisticHiringBill = getStatisticHiringBill;
exports.getStatisticCategoryHiring = getStatisticCategoryHiring;