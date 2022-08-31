

// Bitno


document.getElementById("request").addEventListener("click", function(){
  let element = document.getElementById("buttons");
  while(element.firstChild){
    element.removeChild(element.firstChild);
  }
  document.getElementById("room-info").style.display = "block";
});

document.getElementById("join").addEventListener("click", function(){
  let element = document.getElementById("buttons");
  while(element.firstChild){
    element.removeChild(element.firstChild);
  }
  document.getElementById("room-join").style.display = "block";
});

function gameLogic(players) {
  let elements = document.getElementsByClassName("block");

  Array.prototype.forEach.call(elements, function(el) {
      document.getElementById(el.id).addEventListener("click", function() {
        sendServer("move" + players, el.id)
      });
  });
}


// Helper functions

function startGame() {
  document.getElementById("room-info").style.display = "none";
  document.getElementById("room-join").style.display = "none";

  document.getElementById("container").style.display = "none";
  document.getElementById("container2").style.display = "flex";
}

function sendServer(type, additional) {

  const socket = io();

  socket.on("start_game", function() {
    startGame();
    socket.emit("game_initialized");
  });

  socket.on("turnO", function() {
    let player = "O";
    gameLogic(player);
  })

  socket.on("turnX", function() {
    let player = "X";
    gameLogic(player);
  })

  socket.on("error", function(msg) {
    errorHandler(msg);
  })

  if (type == "formMake") {

    document.getElementById("wait").style.display = "block";
    document.getElementById("room-info").style.display = "none";

    let userName = document.getElementById("name").value
    let userRoom = document.getElementById("room").value
    let p = document.getElementById("pass").value

    let dataSend = [userName, userRoom, p];

    socket.emit("register_room", dataSend);

  } else if (type == "formJoin") {

    document.getElementById("room-join").style.display = "none";

    let userName = document.getElementById("nameJoin").value
    let userRoom = document.getElementById("roomJoin").value
    let p = document.getElementById("passJoin").value

    let dataSend = [userName, userRoom, p];

    socket.emit("login_room", dataSend);
  } else if( type =="moveO") {
    socket.emit("moveO", additional);
  }
}

function errorHandler(error) {
  if(error == "PW1") {
    alert("Room or password values are incorrect1");
    document.getElementById("room-info").style.display = "block";
  } else if(error = "PW2") {
    alert("Room or password values are incorrect2");
    document.getElementById("room-info").style.display = "block";
  }
}
