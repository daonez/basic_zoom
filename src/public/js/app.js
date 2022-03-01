const messageList = document.querySelector("ul")
const messageForm = document.querySelector("form")
const socket = new WebSocket(`ws://${window.location.host}`)

socket.addEventListener("open", () => {
  console.log("connected to Browser 😁")
})

socket.addEventListener("message", (message) => {
  console.log("message is:", message.data)
})

socket.addEventListener("close", () => {
  console.log("closed server 👾")
})

function handleSubmit(event) {
  event.preventDefault()
  const input = messageForm.querySelector("input")
  socket.send(input.value)
  console.log(input.value)
  input.value = ""
}
messageForm.addEventListener("submit", handleSubmit)
