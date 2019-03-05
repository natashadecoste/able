var body = document.body;

function gameplayMode(state) {

    switch(state){
        case 0:
            // state 0 is init

            // change button actions for gameplay
            var y = document.getElementById("cast-stop");
            y.classList.remove("no-display"); // add in stop button
        
            y = document.getElementsByClassName("bowling-controls")[0];
            y.classList.remove("no-display"); // add back in bowling ball

            // set gameplay on body

            body.classList.add('gameplay--on');

            break; 
        case 10: 

        console.log('state 10');
            // this state is to stop casting session 
            var y = document.getElementById("cast-stop");
            y.classList.add("no-display"); // remove back in stop button
          
            
            y = document.getElementsByClassName("bowling-controls")[0];
            y.classList.add("no-display"); // remove bowling ball

            // set gameplay on body
            body.classList.remove('gameplay--on');
            break;
    }
}