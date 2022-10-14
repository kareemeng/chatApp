import express from "express";
import dotenv from "dotenv";
import path from "path";
import { Socket, Server } from "socket.io";
import { formatMessage, Message } from "./utils/message";
import {
  User,
  joinUser,
  getCurrentUser,
  disconnectUser,
  usersInRoom,
} from "./utils/user";
dotenv.config();

const app = express();

const port: number = 3000 || (process.env.PORT as unknown as number);

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

//static files
app.use(express.static("public"));

// socket setup
let io = new Server(server);
const botName: string = process.env.botName as string;

io.on("connection", (socket: Socket) => {
  //console.log(`Connected to socket : ${socket.id}`);
  /*
    socket.on("ChatMessage",(room:string,data:object)=>{
        
        if(room === "")
        {
            io.sockets.emit("ChatMessage", data);// console.log("all");
        }
        else{
            io.to(room).emit("ChatMessage", data);// console.log("room",room);
        }
    });
    socket.on("typing",(handle:string,room:string)=>{
        if(room === "")
        {
            socket.broadcast.emit("typing", handle);//console.log("all");
        }
        else{
            socket.broadcast.to(room).emit("typing", handle);//console.log("room",room);
        }
    })
    socket.on("joinRoom",(room:string,handle:string,display:Function)=>{
       console.log(`${handle} joined ${room}`);
        socket.join(room);
        display(`you joined ${room}`);  
        socket.broadcast.to(room).emit("joined",room,handle);
    })*/
  //on jointing the chat room
  socket.on("joinRoom", (user: User) => {
    // console.log(user)
    joinUser({ handle: user.handle, room: user.room, id: socket.id });
    socket.join(user.room);
    //welcoming new users
    socket.emit("message", formatMessage(botName, "Welcome to the NinjaChat!"));
    // Broadcast when new user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.handle} has joined the chat`)
      );
    //users in the room
    io.to(user.room).emit("inRoom", {
      name: user.room,
      inRoom: usersInRoom(user.room),
    });
  });
  // send a message to the users
  socket.on("chatMessage", (message) => {
    // console.log(formatMessage(message.handle, message.messageText));
    let user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.handle, message));
  });
  // alert the users that an user has disconnected
  socket.on("disconnect", () => {
    let user = disconnectUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.handle} has left the Chat Room`)
      );

      //users in the room
      io.to(user.room).emit("inRoom", {
        name: user.room,
        inRoom: usersInRoom(user.room),
      });
    }
  });
});
