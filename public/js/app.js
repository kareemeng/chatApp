const socket = io.connect("http://localhost:3000");
// grab elements 
const chatForm = document.querySelector("#chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.querySelector("#room-name");
const usersInRoom = document.querySelector("#users");


//get prams by using Qs library
const { handle, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit("joinRoom", { handle, room });

socket.on("inRoom",(room_info)=>{
    //console.log(room_info.name,room_info.inRoom);
    //display room name
    printRoom(room_info.name);
    //display the user in the room currently
    printUsers(room_info.inRoom);
});

socket.on("message", (message) => {
  console.log(message); //log message
  printMessage(message); //print message object
  // scroll to bottom of message window
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  //get message from the input field
  const messageText = event.target.message.value;
  //send the message to the server
  socket.emit("chatMessage", messageText);
  //clear the input field
  event.target.message.value = "";
  // focus the input field after the message has been sent
  event.target.message.focus();
});

//output message to users GUI
function printMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
    <p class="meta">${message.handle} <span>${message.time}</span></p>

    <p class="text">
        ${message.messageText}
    </p>
    `;
  chatMessages.appendChild(div);
};
function printRoom(room) {
roomName.textContent = room;
}
function printUsers(users) {
   usersInRoom.innerHTML = users
     .map((user) => `<li>${user.handle}</li>`)
     .join("");
}
