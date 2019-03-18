"use strict";
var body = document.body;
var players = 0;
var turn = null;

function initializeGame(playerCount){
    players = playerCount;
    turn = 1; // lets not count from 0 for it is too annoying!
    console.log("starting game, there are " + players + " players");
    gameplayMode(0);

}
// changes the turn to the param input
function changeTurn(newTurn){
    turn = newTurn;
    console.log('it is turn:  ' +  turn);
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
          
            
            y = document.getElementsByClassName("bowling-controls")[0];
            y.classList.add("no-display"); // remove bowling ball

            // set gameplay on body
            body.classList.remove('gameplay--on');
            break;
    }
}