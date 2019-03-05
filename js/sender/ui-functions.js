// this is for adding and customzing elements on the UI with Javascript 

function addPlayerUI(players) {
  con.log("player count: " + players);
  var playerCount = players;
  var parent = document.getElementById("players-container");

  var div = document.createElement("DIV");
  div.classList.add("field");
  var x = document.createElement("INPUT");
  x.classList.add("input");
  x.classList.add("is-medium");
  x.classList.add("astronaut");
  x.setAttribute("type", "text");

  var player = "p" + playerCount;
  var playerid = "player-" + playerCount;
  x.setAttribute("value", player);
  x.setAttribute("id", playerid);

  // creating the icon
  var icon = document.createElement("SPAN");
  icon.classList.add("bullet-icon");

  switch (playerCount) {
    case 1:
      var content = "url(./assets/icons/astronaut-helmet.svg)";
      break;
    case 2:
      var content = "url(./assets/icons/ufo.svg)";
      break;
    case 3:
      var content = "url(./assets/icons/start-up.svg)";
      break;
    case 4:
      var content = "url(./assets/icons/saturn.svg)";
      break;
    default:
      var content = "url(./assets/icons/outer-space-alien.svg)";
      break;
  }

  icon.style.content = content;

  div.appendChild(icon);
  div.appendChild(x);

  parent.appendChild(div);
  window.scrollBy(0, 100);

  if (playerCount == 5) {
    var ctrl = document.getElementsByClassName("add-player-control")[0];
    ctrl.classList.add("no-display");
  }
}

function initPlayerLobby() {
  // show the lobby
  var lobby = document.getElementsByClassName("player-section")[0];
  lobby.classList.remove("no-display");

  // add a player to UI
  addPlayerUI(0);
}

function initCastControls(){
    var c = document.getElementsByClassName("control-cast")[0];
    c.classList.remove("no-display");
}

function createAlert(id, message){
    var alertEl = document.getElementById(id);
    
    var div = document.createElement("DIV");
    div.classList.add("section");
    var p = document.createElement("P");
    p.innerHTML = message;

    div.appendChild(p);
    alertEl.appendChild(div);
    
}