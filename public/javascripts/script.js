const socket = io()  // io() function emit a connection event
const messageinput = document.querySelector(".messageinput")
const messageContainer = document.querySelector(".messageContainer")
const namepage = document.querySelector(".namepage")
const nameinput = document.querySelector(".nameinput")
const setname = document.querySelector(".setname")
const username = document.querySelector(".username")

//setting username
setname.addEventListener("click", function () {
    if (nameinput.value.trim().length > 0) {
        socket.emit("username", nameinput.value.trim())
    }
})
socket.on("user-set",function(name){
    namepage.style.display = "none"
    username.textContent = name
})
nameinput.addEventListener("input", function () {
    if (nameinput.value.trim().length > 0) {
        let newval = nameinput.value.replace(" ", "_")
        nameinput.value = newval
    }
    else {
        nameinput.value = ""
    }
})

//sending message to backend
 //by send button
document.querySelector(".sendbtn").addEventListener("click", function () {
    if (messageinput.value.trim().length > 0) {
        let date = new Date()
        let time = `${date.getHours()}:${date.getMinutes()}${date.getHours() > 11 ? "PM" : "AM"}`
        socket.emit("send-message", { message: messageinput.value.replace(/\n/g, "<br>"), time })
        messageinput.value = ""
    }
})
 //by pressing enter
messageinput.addEventListener("keypress", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault()
        if (messageinput.value.trim().length > 0) {
            let date = new Date()
            let time = `${date.getHours()}:${date.getMinutes()}${date.getHours() > 11 ? "PM" : "AM"}`
            socket.emit("send-message", { message: messageinput.value.replace(/\n/g, "<br>"), time })
            messageinput.value = ""
        }
    }
})

messageinput.addEventListener("input",function(){
    socket.emit("user-typing")
})

//listing message from backend
socket.on("reseve-message", function (data) {
    let {name, id, message, time } = data
    var checkIfUser = id === socket.id ? true:false
    messageContainer.innerHTML += `<div class="message flex ${checkIfUser ?`justify-end`:`justify-start`} mb-2">
                   <div>
                    <h4 class="text-[10px] text-zinc-600 text-left">${name}</h4>
                    <div class="chat ${checkIfUser? `bg-zinc-200/10`:`bg-gradient-to-r from-violet-500 to-fuchsia-500`} text-white p-2 px-3 rounded-md ${checkIfUser?`rounded-tr-[0]`:`rounded-tl-[0]`}">
                     <h4 class="text-md leading-none">${message}</h4>
                    <h5 class="text-left text-[10px] text-white/90">${time}</h5>
                    </div>
                   </div>
                 </div> `
           messageContainer.scrollTop = messageContainer.scrollHeight      
})

socket.on("user-connect",function(count){
    document.querySelector(".live").textContent = count
})
socket.on("user-disconnect",function(count){
    document.querySelector(".live").textContent = count
})
var timer;
socket.on("typing",function(name){
    document.querySelector(".usertyping").innerHTML = `<em>${name} is typing...<em>`
    clearTimeout(timer)
    timer = setTimeout(function(){
    document.querySelector(".usertyping").innerHTML = ``
    },1200)
})