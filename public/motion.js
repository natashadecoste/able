"use strict";
var xspeed, yacc = 0;
var acl, gyro = null;

// Calculates the *first* velocity peak about X axis, or exiting on timeout.

function getMeasurements(){
  var res = {xspeed: xspeed, yacc: yacc%10}
  return res;
}

function motion(){
  var maxva = 0;
  var ayMin = 0;
  var ayMax = 0;

  function getMax(){
    console.log("THE MAX X speed IS: " + maxva);
    return maxva;
  }

  function getYAcc(){
    var ret = (Math.abs(ayMin)> Math.abs(ayMax)) ? ayMin : ayMax;
    console.log("THE MAX Y acc IS: " + ret);
    if (ret > 10){
      return 10;
    }
    else if (ret < -10){
      return -10;
    }
    else {
      return ret;
    }
  }


  function getYDir(){

    function onreading() {
      ayMin = (gyro.y < ayMin) ? gyro.y : ayMin;
      ayMax = (gyro.y > ayMax) ? gyro.y : ayMax;
    }

    gyro.addEventListener('reading', onreading);
  }

  function setToInitialState() {
    var shaking = false;
    var t = 0;
    var ax = 0;
    var vx = 0;

    // console.log("setToInitialState has been executed ")
    function calcSpeed(){
      var dt = (acl.timestamp - t) * 0.001;
      t = acl.timestamp;
      vx = Math.abs(vx + dt * (ax + acl.x)/2);
      vx = vx%30;
      if (dt < 40){
        // console.log("dt is: ", dt);
        // console.log("vx is: ", vx);
        maxva = (maxva < vx) ? vx : maxva;
      }
    }

    function onreading() {
      // ---ThePhoneisStill/SmallOrNoMovement----stillTreshold(1)----
      // ---nothingHappens/KeepShaking------shakeTreashold(3)--------
      // ---shakingPhone/getMaxac
      var shakeTreashold = 11
      //var shakeTreashold = 15;
      var stillTreashold = 1;
      var magnitude = Math.hypot(acl.x, acl.y, acl.z);
      // console.log("acl.x in Set: " + acl.x)
      // console.log("acl.y in Set: " + acl.y)
      // console.log("acl.z in Set: " + acl.z)
      var shaking = magnitude > shakeTreashold;

      if (shaking) {
        // console.log("A shake has been detected!");
        magnitude = Math.hypot(acl.x, acl.y, acl.z);
        // console.log("mag ", magnitude);
        calcSpeed();
      }
      else{
        acl.removeEventListener('reading', onreading);
        t = 0;
        ax = 0;
        vx = 0;
        acl.addEventListener('reading', onreading);
      }
    }
    acl.addEventListener('reading', onreading);
  }



  function onerror(e) {
    console.log("Cannot fetch data from sensor due to an error.");
  }

  acl = new LinearAccelerationSensor({frequency: 60});
  gyro = new Gyroscope({frequency: 60});

  acl.addEventListener('activate', setToInitialState);
  acl.addEventListener('error', onerror);
  acl.start();

  gyro.addEventListener('activate', getYDir);
  gyro.start();

  setTimeout(function(){
    xspeed = getMax();
    yacc = getYAcc();
  }, 2000);

  // setTimeout(function(){
  //   console.log("motion.js: The speed is: " + xspeed + " m/s");
  //   console.log("motion.js: The y acc is: " + yacc%10);
  // }, 1500);
}
