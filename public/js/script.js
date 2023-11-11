console.log("this script tag in the head is working")


// audio speed scripts:

var audio = document.getElementById("myAudio");

function showPlaySpeed() { 
    alert(audio.playbackRate);
} 

function setFullSpeed() {
    audio.playbackRate = 1;
}

function setThreeQuartersSpeed() { 
    audio.playbackRate = 0.75;
}

function setHalfSpeed() { 
    audio.playbackRate = 0.5;
} 

function setQuarterSpeed() { 
    audio.playbackRate = 0.25;
} 
