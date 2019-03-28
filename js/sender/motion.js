"use strict";
var audioContext = new AudioContext();
//var game_text = null;
var measurement = null;
var gauge = null;
var acl, gyro = null;
var speedCalculator = null;
var quotes = ["Punch not detected", "Great punch!", "Roll with the punches!"];
var xspeed, ygyro;


// Calculates the *first* velocity peak about X axis, or exiting on timeout.

//function getSpeed(linearAccel, onresult, onpunchdetected, timeout){
function getSpeed(acl){
  var vx = 0;
  var vy = 0;
  var vz = 0;

  var ax = acl.x;
  var ay = acl.y;
  var az = acl.z;

  var maxSpeed = 0;

  var t = acl.timestamp;
  var times = 0;

  // timeoutId = 0;
  // timeout = (timeout == null) ? 5000 : timeout;

  function onreading() {
    
    // console.log("acl.x " + acl.x);
    // console.log("acl.y " + acl.y);
    // console.log("acl.z " + acl.z);
    //console.log("acl.timestamp: " + acl.timestamp);
    var dt = (acl.timestamp - t) * 0.001; // In seconds.
    // console.log("dt: " + dt);
    // console.log("ax: " + ax);
    // console.log("acl.x: " + acl.x);
    vx = vx + (acl.x + ax) / 2 * dt;
    // console.log("vx: " + vx);
    var speed = Math.abs(vx);
    var kmPerHourCoef = 3.6;
    //return Math.round(this.maxSpeed * kmPerHourCoef);
    var ret = Math.round(speed * kmPerHourCoef);

    console.log("The speed on X-axis is: " + ret);
    ax = acl.x;
    t = acl.timestamp;
    acl.removeEventListener('reading', this.onreading);
    acl.removeEventListener('error', this.onerror);
  }

  // function result() {
  //   const kmPerHourCoef = 3.6;
  //   return Math.round(this.maxSpeed * kmPerHourCoef);
  // }
  acl.addEventListener('reading', onreading);
  
  // acl.addEventListener('error', onerror);
  //var timeoutId = setTimeout(ontimeout, timeout);

}

function motion(){

  // function onreading(){
  //   console.log("acl.x " + acl.x);
  //   console.log("acl.y " + acl.y);
  //   console.log("acl.z " + acl.z);
  // }

  var maxxa = 0;

  function getMax(){
    console.log("THE MAX AX IS: " + maxxa);
    return maxxa;
  }

  function setToInitialState() {
    var shaking = false;
  
    function onreading() {
      // ---ThePhoneisStill/SmallOrNoMovement----stillTreshold(1)----
      // ---nothingHappens/KeepShaking------shakeTreashold(3)--------
      // ---shakingPhone/getMaxac
      var shakeTreashold = 15
      //var shakeTreashold = 15;
      var stillTreashold = 1;
      var magnitude = Math.hypot(acl.x, acl.y, acl.z);
      // console.log("acl.x in Set: " + acl.x)
      // console.log("acl.y in Set: " + acl.y)
      // console.log("acl.z in Set: " + acl.z)

  
      if (magnitude > shakeTreashold) {
        shaking = true;
        console.log("A shake has been detected!");
        // console.log("Magnitude is " + magnitude);
        // console.log("acl.x in Set: " + acl.x)
        maxxa = (maxxa < Math.abs(acl.x)) ? Math.abs(acl.x) : maxxa;
      } else if (magnitude < stillTreashold && shaking) {
        shaking = false;
        // acl.removeEventListener('reading', onreading);
        // console.log("Second Block");
        acl.removeEventListener('reading', onreading);
        acl.removeEventListener('error', onerror);
        acl.addEventListener('reading', onreading);
        
      
        // setGameText("Punch now!");
        //speedCalculator.start();
      } 
    }
  
    acl.addEventListener('reading', onreading);
    
    //getSpeed(acl);
  }

  function onerror(e) {
    console.log("Cannot fetch data from sensor due to an error.");
  }

  acl = new LinearAccelerationSensor({frequency: 60});
  gyro = new Gyroscope({frequency: 60});

  acl.addEventListener('activate', setToInitialState);
  acl.addEventListener('error', onerror);
  acl.start();

  gyro.start();
  var s;

  setTimeout(function(){
      s = getMax();
  }, 1000);

  setTimeout(function(){
    console.log("motion.js: The speed is: " + s + " m/s");
    console.log("motion.js: acl.y : " + acl.y);
    console.log("motion.js: gyro.y : " + gyro.y);
  }, 1500);
  

}
