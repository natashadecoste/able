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
  //context.addCustomMessageListener(namespace, showMessage);
  context.start();

  castReceiverManager = cast.receiver.CastReceiverManager.getInstance();

  if (messageBus) {
    messageBus = castReceiverManager.getCastMessageBus(
      namespace,
      cast.receiver.CastMessageBus.MessageType.JSON
    );

    messageBus.onMessage = function(event) {
      var sender = event.senderId;
      var message = event.data;

      showMessage(message);
      messageBus.send(sender, { message: "123" });
    };
  }
}

function showMessage(e) {
  dom.message.innerHTML = e.data.message;
  //rollBall();
}

function rollBall() {
  setTimeout(function() {
    moveWithRotate();
    setTimeout(resetPins(), 1300);
  }, 0);
}

global.onload = init;
dom.message.style.opacity = 0.5;
