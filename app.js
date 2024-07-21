const express = require("express")
const app = express()
const path = require("path")
const http = require("http")
const socketio = require("socket.io")
const { log } = require("console")
const server = http.createServer(app)
const io = socketio(server)

app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")))

let username = []
let userid = []

io.on("connection", function (socket) {
    socket.on("username", function (name) {
        username.push(name)
        userid.push(socket.id)
        socket.emit("user-set",name)
        io.emit("user-connect", username.length)
    })
    socket.on("disconnect", function () {
        if(userid.indexOf(socket.id) !== -1){
            username.splice(userid.indexOf(socket.id),1)
            userid.splice(userid.indexOf(socket.id),1)

            io.emit("user-disconnect",  username.length)
        }
    })
    socket.on("send-message", function (data) {
        if (userid.indexOf(socket.id) !== -1) {
            let name = username[userid.indexOf(socket.id)]
            console.log(name,data);
            io.emit("reseve-message", { name,id:socket.id, ...data })
        }

    })
    socket.on("user-typing",function(){
        if(userid.indexOf(socket.id) !== -1){
            let name = username[userid.indexOf(socket.id)]
            socket.broadcast.emit("typing",name)
        }
    })
})

app.get("/", function (req, res) {
    res.render("index")
})

server.listen(3000)



