const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let htmlPath = path.join(__dirname, "criss-cross-public" )

app.use(express.static(htmlPath));

app.get('/', (req, res) => {
  res.send( __dirname + '/criss-cross-public/index.html');
});

io.on('connection', (socket) => {
   console.log("user connected");
   
   socket.on("register_room", function(msg) {
      register_room(msg, socket);
   });

   socket.on("login_room", function(msg) {
      login_room(msg, socket);
   });

   socket.on("game_initialized", function() {
      start_game();
   });

   socket.on("moveO", function(msg) {
      gameMove("O", msg, socket);
   })

   socket.on("moveX", function(msg) {
      gameMove("X", msg, socket);
   })
})

server.listen(3000, "192.168.1.11", () => {
  console.log('listening on 192.168.1.11:3000');
});

// backend

// Rooms should be a array containing subarrays in which are actual room details. In each array should be stored username1 and 2, userRoom, userPass and socketId1 and 2

let rooms = [];

function register_room(msg, socket) {

   let userName1 = msg[0];
   let userRoom = msg[1];
   let userPass = msg[2];
   let socketId1 = socket.id;
   let area = ["block_0", "block_1", "block_2","block_3", "block_4", "block_5","block_6", "block_7", "block_8"];

   let data = {userName1: userName1, userRoom: userRoom, userPass: userPass, socketId1: socketId1, area: area};

   let obj = Object.assign(data);
   rooms.push(obj);

   // Joining user
   socket.join(userRoom);
}

let data = "";

function login_room(msg, socket) {
   let userName2 = msg[0];
   let userRoom = msg[1];
   let userPass = msg[2];
   let socketId2 = socket.id;

   // TODO: Error handling, limit 2 connections per room, listen for disconnection while in room(client side)
   for (let i = 0; i < rooms.length; i++) {
      if(rooms[i].userRoom == userRoom) {
         if(rooms[i].userPass == userPass) {
            rooms[i].userName2 = userName2;
            rooms[i].socketId2 = socketId2;
            socket.join(rooms[i].userRoom);
            data = rooms[i];
            io.to(rooms[i].socketId1).emit("start_game", data);
            io.to(rooms[i].socketId2).emit("start_game");
         } else {
            // error handling here, return to client event(error), in message just say room or password are wrong.
            console.log("pass wrong");
         }
      }
   }
}

let i = 0;

function start_game() {
   console.log("start_game");
   //let obj = data;
  // console.log(obj);
   let player1 = data.socketId1
   let player2 = data.socketId2
   console.log("player1: ", player1, "player2: ", player2);

   // Game logic

   if(i % 2 == 0) {
      io.to(player1).emit("turnO");
      console.log("turnO")
      return;
   } else {
      io.to(player2).emit("turnX");
      console.log("turnX");
      return;
   }
}

function gameMove(player, place, socket) {
   console.log("entry paramaters", player, place);
   let obj = data;
   // on move recieved, iniciate field in obj(append 2d array.) and check if the field is taken.
for (let i = 0; i < obj.area.length; i++) {
   if(place == obj.area[i]) {
      obj.area[i] = player;
      sendMove(player, place, socket);
      return;
   } else {
      console.log("cannot find move");
   }
}

}

function sendMove(player, place, socket) {
   let data = [player, place];
   socket.emit("moveApproved", data);
   i = i + 1;
   start_game();
}