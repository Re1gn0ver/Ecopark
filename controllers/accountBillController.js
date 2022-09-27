const { Payment } = require('../model/accountBill');

// quyền amin
/**
 * xem tất cả hóa đơn
 * thống kê các hóa đơn theo ngày tháng năm 
 * @param {*} req 
 * @param {*} res 
 */
const getAllPayment = async (req, res) => {
    Payment.find({}).populate("user").then(doc => {
        return res.json({ status: 'success', data: doc })
    })
}

const getStatistic = async (req, res) => {
    let { startDate, endDate } = req.body;
    let payment = await Payment.find({ time: { $gte: new Date(parseInt(startDate)), $lte: new Date(parseInt(endDate)) } });
    return res.json({ status: 'success', data: payment })
}

exports.getAllPayment = getAllPayment;
exports.getStatistic = getStatistic;


