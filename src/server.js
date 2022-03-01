const http = require("http")
const express = require("express")
const app = express()
const WebSocket = require("ws")

app.set("view engine", "pug")
app.set("views", __dirname + "/views")

app.use("/public", express.static(__dirname + "/public"))

app.get("/", (req, res) => {
  res.render("home")
})
app.get("/*", (req, res) => res.redirect("/"))
const handleListen = () => console.log(`Listening on http://localhost:3000`)
console.log("hello")
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

const handleConnection = (socket) => {
  console.log(socket)
}

wss.on("connection", handleConnection)

server.listen(3000, handleListen)
