"use strict";
var socket = io();
var global = window;
var doc = global.document;
var con = global.console;
var chr = global.chrome;

//state controls to pass to the gameplay engine
var playerCount = 1;

function stopPlaying() {
  gameplayMode(10);
}

function addPlayer() {
  playerCount++;
  addPlayerUI(playerCount);
}

window.onload = function() {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    con.log("mobile");
    initPlayerLobby();
    initCastControls();
  } else {
    con.log("Not a mobile device! Game will only work on a mobile, sorry");
    createAlert(
      "alert-message",
      "Sorry! Looks like you need a mobile device to play the game!"
    );
  }
};

function submitPlayers() {
  // gets player names from the input
  var playernames = document.getElementsByClassName("player-ipt");
  var players = [];

  // adds to an array to pass to the server
  for (var i = 0; i < playernames.length; i++) {
    players.push({ name: playernames[i].value, score: 0 });
  }

  initializeGame(players);
  socket.emit('playerInitSuccess', players)
}
