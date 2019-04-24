
"use strict";
var socket = io();

var body = document.body;
var players = [];
var frames = 1; // each player bowls this many "frames" or times usually it is 10
var turn = 0; // each player has 2 turns each frame
var currentPlayer;


var loadingModal;
var loadingModalText;

function initializeGame(playerData){
    players = playerData;
    turn = 0; // lets not count from 0 for it is too annoying!
    currentPlayer = 0;
    console.log('turn = ' + turn);
    console.log("starting game, there are " + playerData.length + " players");


    

    // this changes the view to start the game (bowling ball on mobile)
    gameplayMode(0);


    // sets the current turn
    setTurnDisplay(turn);
    setScoreDisplay(players[currentPlayer].score)
    setPlayerDisplayName(players[currentPlayer].name);

    loadingModal = document.getElementById('modals-container');
    loadingModalText = document.getElementById('modaltext');
}

// changes the turn to the param input
function changeTurn(newTurn){
    if(newTurn){
        turn = newTurn;
    }
    else {
        turn++;
    }
    if(turn >= 2){
        turn = 0;
        changePlayer(++currentPlayer);
    }
    console.log('it is turn:  ' +  turn);
    // we also want to change it on the UI so we need to write a func in ui-functions
    setTurnDisplay(turn);


    changeModalText('bowling...');
    resetPinsModal();
    console.log('the current is ' + currentPlayer)

    socket.emit('newplayerstate', currentPlayer)
}

function changePlayer(playerindex){
        if(playerindex >= players.length){
            currentPlayer = 0;
            frames--;
        }
        if(frames > 0){
                setPlayerDisplayName(players[currentPlayer].name);
    
        }
        else {
            gameplayMode(10);
            socket.broadcast.emit('gameOver');
        }
}

function gameplayMode(state) {
    switch(state){
        case 0:
            // state 0 is init
            // set gameplay on body
            document.body.classList.add('gameplay--on');
            break; 
        case 10: 
        console.log('state 10');
            // this state is to stop casting session 
            var y = document.getElementById("cast-stop");
            y.classList.add("no-display"); // remove stop button
          
            
            y = document.getElementsByClassName("gameplay-controls")[0];
            y.classList.add("no-display"); // remove bowling ball

            // set gameplay on body
            document.body.classList.remove('gameplay--on');
            break;
    }
}

function updateScore(addedpoints){
    console.log('we should be updating score here');
    // need to add the points for the currentPlayer score, keep that in the players object
    
    // we need to show the score card and update the active frame
    console.log('need to show score on the receiver and waiting message on the sender');

    // we also need to reset the ball / pins / let user know we are resetting a
}

// socket.on('sendScoreBacktoGameplay', function(score){
//     con.log("Score received in gamePlay: " + score)
//     // TODO, update the score on the controller 
//   });

socket.on('turnChange', function(score){
    changeTurn();
    setScoreDisplay(score);
});