"use strict";

var global = window;
var castReceiverManager;
var messageBus;
var doc = global.document;
var namespace = "urn:x-cast:com.bus";
var dom = {
  message: doc.getElementById("message")
};
var context, player;


function init() {
  context = cast.framework.CastReceiverContext.getInstance();
  context.addCustomMessageListener(namespace, showMessage);
  context.start();
}

function showMessage(e){
  dom.message.innerHTML = e.data.message; 
  //moveWithRotate();
  setTimeout(function(){
    moveWithRotate();
    setTimeout(resetPins(), 1300);
  }, 0 );


  //dom.message.innerHTML += p;

}

global.onload = init;
dom.message.style.opacity = 0.5;