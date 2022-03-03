const http = require("http")
const express = require("express")
const app = express()
const { Server } = require("socket.io")
const server = http.createServer(app)

const { instrument } = require("@socket.io/admin-ui")

const io = new Server(server, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
})

instrument(io, {
  auth: false,
})
app.set("view engine", "pug")
app.set("views", __dirname + "/views")

app.use("/public", express.static(__dirname + "/public"))

app.get("/", (req, res) => {
  res.render("home")
})
app.get("/*", (req, res) => res.redirect("/"))

// 데이타 베이스에 연결했을때 방이름을 알아내기위해서 사용

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = io
  const publicRooms = []
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key)
    }
  })
  return publicRooms
}

function countRoom(roomName) {
  io.sockets.adapter.rooms.get(roomName)?.size
}

io.on("connection", (socket) => {
  socket["nickname"] = "Anon"
  socket.onAny((event) => {
    console.log(`Socket Event : ${event}`)
  })
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName)
    done(countRoom(roomName))
    socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName))
    io.sockets.emit("room_change", publicRooms())
  })
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1)
    )
  })
  socket.on("disconnect", () => {
    io.sockets.emit("room_change", publicRooms())
  })
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`)
    done()
  })
  socket.on("nickname", (nickname) => (socket["nickname"] = nickname))
})
const handleListen = () => console.log(`Listening on http://localhost:3000`)
server.listen(3000, handleListen)
