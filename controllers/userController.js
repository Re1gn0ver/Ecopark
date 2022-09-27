const {Receptionist, StaffStation, Admin, User} = require("../model/user");
const {Token} = require("../model/token");
const {createJwtToken} = require("../util/auth");
const bcrypt = require("bcrypt");
const {validationResult} = require("express-validator");
const SendEmail = require("../util/sendEmail");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {Station} = require("../model/station");
const {HiringBill} = require("../model/hiringBill");
const {decode} = require("punycode");
const {Payment} = require("../model/accountBill");
const {Category} = require("../model/category");
const {Bike} = require("../model/bike");
const {getListCategoryForStaff} = require("./categoryController");
const {log} = require("console");

// register - dang ky tai khoan
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({msg: "Invalid input, please check your data"});
  }
  const {identifyNumber, password, email, phoneNumber, name, residentID} =
    req.body;
  let user;
  let users;
  try {
    user = await User.findOne({email});
  } catch (err) {
    console.errors(err.message);
    res.status(500).send({msg: "Server Error"});
  }
  if (user) {
    return res
      .status(200)
      .json({
        status: "fail",
        msg: "User already exists, please login instead.",
      });
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    console.errors(err.message);
    res.status(500).send({msg: "Server Error"});
  }

  users = await User.find({});
  if (users) {
    let identityNumberArray = users.map((data) => data.identifyNumber);
    let phoneNumberArray = users.map((data) => data.phoneNumber);
    if (identityNumberArray.includes(identifyNumber)) {
      return res
        .status(200)
        .json({status: "fail", msg: "Indentity number existed!"});
    } else if (phoneNumberArray.includes(phoneNumber)) {
      return res
        .status(200)
        .json({status: "fail", msg: "Telephone number existed !"});
    }
  }

  user = new User({
    identifyNumber,
    password: hashedPassword,
    email,
    phoneNumber,
    name,
    balance: 0,
    residentID,
    activate: "true",
    role: "user",
  });
  try {
    await user.save().then((doc) => {
      const token = createJwtToken(doc._id);
      res.cookie(token);
      res.json({status: "unauthenticated", token: token});
    });
  } catch (err) {
    console.log(err);
  }
};

// login - dang nhap tai khoan thuong
const login = async (req, res, next) => {
  if (!req.headers.authorization) {
    const {email, password} = req.body;
    let staff;
    try {
      staff = await User.findOne({email: email});
    } catch (error) {
      console.log(error);
    }
    if (!staff) {
      return res.json({status: "fail", msg: "email not found"});
    }
    let check = false;
    try {
      check = await bcrypt.compare(password, staff.password);
    } catch (err) {
      console.log(err);
    }
    if (!check) {
      return res.json({status: "fail", msg: "Password is not match!"});
    }
    const token = createJwtToken(staff._id);
    let h1 = await HiringBill.find({user: staff._id, endDate: null});
    let h2 = await HiringBill.find({user: staff._id});
    let h3 = await HiringBill.find({user: staff._id, isCancel: true});
    staff = await User.findOne({_id: staff._id});
    // console.log(h1,h2)
    if (h2.length == 0 || h1.length == 0 || h3.length != 0) {
      return res.json({
        status: "success",
        msg: "login successfully",
        token: token,
        data: staff,
        check: false,
      });
    } else {
      return res.json({
        status: "success",
        msg: "login successfully",
        token: token,
        data: staff,
        check: true,
      });
    }
  } else {
    const token = req.headers.authorization.split(" ")[1];
    let id;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, function (err, decodedToken) {
        if (err) {
          return res.json({status: "fail", msg: "Invalid token"});
        }
        id = decodedToken.userID;
      });
      if (id) {
        let user = await User.findOne({_id: id});
        let h1 = await HiringBill.find({user: user._id, endDate: null});
        let h2 = await HiringBill.find({user: user._id});
        let h3 = await HiringBill.find({user: user._id, isCancel: true});
        // console.log(h1,h2)
        if (h2.length == 0 || h1.length == 0 || h3.length != 0) {
          return res.json({
            status: "success",
            msg: "login successfully",
            token: token,
            data: user,
            check: false,
          });
        } else {
          return res.json({
            status: "success",
            msg: "login successfully",
            token: token,
            data: user,
            check: true,
          });
        }
      } else {
        return res.json({status: "fail", msg: "invalid token"});
      }
    }
  }
};

//change password tài khoản thường
const normalUserChangePass = async (req, res) => {
  const userID = req.params.id;
  let user = await User.findOne({_id: userID});
  if (!user) {
    return res.json({status: "fail", msg: "user not found!"});
  }
  const {oldPassword, newPassword} = req.body;
  if (oldPassword && newPassword) {
    let check = false;
    try {
      check = await bcrypt.compare(oldPassword, user.password);
    } catch (err) {
      console.errors(err.message);
      res.status(200).send({status: "fail", msg: "Server Error"});
    }
    if (!check) {
      return res.json({status: "fail", msg: "Old password is not match"});
    } else {
      let hashedPassword = await bcrypt.hash(newPassword, 12);
      User.findOneAndUpdate(
        {_id: userID},
        {password: hashedPassword},
        {new: true},
        (err, doc) => {
          return res.json({
            status: "success",
            msg: "password has changed",
            info: doc,
          });
        }
      );
    }
  }
};

// login - dang nhap tai khoan admin
const adminLogin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({msg: "Invalid input, please check your data"});
  }
  if (!req.headers.authorization) {
    const {email, password} = req.body;
    Admin.findOne({email: email}, (err, doc) => {
      if (err) {
        return res.json({stauts: "fail", msg: "server error"});
      } else if (!doc) {
        return res.json({status: "fail", msg: "Can not find that email !"});
      } else if (password !== doc.password) {
        return res.json({status: "fail", msg: "Password is not match!"});
      }
      let tokenn = createJwtToken(doc._id);
      return res.json({status: "success", token: tokenn, data: doc});
    });
  } else {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, function (err, decodedToken) {
        if (err) {
          return res.json({status: "fail", msg: "Invalid token"});
        }
        Admin.findOne({_id: decodedToken.userID}, (err, doc) => {
          if (err) {
            return res.json({status: "fail", msg: "server error"});
          } else if (doc) {
            return res.json({
              status: "success",
              msg: "login successfully!",
              token: token,
              data: doc,
            });
          }
        });
      });
    }
  }
};

/**chuc nang cua admin
 * + get account (staff || receptionist)
 * + get detail account (staff || receptionist)
 * + add account (staff || receptionist)
 * + edit account (staff || receptionist)
 * + delete account
 * */
const changePass = async (req, res) => {
  try {
    await Admin.findOneAndUpdate(
      {password: req.body.password},
      {password: req.body.newpass},
      {new: true}
    ).then((doc) => {
      if (!doc) {
        return res.json({status: false, msg: "Password is not found!"});
      }
      return res.json({status: true, msg: "Update new password successfully!"});
    });
  } catch (err) {}
};
const addAccount = async (req, res) => {
  const role = req.query.type;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({msg: "Invalid input, please check your data"});
  }
  const {
    identifyNumber,
    userName,
    password,
    email,
    name,
    phoneNumber,
    address,
  } = req.body;
  let user;
  const roles = ["staff", "receptionist"];
  if (!roles.includes(role)) {
    return res.json({status: false, msg: "Role not found"});
  }
  if (role === "staff") {
    user = await StaffStation.findOne({email: email});
  } else if (role === "receptionist") {
    user = await Receptionist.findOne({email: email});
  }
  console.log(user);
  if (user) {
    return res.status(200).json({msg: "Email already existed"});
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    console.errors(err.message);
    res.status(500).send({msg: "Server Error"});
  }
  if (role === "staff") {
    let staffs = await StaffStation.find({});
    let phoneNumberArray = staffs.map((data) => data.phoneNumber);
    let identityNumberArray = staffs.map((data) => data.identifyNumber);
    if (phoneNumberArray.includes(phoneNumber)) {
      return res
        .status(200)
        .json({status: "fail", msg: "Telephone Number Existed!"});
    } else if (identityNumberArray.includes(identifyNumber)) {
      return res
        .status(200)
        .json({status: "fail", msg: "Identity Number Existed!"});
    }
    user = new StaffStation({
      identifyNumber,
      userName,
      password: hashedPassword,
      email,
      phoneNumber,
      address,
      name,
      staffID: Date.now(),
      role: "staff",
    });
  } else if (role === "receptionist") {
    let staffs = await Receptionist.find({});
    let phoneNumberArray = staffs.map((data) => data.phoneNumber);
    let identityNumberArray = staffs.map((data) => data.identifyNumber);
    if (phoneNumberArray.includes(phoneNumber)) {
      return res
        .status(200)
        .json({status: "fail", msg: "Phone Number Existed!"});
    } else if (identityNumberArray.includes(identifyNumber)) {
      return res
        .status(200)
        .json({status: "fail", msg: "Identity Number existed!"});
    }
    user = new Receptionist({
      identifyNumber,
      userName,
      password: hashedPassword,
      email,
      phoneNumber,
      address,
      name,
      receptionistID: Date.now(),
      role: "receptionist",
    });
  }

  try {
    await user.save().then((doc) => {
      res.json({status: "success", data: doc});
    });
  } catch (err) {
    console.log(err);
  }
};

const editAccount = async (req, res) => {
  const role = req.query.type.split("/")[0];
  const id = req.query.type.split("/")[1];
  console.log(role, id);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({msg: "Invalid input, please check your data"});
  }
  const roles = ["staff", "receptionist"];
  if (!roles.includes(role)) {
    return res.json({status: "fail", msg: "Role not found"});
  }
  try {
    if (role === "staff") {
      StaffStation.find({_id: id}, (err, doc) => {
        if (!doc) {
          return res.json({status: "fail", msg: "url request invalid"});
        }
      });
      StaffStation.findOneAndUpdate({_id: id}, req.body, {new: true}).then(
        (doc) => {
          res.json({status: "success", data: doc});
        }
      );
    } else if (role === "receptionist") {
      Receptionist.find({_id: id}, (err, doc) => {
        if (!doc) {
          return res.json({status: "fail", msg: "url request invalid"});
        }
      });
      Receptionist.findOneAndUpdate({_id: id}, req.body, {new: true}).then(
        (doc) => {
          res.json({status: "success", data: doc});
        }
      );
    }
  } catch (err) {
    return res.json({status: "fail", msg: "url requets invalid!"});
  }
};

const deleteAccount = async (req, res) => {
  const role = req.query.type.split("/")[0];
  const id = req.query.type.split("/")[1];
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(200).json({msg: "Invalid input, please check your data"});
  }
  const roles = ["staff", "receptionist"];
  if (!roles.includes(role)) {
    return res.json({status: false, msg: "Role not found"});
  }
  if (role === "staff") {
    try {
      StaffStation.findOneAndRemove({_id: id}, function (err, doc) {
        if (err) {
          return res.status(500).json({status: "fail", msg: "error server"});
        } else if (!doc) {
          return res
            .status(404)
            .json({status: "fail", msg: "can not found document"});
        }
        return res.json({status: "success", data: doc});
      });
    } catch (error) {
      res.json({status: "fail", msg: "url request invalid "});
    }
  }
  if (role === "receptionist") {
    try {
      Receptionist.findOneAndRemove({_id: id}, function (err, doc) {
        if (err) {
          return res.status(500).json({status: "fail", msg: "error server"});
        } else if (!doc) {
          return res
            .status(404)
            .json({status: "fail", data: "can not found document"});
        }
        return res.json({status: "success", data: doc});
      });
    } catch (error) {
      return res.json({status: "success", msg: "url request invalid"});
    }
  }
};

const getAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({msg: "Invalid input, please check your data"});
  }
  const role = req.query.type;
  console.log(role);
  const roles = ["staff", "receptionist"];
  if (!roles.includes(role)) {
    return res.json({status: false, msg: "Role not found"});
  }
  if (role === "receptionist") {
    Receptionist.find({}, (err, doc) => {
      if (err) {
        return res.status(500).json({status: "fail", msg: "error"});
      }
      return res.json({status: "success", data: doc});
    });
  }
  if (role === "staff") {
    StaffStation.find({}, (err, doc) => {
      if (err) {
        return res.status(500).json({status: "fail", msg: "error"});
      }
      return res.json({status: "success", data: doc});
    });
  }

  // return res.json({status:false,msg:'role not found'})
};

const getDetailAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({msg: "Invalid input, please check your data"});
  }
  const role = req.query.type.split("/")[0];
  const id = req.query.type.split("/")[1];
  console.log(role, id);
  const roles = ["staff", "receptionist"];
  if (!roles.includes(role)) {
    return res.json({status: false, msg: "Role not found"});
  }
  if (role === "receptionist") {
    try {
      Receptionist.findOne({_id: id}, function (err, doc) {
        if (err) {
          return res.status(500).json({status: "fail", msg: "error server"});
        } else if (!doc) {
          return res
            .status(404)
            .json({status: "fail", data: "can not found document"});
        }
        return res.json({status: "success", data: doc});
      });
    } catch (error) {
      return res.json({status: "success", msg: "url request invalid"});
    }
  }
  if (role === "staff") {
    try {
      StaffStation.findOne({_id: id}, function (err, doc) {
        if (err) {
          return res.status(500).json({status: "fail", msg: "error server"});
        } else if (!doc) {
          return res
            .status(404)
            .json({status: "fail", data: "can not found document"});
        }
        return res.json({status: "success", data: doc});
      });
    } catch (error) {
      return res.json({status: "success", msg: "url request invalid"});
    }
  }
};

const searchAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({msg: "Invalid input, please check your data"});
  }
  const q = req.query.q;
  const role = req.query.type;
  console.log(role, q);
  const roles = ["staff", "receptionist"];
  if (!roles.includes(role)) {
    return res.json({status: false, msg: "Role not found"});
  }
  if (role === "receptionist") {
    Receptionist.find({phoneNumber: {$regex: ".*" + q + ".*"}}, (err, doc) => {
      if (err) {
        return res.status(200).json({status: "fail", msg: "error"});
      }
      return res.json({status: "success", data: doc});
    });
  }
  if (role === "staff") {
    StaffStation.find({phoneNumber: {$regex: ".*" + q + ".*"}}, (err, doc) => {
      if (err) {
        return res.status(200).json({status: "fail", msg: "error"});
      }
      return res.json({status: "success", data: doc});
    });
  }
};

const forgetPass = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({msg: "Invalid input, please check your data"});
  }
  const user = await User.findOne({email: req.body.email});
  console.log(user);
  if (!user)
    return res.status(200).json({status: "fail", msg: "Email not found"});
  const n = crypto.randomInt(100000, 999999);
  console.log(n);
  const newpass = await bcrypt.hash(n.toString(), 12);
  // const link = `http://locahost:5000/api/v1/password-reset/${user._id}/${data.token}`
  await SendEmail(user.email, "Your new password", n);
  await User.findOneAndUpdate(
    {email: user.email},
    {password: newpass},
    {new: true}
  ).then((doc) => {
    res.json({status: true, msg: "Check your email to receive new password"});
  });
};

// thống kê số lượng xe theo từng loại xe
const getStatistic = async (req, res) => {
  let statistic = [];
  let listCategory = await Category.find({isDelete: false}).distinct("_id");
  console.log(listCategory);
  listCategory.forEach((item) => {
    countBike(item).then((d) => {
      statistic.push({name: d[0][0], number: d[1]});
      if (statistic.length == listCategory.length) {
        return res.json({status: "success", data: statistic});
      }
    });
  });
};
async function countBike(categoryID) {
  let [category, number] = await Promise.all([
    Category.findOne({_id: categoryID}).distinct("name"),
    Bike.countDocuments({category: categoryID, isDelete: false}),
  ]);
  return [category, number];
}

/**
 * chuc nang cua receptionist
 * dang nhap
 * add users, edit user, delete user, get users , activate account , get account that not activated
 * thay đổi tt cá nhân
 * @param {*} req
 * @param {*} res
 * @returns
 */
const receptionistLogin = async (req, res) => {
  if (!req.headers.authorization) {
    const {email, password} = req.body;
    console.log(email);
    let admin;
    try {
      admin = await Receptionist.findOne({email: email});
    } catch (error) {
      console.log(error);
    }
    if (!admin) {
      return res.json({status: "fail", msg: "email not found"});
    }
    let check = false;
    try {
      check = await bcrypt.compare(password, admin.password);
    } catch (err) {
      console.log(err);
    }
    if (!check) {
      return res.json({status: "fail", msg: "Password is not match!"});
    }
    const token = createJwtToken(admin._id);
    return res.json({
      status: "success",
      msg: "login successfully",
      token: token,
      data: admin,
    });
  } else {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, function (err, decodedToken) {
        if (err) {
          return res.json({status: "fail", msg: "Invalid token"});
        }
        Receptionist.findOne({_id: decodedToken.userID}, (err, doc) => {
          if (err) {
            return res.json({status: "fail", msg: "server error"});
          } else if (doc) {
            return res.json({
              status: "success",
              msg: "login successfully!",
              token: token,
              data: doc,
            });
          }
        });
      });
    }
  }
};

// getAllUser
const getAllUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({msg: "Invalid input, please check your data"});
  }
  // let sort = req.query.sortBy;
  // if(!req.query.sortBy){
  //     return res.json({status:'fail',msg:'Missing data sort'})
  // }
  // if(sort === "")
  try {
    await User.find({}, (err, doc) => {
      res.json(doc);
    }).clone();
  } catch (error) {
    console.log(error);
  }
};

// gte detail user
const getDetailUser = async (req, res) => {
  let id = req.params.id;
  if (!id) {
    return res.json({status: "fail", msg: "Id paramter missing"});
  }
  User.find({_id: id}, (err, doc) => {
    if (err) {
      return res.json({status: "fail", msg: "server error :("});
    }
    return res.json({status: "success", data: doc});
  });
};

// chỉnh sửa thông tin người dùng
const editDetailUser = async (req, res) => {
  let id = req.params.id;
  if (!id) {
    return res.json({status: "fail", msg: "UserID is missing"});
  }
  User.findOneAndUpdate({_id: id}, req.body, {new: true}, (err, doc) => {
    if (err) {
      return res.json({status: "fail", msg: "server error"});
    }
    if (!doc) {
      return res.json({status: "fail", msg: "User not found"});
    }
    return res.json({status: "success", msg: "update successfully"});
  });
};

// tìm kiếm user
const searchUser = async (req, res) => {
  let s = req.query.s;
  if (!s) {
    return res.json({status: "fail", msg: "missing query parameter"});
  }
  User.find(
    {$or: [{name: s}, {phoneNumber: s}, {email: s}, {residentID: s}]},
    (err, doc) => {
      if (err) {
        return res.json({status: "fail", msg: "server error"});
      }
      if (!doc) {
        return res.json({status: "success", msg: "Không tìm thấy người dùng"});
      }
      return res.json({status: "success", data: doc});
    }
  );
};

// xóa người dùng user
const deleteUSer = async (req, res) => {
  let id = req.params.id;
  if (!id) {
    return res.json({status: "fail", msg: "Id paramter is missing"});
  }
  User.findOneAndRemove({_id: id}, (err, doc) => {
    if (err) {
      return res.json({status: "fail", msg: "server error"});
    }
    if (!doc) {
      return res.json({status: "fail", msg: "User not found"});
    }
    return res.json({status: "success", msg: "Delete user successfully"});
  });
};

// thêm tiền cho tài khoản
const addBalanceForUser = async (req, res) => {
  let id = req.params.id;
  console.log(id);
  if (!id) {
    return res.json({status: "fail", msg: "server error"});
  }
  let user = await User.findOne({_id: id});
  console.log(user);
  if (user) {
    let payment = new Payment({
      user: user._id,
      amount: req.body.balance,
      time: Date.now(),
    });
    payment.save().then((doc) => {});
    console.log(user.balance);
    let money = parseFloat(user.balance) + parseFloat(req.body.balance);
    User.findOneAndUpdate(
      {_id: id},
      {balance: money},
      {new: true},
      (err, doc) => {
        if (err) {
          return res.json({status: "fail", msg: "server error"});
        }
        if (!doc) {
          return res.json({status: "fail", msg: "Account user is not found"});
        }
        return res.json({status: "success", msg: "Add balance successfully"});
      }
    );
  } else {
    return res.json({status: "fail", msg: "User not found"});
  }
};

// activate acc
const activate = async (req, res) => {
  let user;
  console.log(req.params);
  try {
    await User.findOneAndUpdate(
      {_id: req.params.id},
      {activate: "true"},
      {new: true},
      (err, doc) => {
        res.json({status: "success", data: doc});
      }
    );
  } catch (err) {
    console.log(err);
  }
};

// get all un activated account
const getUnactivatedAccount = async (req, res) => {
  try {
    User.find({activate: "false"}, (err, doc) => {
      res.json({status: "success", data: doc});
    });
  } catch (err) {
    console.log(err);
  }
};

const getActivatedAccount = async (req, res) => {
  try {
    User.find({activate: "true"}, (err, doc) => {
      if (err) {
        return res.json({status: "fail", msg: "server error"});
      }
      return res.json({status: "success", data: doc});
    });
  } catch (err) {
    console.log(err);
  }
};

// thay đổi tt cá nhân
const editReceptionistInfo = async (req, res) => {
  let token;
  let check = false;
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, function (err, decodedToken) {
      if (err) {
        return res.json({status: "fail", msg: "Invalid token"});
      }
      staff = Receptionist.find({_id: decodedToken.userID});
      if (staff) {
        check = true;
        id = decodedToken.userID;
      } else {
        return res.json({
          status: "fail",
          msg: "Invalid token for receptionist!",
        });
      }
    });
    if (check) {
      Receptionist.findOneAndUpdate(
        {_id: id},
        req.body,
        {new: true},
        (err, doc) => {
          if (err) {
            return res.json({status: "fail", msg: "server error"});
          }
          return res.json({status: "success", msg: "update info successfully"});
        }
      );
    }
  } else {
    return res.json({status: "fail", msg: "token required"});
  }
};

/**
 * chức năng của staff
 * -đăng nhập, thêm xe
 */
const staffLogin = async (req, res) => {
  if (!req.headers.authorization) {
    const {email, password} = req.body;
    let staff;
    try {
      staff = await StaffStation.findOne({email: email});
    } catch (error) {
      console.log(error);
    }
    if (!staff) {
      return res.json({status: "fail", msg: "email not found"});
    }
    let check = false;
    try {
      check = await bcrypt.compare(password, staff.password);
    } catch (err) {
      console.log(err);
    }
    if (!check) {
      return res.json({status: "fail", msg: "Password is not match!"});
    }
    const token = createJwtToken(staff._id);
    console.log(token);
    let station = await Station.findOne({staff: staff._id, isDelete: false});
    return res.json({
      status: "success",
      msg: "login successfully",
      token: token,
      data: staff,
      station: station,
    });
  } else {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    let staffID;
    let staff;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, function (err, decodedToken) {
        if (err) {
          return res.json({status: "fail", msg: "Invalid token"});
        }
        staff = StaffStation.findOne({_id: decodedToken.userID});
        if (staff) {
          staffID = decodedToken.userID;
          Station.findOne({staff: staffID, isDelete: false}, (err, doc) => {
            return res.json({
              status: "success",
              msg: "login successfully!",
              token: token,
              station: doc,
            });
          });
        }
        console.log(staff);
      });
    } else {
      return res.json({status: "fail", msg: "invalid token"});
    }
  }
};
const editStaffInfo = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, function (err, decodedToken) {
      if (err) {
        return res.json({status: "fail", msg: "Invalid token"});
      }
      let staff = StaffStation.findOne({_id: decodedToken.userID});
      if (!staff) {
        return res.json({status: "fail", msg: "Staff token invalid"});
      }
      StaffStation.findOneAndUpdate(
        {_id: decodedToken.userID},
        req.body,
        {new: true},
        (err, doc) => {
          if (err) {
            return res.json({status: "fail", msg: "server error"});
          }
          if (!doc) {
            return res.json({status: "fail", msg: "co gi do sai sai"});
          }
          return res.json({status: "success", msg: "Update info successfully"});
        }
      );
    });
  }
};
// thay đổi pass cho receptionist
const changePassForReceptionist = async (req, res) => {
  let check = false;
  let id;
  let staff;
  const token = req.headers.authorization.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, function (err, decodedToken) {
      if (err) {
        return res.json({status: "fail", msg: "Invalid token"});
      }
      staff = Receptionist.find({_id: decodedToken.userID});
      if (staff) {
        console.log(staff);
        check = true;
        id = decodedToken.userID;
      } else {
        return res.json({status: "fail", msg: "Staff not found!"});
      }
    });
    let comparePass = false;
    console.log(id);
    if (check) {
      let {oldPass, newPass} = req.body;
      let s;
      try {
        s = await Receptionist.findOne({_id: id});
      } catch (error) {
        console.log(error);
      }
      if (!s) {
        return res.json({status: "fail", msg: "staff not found"});
      }
      try {
        comparePass = await bcrypt.compare(oldPass, s.password);
        console.log(oldPass, s.password, comparePass);
      } catch (err) {
        console.log(err);
      }
      console.log(comparePass);
      if (!comparePass) {
        return res.json({status: "fail", msg: "Password is not match!"});
      }
      if (comparePass) {
        let hashedPassword = await bcrypt.hash(newPass, 12);
        Receptionist.findOneAndUpdate(
          {_id: id},
          {password: hashedPassword},
          {new: true},
          (err, doc) => {
            if (err)
              return res.json({status: "fail", msg: "500 server error hehe"});
            if (!doc) {
              return res.json({status: "fail", msg: "staff not found!"});
            } else {
              return res.json({
                status: "success",
                msg: "password has changed",
                data: doc,
              });
            }
          }
        );
      }
    }
  }
};

// thay đổi pass của staff
const changePassForStaff = async (req, res) => {
  let check = false;
  let id;
  let staff;
  const token = req.headers.authorization.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, function (err, decodedToken) {
      if (err) {
        return res.json({status: "fail", msg: "Invalid token"});
      }
      staff = StaffStation.find({_id: decodedToken.userID});
      if (staff) {
        console.log(staff);
        check = true;
        id = decodedToken.userID;
      } else {
        return res.json({status: "fail", msg: "Staff not found!"});
      }
    });
    let comparePass = false;
    console.log(id);
    if (check) {
      let {oldPass, newPass} = req.body;
      let s;
      try {
        s = await StaffStation.findOne({_id: id});
      } catch (error) {
        console.log(error);
      }
      if (!s) {
        return res.json({status: "fail", msg: "staff not found"});
      }
      try {
        comparePass = await bcrypt.compare(oldPass, s.password);
        console.log(oldPass, s.password, comparePass);
      } catch (err) {
        console.log(err);
      }
      console.log(comparePass);
      if (!comparePass) {
        return res.json({status: "fail", msg: "Password is not match!"});
      }
      if (comparePass) {
        let hashedPassword = await bcrypt.hash(newPass, 12);
        StaffStation.findOneAndUpdate(
          {_id: id},
          {password: hashedPassword},
          {new: true},
          (err, doc) => {
            if (err)
              return res.json({status: "fail", msg: "500 server error hehe"});
            if (!doc) {
              return res.json({status: "fail", msg: "staff not found!"});
            } else {
              return res.json({
                status: "success",
                msg: "password has changed",
                data: doc,
              });
            }
          }
        );
      }
    }
  }
};

// thay đổi pass của receptionist
const staffForgetPass = async (req, res) => {
  const staff = await StaffStation.findOne({email: req.body.email});
  if (!staff)
    return res.status(200).json({status: "fail", msg: "Email not found"});
  const n = crypto.randomInt(100000, 999999);
  console.log(n);
  const newpass = await bcrypt.hash(n.toString(), 12);
  // const link = `http://locahost:5000/api/v1/password-reset/${user._id}/${data.token}`
  await SendEmail(staff.email, "Your new password", n);
  await StaffStation.findOneAndUpdate(
    {email: staff.email},
    {password: newpass},
    {new: true}
  ).then((doc) => {
    res.json({status: true, msg: "Check your email to receive new password"});
  });
};

const receptionistForgetPass = async (req, res) => {
  const receptinst = await Receptionist.findOne({email: req.body.email});
  if (!receptinst)
    return res.status(200).json({status: "fail", msg: "Email not found"});
  const n = crypto.randomInt(100000, 999999);
  console.log(n);
  const newpass = await bcrypt.hash(n.toString(), 12);
  await SendEmail(receptinst.email, "Your new password", n);
  await Receptionist.findOneAndUpdate(
    {email: receptinst.email},
    {password: newpass},
    {new: true}
  ).then((doc) => {
    res.json({status: true, msg: "Check your email to receive new password"});
  });
};

// lấy tất cả các danh sach staff chưa quản lý bốt nào
const getListStaffNotInAStation = async (req, res) => {
  let staffs = await Station.find({isDelete: false}).distinct("staff");
  StaffStation.find({_id: {$nin: staffs}}, (err, doc) => {
    if (err) {
      return res.json({status: "fail", msg: "server error"});
    }
    if (!doc) {
      return res.json({
        status: "success",
        msg: "Tat ca cac bot deu da co nhan vien",
      });
    }
    return res.json({status: "success", data: doc});
  });
};

exports.getListStaffNotInAStation = getListStaffNotInAStation;
exports.changePass = changePass;
exports.forgetPass = forgetPass;
exports.searchAccount = searchAccount;
exports.getActivatedAccount = getActivatedAccount;
exports.staffLogin = staffLogin;
exports.editStaffInfo = editStaffInfo;
exports.changePassForStaff = changePassForStaff;
exports.receptionistForgetPass = receptionistForgetPass;
exports.staffForgetPass = staffForgetPass;
exports.register = register;
exports.login = login;
exports.addAccount = addAccount;
exports.getAccount = getAccount;
exports.getAllUser = getAllUser;
exports.adminLogin = adminLogin;
exports.editAccount = editAccount;
exports.deleteAccount = deleteAccount;
exports.receptionistLogin = receptionistLogin;
exports.activate = activate;
exports.getUnactivatedAccount = getUnactivatedAccount;
exports.getDetailAccount = getDetailAccount;
exports.getDetailUser = getDetailUser;
exports.editDetailUser = editDetailUser;
exports.addBalanceForUser = addBalanceForUser;
exports.normalUserChangePass = normalUserChangePass;
exports.editReceptionistInfo = editReceptionistInfo;
exports.searchUser = searchUser;
exports.deleteUSer = deleteUSer;
exports.changePassForReceptionist = changePassForReceptionist;
exports.getStatistic = getStatistic;
