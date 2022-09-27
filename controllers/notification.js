const { User } = require('../model/user')
const { HiringBill } = require('../model/hiringBill');
const { Station } = require('../model/station');
const { Category } = require('../model/category');
const { Bike } = require('../model/bike');
const jwt = require('jsonwebtoken');
module.exports = function (io) {
    io.sockets.on('connection', function (socket) {
        console.log(socket.rooms)
        socket.on('create', function (room) {
            console.log("socket id" + socket.id + " vao room")
            socket.join(room);
            console.log(socket.rooms)
        });

        socket.on("rent", (room, data) => {
            console.log(socket.rooms)
            console.log(data)
            console.log("rent day nhe")
            socket.to(room).emit("rent", data);
        });

        socket.on("rent_confirm", (room, data) => {
            console.log(data);
            socket.to(room).emit("rent_confirm", data);
        })

        socket.on("leave", (room) => {
            socket.leave(room);
        })

        socket.on("return", (room, data) => {
            console.log(socket.rooms)
            console.log(data)
            console.log("Oke hehe")
            socket.to(room).emit("return", data);
        });
        socket.on("return_confirm", (room, data) => {
            console.log(socket.rooms)
            socket.to(room).emit("return_confirm", data);
        });
    });
};