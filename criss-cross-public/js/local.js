
const elements = document.getElementsByClassName("block");
let i = 0;

// For each el. in the elements array returned by DOM, add a click event listener, and after clicked checks if the clicked square is taken by a O or a X if not increments I

Array.from(elements).forEach(function(element) {
    element.addEventListener('click', function() {
            if ( i % 2 == 0 ) {
                if (document.getElementById(element.id).innerHTML == "") {
                    addMove("O", element);
                    checkTie();
                    checkWin();
                    i = i + 1
                }
            } else {
                if (document.getElementById(element.id).innerHTML == "") {
                    addMove("X", element);
                    checkTie();
                    checkWin();
                    i = i + 1
                }
            }
    });
});

function checkWin () {
    checkWinRow();
    checkWinDiagonal();
    checkWinColumn();
}

function checkWinRow() {
    let box0 = document.getElementById("block_0").innerHTML
    let box1 = document.getElementById("block_1").innerHTML
    let box2 = document.getElementById("block_2").innerHTML
    let box3 = document.getElementById("block_3").innerHTML
    let box4 = document.getElementById("block_4").innerHTML
    let box5 = document.getElementById("block_5").innerHTML
    let box6 = document.getElementById("block_6").innerHTML
    let box7 = document.getElementById("block_7").innerHTML
    let box8 = document.getElementById("block_8").innerHTML

    let row1 = [box0, box1, box2];
    let row2 = [box3, box4, box5];
    let row3 = [box6, box7, box8];

    let winForO = ["O", "O", "O"];
    let winForX = ["X", "X", "X"];

        // Using JSON.Stringify method, I'm able to compare the row's array value with the array for winning either O or X, if a win is found it's passed to winnerAnnoucement function.

        // Row1 checking
        if (JSON.stringify(row1) === JSON.stringify(winForO)) {
            console.log("win for O on first");
            winnerAnnoucement("O", "row-1");
        } else if (JSON.stringify(row1) === JSON.stringify(winForX)) {
            console.log("win for X on first");
            winnerAnnoucement("X", "row-1");
        }

        // Row2 checking
        if (JSON.stringify(row2) === JSON.stringify(winForO)) {
            console.log("win for O on second");
            winnerAnnoucement("O", "row-2");
        } else if (JSON.stringify(row2) === JSON.stringify(winForX)) {
            console.log("win for X on second");
            winnerAnnoucement("O", "row-2");
        }

        // Row3 checking
        if (JSON.stringify(row3) === JSON.stringify(winForO)) {
            console.log("win for O on third");
            winnerAnnoucement("O", "row-3");
        } else if (JSON.stringify(row3) === JSON.stringify(winForX)) {
            console.log("win for X on third");
            winnerAnnoucement("X", "row-3");
        }
}

function checkWinDiagonal() {
    let box0 = document.getElementById("block_0").innerHTML
    let box2 = document.getElementById("block_2").innerHTML
    let box4 = document.getElementById("block_4").innerHTML
    let box6 = document.getElementById("block_6").innerHTML
    let box8 = document.getElementById("block_8").innerHTML

    let diag1 = [box0, box4, box8];
    let diag2 = [box2, box4, box6];

    let winForO = ["O", "O", "O"];
    let winForX = ["X", "X", "X"];

    if (JSON.stringify(diag1) === JSON.stringify(winForO)) {
        winnerAnnoucement("O", "diag-1");
    } else if (JSON.stringify(diag1) === JSON.stringify(winForX)) {
        winnerAnnoucement("X", "diag-1");
    }

    if (JSON.stringify(diag2) === JSON.stringify(winForO)) {
        winnerAnnoucement("O", "diag-2");
    } else if (JSON.stringify(diag2) === JSON.stringify(winForX)) {
        winnerAnnoucement("X", "diag-2");
    }
}

function checkWinColumn() {
    let box0 = document.getElementById("block_0").innerHTML
    let box1 = document.getElementById("block_1").innerHTML
    let box2 = document.getElementById("block_2").innerHTML
    let box3 = document.getElementById("block_3").innerHTML
    let box4 = document.getElementById("block_4").innerHTML
    let box5 = document.getElementById("block_5").innerHTML
    let box6 = document.getElementById("block_6").innerHTML
    let box7 = document.getElementById("block_7").innerHTML
    let box8 = document.getElementById("block_8").innerHTML

    let coloumn1 = [box0, box3, box6];
    let coloumn2 = [box1, box4, box7];
    let coloumn3 = [box2,  box5, box8];

    let winForO = ["O", "O", "O"];
    let winForX = ["X", "X", "X"];

    if (JSON.stringify(coloumn1) === JSON.stringify(winForO)) {
        console.log("win for O on first");
        winnerAnnoucement("O", "coloumn-1");
    } else if (JSON.stringify(coloumn1) === JSON.stringify(winForX)) {
        console.log("win for X on first");
        winnerAnnoucement("X", "coloumn-1");
    }

    if (JSON.stringify(coloumn2) === JSON.stringify(winForO)) {
        console.log("win for O on second");
        winnerAnnoucement("O", "coloumn-2");
    } else if (JSON.stringify(coloumn2) === JSON.stringify(winForX)) {
        console.log("win for X on second");
        winnerAnnoucement("O", "coloumn-2");
    }

    if (JSON.stringify(coloumn3) === JSON.stringify(winForO)) {
        console.log("win for O on third");
        winnerAnnoucement("O", "coloumn-3");
    } else if (JSON.stringify(coloumn3) === JSON.stringify(winForX)) {
        console.log("win for X on third");
        winnerAnnoucement("X", "coloumn-3");
    }

}


// Helping functions
function addMove(player, element) {
    document.getElementById(element.id).innerHTML = player
    element.classList += " occupied " + player;
}

function checkTie() {
    if(document.getElementsByClassName("block occupied O").length + document.getElementsByClassName("block occupied X").length == 9) {
        document.getElementById("pobjednik").innerText = "It's a tie!";
        document.getElementById("pobjednik").style.color = "#FF7F7F";
    }
}


function resetPlayingArea() {
    document.getElementById("pobjednik").innerText = "";
    document.getElementById("pobjednik").style.color = "green";
    for (let i = 0; i < elements.length; i++) {
        document.getElementById("block_" + i).innerHTML = ""
    }

    Array.from(elements).forEach(function(element) {
        element.classList = "block"
        element.style = ""
    });

    console.clear();
}

function winnerAnnoucement(winner, winnerArea) {
    document.getElementById("pobjednik").innerText = "The winner is: " + winner;

    Array.from(elements).forEach(function(element) {
        element.classList += " occupied"
    });

    if(winnerArea == "row-1") {
        for (let i = 0; i < 3; i++) {
            document.getElementById("block_" + i).style.background = "#90ee90"; 
        }
    } else if (winnerArea == "row-2") {
        for (let i = 3; i < 6; i++) {
            document.getElementById("block_" + i).style.background = "#90ee90"; 
        }
    } else if (winnerArea == "row-3") {
        for (let i = 6; i < 9; i++) {
            document.getElementById("block_" + i).style.background = "#90ee90"; 
        }
    } else if (winnerArea == "diag-1") {
        let array = ["0", "4", "8"];
        Array.from(array).forEach(function(element) {
            document.getElementById("block_" + element).style.background = "#90ee90";
        });
    } else if (winnerArea == "diag-2") {
        let array = ["2", "4", "6"];
        Array.from(array).forEach(function(element) {
            document.getElementById("block_" + element).style.background = "#90ee90";
        });
    } else if (winnerArea == "coloumn-1") {
        let array = ["0", "3", "6"];
        Array.from(array).forEach(function(element) {
            document.getElementById("block_" + element).style.background = "#90ee90";
        });
    } else if (winnerArea == "coloumn-2") {
        let array = ["1", "4", "7"];
        Array.from(array).forEach(function(element) {
            document.getElementById("block_" + element).style.background = "#90ee90";
        });
    } else if(winnerArea == "coloumn-3") {
        let array = ["2", "5", "8"];
        Array.from(array).forEach(function(element) {
            document.getElementById("block_" + element).style.background = "#90ee90";
        });
    }
}