"use strict";

var canvas = document.getElementById("game-canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var ctx = canvas.getContext("2d");

// for the stars
var stars = [];
var fps = 50;
var numStars = 2000;

// for the pins
var pin = document.getElementById("pin");
var pins;
var laneDimensions = {
  x1: canvas.width / 3,
  x2: canvas.width - canvas.width / 3
};

// for the ball position
var ballPos;

initGameCanvas();

function initGameCanvas() {
  console.log("init gameCanvas");

  // rather than redraw it
  canvas.style.background = "black";

  // this just creates stars
  initStars();

  // place pins at reset position
  initPins();

  // sets the game loop for redrawing the canvas
  setInterval(animate, 1000 / fps);

  //init ball position
  ballPos = {x: canvas.width/2, y: canvas.height/2}

  setTimeout(function() {
    deletePin(3);
    console.log('timeout');
    moveBall({x:canvas.width/2, y:canvas.height/3}, 3);
  }, 3000);
}

// draws the lane for bowling
function drawLane() {
  // Create gradient shadow on top of lane
  var grd = ctx.createLinearGradient(
    canvas.width / 2,
    canvas.height,
    canvas.width / 2,
    0
  );
  grd.addColorStop(0, "#985e22");
  grd.addColorStop(0.8, "black");

  // draw lane
  var points = [
    { x: 0, y: canvas.height },
    { x: canvas.width / 3, y: canvas.height / 3 },
    { x: canvas.width - canvas.width / 3, y: canvas.height / 3 },
    { x: canvas.width, y: canvas.height }
  ];
  drawPolygon(points, grd);
}

// draws a polygon of color color with the points given
// points like ({x: 2, y:20}, {x:20, y:1})
function drawPolygon(points, color) {
  if (points.length > 2) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (var item = 1; item < points.length; item++) {
      ctx.lineTo(points[item].x, points[item].y);
    }
    ctx.closePath();
    ctx.fill();
  }

  ctx.moveTo(points[0].x, points[0].y);
}

// creats a star object
function Star(x, y, length, opacity) {
  this.x = parseInt(x);
  this.y = parseInt(y);
  this.length = parseInt(length);
  this.opacity = opacity;
  this.factor = 1;
  this.increment = Math.random() * 0.04;
}

Star.prototype.draw = function() {
  ctx.rotate((Math.PI * 1) / 10);

  // Save the ctx
  ctx.save();

  // move into the middle of the canvas, just to make room
  ctx.translate(this.x, this.y);

  // Change the opacity
  if (this.opacity > 1) {
    this.factor = -1;
  } else if (this.opacity <= 0) {
    this.factor = 1;

    this.x = Math.round(Math.random() * canvas.width);
    this.y = Math.round(Math.random() * canvas.height);
  }

  this.opacity += this.increment * this.factor;

  ctx.beginPath();
  for (var i = 5; i--; ) {
    ctx.lineTo(0, this.length);
    ctx.translate(0, this.length);
    ctx.rotate((Math.PI * 2) / 10);
    ctx.lineTo(0, -this.length);
    ctx.translate(0, -this.length);
    ctx.rotate(-((Math.PI * 6) / 10));
  }
  ctx.lineTo(0, this.length);
  ctx.closePath();
  ctx.fillStyle = "rgba(255, 255, 200, " + this.opacity + ")";
  ctx.shadowBlur = 5;
  ctx.shadowColor = "#ffff33";
  ctx.fill();

  ctx.restore();
};

// Create all the stars
function initStars() {
  for (var i = 0; i < numStars; i++) {
    var x = Math.round(Math.random() * canvas.width);
    var y = Math.round(Math.random() * canvas.height);
    var length = 1 + Math.random() * 2;
    var opacity = Math.random();

    // Create a new star and draw
    var star = new Star(x, y, length, opacity);

    // Add the the stars array
    stars.push(star);
  }
}

function drawPin(width, x, y) {
  ctx.drawImage(pin, x - width / 2, y, width, width * 2);
}

// hehe we have to draw them from back to front so they are the right order
function drawPins() {
  var scale = 6;
  for (var i = pins.length - 1; i >= 0; i--) {
    if (pins[i].standing) {
      if (i < 6) {
        scale = 5;
      }
      if (i < 3) {
        scale = 4;
      }
      if (i < 1) {
        scale = 3;
      }

      drawPin(canvas.width / (5 * scale), pins[i].x, pins[i].y);
    }
  }
}

function initPins() {
  var inc = (laneDimensions.x2 - laneDimensions.x1) / 7;
  var incY = inc / 3;
  pins = [
    { standing: true, x: canvas.width / 2, y: canvas.height / 3 },
    { standing: true, x: canvas.width / 2 - inc, y: canvas.height / 3 - incY },
    { standing: true, x: canvas.width / 2 + inc, y: canvas.height / 3 - incY },
    {
      standing: true,
      x: canvas.width / 2 - inc * 2,
      y: canvas.height / 3 - incY * 2
    },
    { standing: true, x: canvas.width / 2, y: canvas.height / 3 - incY * 2 },
    {
      standing: true,
      x: canvas.width / 2 + inc * 2,
      y: canvas.height / 3 - incY * 2
    },
    {
      standing: true,
      x: canvas.width / 2 - inc * 3,
      y: canvas.height / 3 - incY * 3
    },
    {
      standing: true,
      x: canvas.width / 2 - inc,
      y: canvas.height / 3 - incY * 3
    },
    {
      standing: true,
      x: canvas.width / 2 + inc,
      y: canvas.height / 3 - incY * 3
    },
    {
      standing: true,
      x: canvas.width / 2 + inc * 3,
      y: canvas.height / 3 - incY * 3
    }
  ];
}

function deletePin(pinNum) {
  pins[pinNum].standing = false;
}

function drawBall(position) {
  if(position) {
    ctx.beginPath();
    ctx.arc(position.x, position.y, 50, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();

    ballPos = position;
  }
  else {
    ctx.beginPath();
    ctx.arc(ballPos.x, ballPos.y, 50, 0, 2 * Math.PI);
    ctx.fillStyle = "green";
    ctx.fill();
  }

}

function moveBall(endLoc, speed){
  console.log('here');
  while(ballPos.y != endLoc.y){
    ballPos.y --;
  }
}

/**
 * Animation Loop for all items to be drawn
 */
function animate() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw the stars
  for (var star = 0; star < stars.length; star++) {
    stars[star].draw(ctx);
  }

  // draw the lane, pins and ball
  drawLane();
  drawPins();
  drawBall();
}
