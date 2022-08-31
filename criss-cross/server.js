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
let full_rooms = [];

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
   // Error handling is too weird on client side just gonna leave that be
   // TODO:limit 2 connections per room, listen for disconnection while in room(client side)
   for (let i = 0; i < rooms.length; i++) {
      if(rooms[i].userRoom == userRoom) {
         if(rooms[i].userPass == userPass) {
            rooms[i].userName2 = userName2;
            rooms[i].socketId2 = socketId2;
            socket.join(rooms[i].userRoom);
            removeRoom(rooms[i], socket);
            data = rooms[i];

            io.to(rooms[i].socketId1).emit("start_game", data);
            io.to(rooms[i].socketId2).emit("start_game");
         }
      }
   }
}

let i = 0;

function start_game() {
   let player1 = data.socketId1
   let player2 = data.socketId2

   console.log("player1: ", player1, "player2: ", player2);

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


// GameMove and start_game I believe are the functions that for some reason don't want to work with 2nd client X.

function gameMove(player, place, socket) {
   let obj = data;
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

function removeRoom(obj, socket) {
   rooms.filter((function(el) { return obj.socketId1 != socket.id; }))
}
