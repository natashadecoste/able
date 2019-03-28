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
  // init the game settings/button controls
  initializeGame(playerCount);

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
  // console.log("Button Play clicked");
  // setTimeout(motion,1000);

  // Uncomment the 2 lines above to test motion() (print max speed and acl.y to console)
  // Uncomment the below section for proper Chromecasting

  chr.cast.initialize(apiConfig, onInitSuccess, onError);

  var castContext = cast.framework.CastContext.getInstance();
  // var castContext = new cast.framework.CastContext();
  castContext.setOptions({
    receiverApplicationId: "39FBD2DE"
  });
  castContext.requestSession(onSessionSuccess, onError);

  onSessionSuccess();
  // lets just start gameplay mode FOR NOW

}

function sendMessage(message) {
  var castSession = cast.framework.CastContext.getInstance().getCurrentSession();
  castSession.sendMessage(namespace, { message: message }); 
}

function stopCasting() {
  var castSession = cast.framework.CastContext.getInstance().getCurrentSession();
  castSession.endSession(true);

  gameplayMode(10);
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
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    con.log("mobile");
    initPlayerLobby();
    initCastControls();

  } else {
    con.log("Not a mobile device! Game will only work on a mobile, sorry");
    createAlert("alert-message", "Sorry! Looks like you need a mobile device to play the game!");
  }
};
