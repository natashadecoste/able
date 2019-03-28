"use strict";

var global = window;
var doc = global.document;
var con = global.console;
var chr = global.chrome;
var applicationID = "39FBD2DE";
var namespace = "urn:x-cast:com.bus";
var session = null;
var apiConfig;
var dom = {
  message: doc.getElementById("message")
};

///////////////////////////////////////////////////////////////////////////////////////////////
// SENDER should only be responsible for handing the casting session and messaging between   //
// sender and receiver                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////

//state controls to pass to the gameplay engine
var playerCount = 1;

function sessionListener(e) {
  con.log("New session ID:" + e.sessionId);
  session = e;
  session.addUpdateListener(sessionUpdateListener);
  session.addMessageListener(namespace, function (ns, message) {

    con.log('message from receiver : ' + message);
    createAlert("alert-message", message.message);


  });
}

function receiverListener(e) {
  if (e === "available") {
    con.log("receiver found");
  } else {
    con.log("receiver list empty");
  }
}

function onInitSuccess(e) {
  con.log("init success");
}

function onSessionSuccess() {
  var playersArr = getPlayers();
  // init the game settings/button controls
  initializeGame(playersArr);

}

function onError(e) {
  con.log("init error: " + e);
}

function initializeCastApi() {
  var sessionRequest = new chr.cast.SessionRequest(applicationID);
  apiConfig = new chr.cast.ApiConfig(
    sessionRequest,
    sessionListener,
    receiverListener
  );
}

function startSession() {
  try {
    chr.cast.initialize(apiConfig, onInitSuccess, onError);

    var castContext = cast.framework.CastContext.getInstance();
    //var castContext = new cast.framework.CastContext();
    castContext.setOptions({
      receiverApplicationId: "39FBD2DE"
    });
    castContext.requestSession(onSessionSuccess, onError);

    onSessionSuccess();
  }
  catch (err){
    console.log("error: " + err);
  }

}

function sendMessage(message) {
  var castSession = cast.framework.CastContext.getInstance().getCurrentSession();
  castSession.sendMessage(namespace, { message: message });

  //now we also want to change the turn
  changeTurn();
}

function stopCasting() {
  try {
    var castSession = cast.framework.CastContext.getInstance().getCurrentSession();
    castSession.endSession(true);
  
    gameplayMode(10);



  }  catch (err){
    console.log("error: " + err);
  }

  location.reload();
 
}
function addPlayer(){
  playerCount++;
  addPlayerUI(playerCount);
}
window.onload = function() {
  window["__onGCastApiAvailable"] = function(isAvailable) {
    if (isAvailable) {
      initializeCastApi();
    }
  };
  if ( true ) {
  //   /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    con.log("mobile");
    initPlayerLobby();
    initCastControls();

  } else {
    con.log("Not a mobile device! Game will only work on a mobile, sorry");
    createAlert("alert-message", "Sorry! You need a mobile device to play the game!");
  }
};

function getPlayers(){
  var form = document.getElementById('players-container');
  var n  = form.childElementCount;
  var playersNames = [];

  for(var i = 0; i< n; i++){
    playersNames.push({name: form.children[i].children[1].value, score: 0})
  }

  return playersNames;
}