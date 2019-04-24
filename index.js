var express = require("express");
var app = express();

var http = require('http').createServer(app);
var io = require('socket.io')(http);



// GAME STATE AND STUFF
var gameState = {
    init: false
}


app.use('/public', express.static(__dirname + '/public'));

app.get('/view', function(req, res){
    console.log("the view has connected");
    // if someone connects from within alley
    res.sendFile(__dirname + '/view' +'/index.html');
});

app.get('/styles/generated.css', function(req, res){
    res.sendFile(__dirname + '/styles' +'/generated.css');
});


app.get('/controller', function(req, res){
    console.log("a human has connected");
    // if someone connects from within alley?
    res.sendFile(__dirname + '/controller' +'/index.html');
});

io.on('connection', function(socket){
    console.log('new socket connection');

    // what to do on disconnect (refresh game state)
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('playerInitSuccess', function(players){
        console.log("init game");
        console.log(players);
        gameState.init = true;
        gameState.players = players;
        gameState.currentPlayer = 0;
    });

    socket.on('getMeasurements', function(sensorData){
        console.log("Read measurements from sensors");
        console.log(sensorData)
        console.log("Now sending sensor data to view...");
        socket.broadcast.emit('getMovement', sensorData);
    });

    socket.on('gameOver', function(){

        console.log('game is over');
    });

    socket.on("sendScore", function(score) {
        console.log("Get score from view: " + score);
        gameState.players[gameState.currentPlayer].score += score;
        console.log(gameState);
        socket.broadcast.emit('turnChange', score);

    })

    socket.on("newplayerstate", function(gameStateRecv){
        if( gameState.currentPlayer != gameStateRecv) {
            socket.broadcast.emit('totalScore', gameState.players[gameState.currentPlayer].score)
        }

        gameState.currentPlayer = gameStateRecv;
    })
});




http.listen(3000, function(){
  console.log('listening on *:3000');
});

