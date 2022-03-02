const http = require("http")
const express = require("express")
const app = express()
const SocketIO = require("socket.io")
const server = http.createServer(app)
const io = SocketIO(server)

app.set("view engine", "pug")
app.set("views", __dirname + "/views")

app.use("/public", express.static(__dirname + "/public"))

app.get("/", (req, res) => {
  res.render("home")
})
app.get("/*", (req, res) => res.redirect("/"))

io.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event : ${event}`)
  })
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName)
    done()
    socket.to(roomName).emit("welcome")
  })
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye"))
  })
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", msg)
    done()
  })
})
const handleListen = () => console.log(`Listening on http://localhost:3000`)
server.listen(3000, handleListen)
