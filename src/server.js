const express = require("express")
const app = express()
const http = require("http")
const SocketIO = require("socket.io")
const { v4: uuidV4 } = require("uuid")
const server = http.createServer(app)
const io = SocketIO(server)

app.set("view engine", "ejs")
app.set("views", __dirname + "/views")
app.use("/public", express.static(__dirname + "/public"))

app.get("/", (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room })
})

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).emit("user-connected", userId)

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId)
    })
  })
})

server.listen(3000)
