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

//state controls
var playerCount = 0;



function sessionListener(e) {
  con.log('here');
  con.log("New session ID:" + e.sessionId);
  session = e;
  // session.addUpdateListener(sessionUpdateListener);
  // session.addMessageListener(namespace, receiverMessage);
}

function receiverListener(e) {
  if (e === "available") {
    con.log("receiver found");
  } else {
    con.log("receiver list empty");
  }
}

function onInitSuccess(e){
  con.log("init success");

}

function onError(e){
  con.log("init error");
  con.log(e);
}

function initializeCastApi() {
  var sessionRequest = new chr.cast.SessionRequest(applicationID);
    apiConfig = new chr.cast.ApiConfig(
      sessionRequest,
      sessionListener,
      receiverListener
    );
}

function startSession(){
  chr.cast.initialize(apiConfig, onInitSuccess, onError);

  var castContext = cast.framework.CastContext.getInstance();
  castContext.setOptions({
          receiverApplicationId: '39FBD2DE'
  });
  castContext.requestSession( onInitSuccess, onError);
  
}

function sendMessage(message) {
  var castSession = cast.framework.CastContext.getInstance().getCurrentSession();
  castSession.sendMessage(namespace,{"message": message});

}

function stopCasting() {
  var castSession = cast.framework.CastContext.getInstance().getCurrentSession();
  castSession.endSession(true);
}


window.onload = function() {
//   debugger;
//   window["__onGCastApiAvailable"] = function(isAvailable) {
    
//     if (isAvailable) {
      
      initializeCastApi();
      addPlayer();
      
//     }
//   }
}

// ChromeCast.boot(function(loaded, errorInfo):Void
// {
//   trace('ChromeCast: version=${ChromeCast.VERSION}');
//   trace('ChromeCast: loaded=$loaded, errorInfo=$errorInfo');
// });

function addPlayer() {
  console.log("player count: " + playerCount);
  playerCount++;
  var parent = document.getElementById("players-container");

  var div = document.createElement("DIV");
  div.classList.add("field");
  var x = document.createElement("INPUT");
  x.classList.add("input");
  x.classList.add("is-medium");
  x.classList.add("astronaut");
  x.setAttribute("type", "text");

  var player = "p"+playerCount;
  var playerid = "player-"+playerCount;
  x.setAttribute("value", player);
  x.setAttribute("id", playerid);

  // creating the icon
  var icon = document.createElement("SPAN");
  icon.classList.add("astro-icon");
  var content = "url(./assets/icons/astronaut-helmet.svg)"
  icon.style.content = content;
  


  div.appendChild(icon);
  div.appendChild(x);

  parent.appendChild(div);
  window.scrollBy(0, 100);

  if(playerCount == 5){
    var ctrl = document.getElementsByClassName("add-player-control")[0];
    ctrl.classList.add("no-display");
  }

}