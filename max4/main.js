// 720 x 1280

let WIDTH = 720;
let HEIGHT = 1280;

const STATE_START = 0;
const STATE_RINGING = 1;
const STATE_PLAYING = 2;
let currState = STATE_START;

const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');

WIDTH = canvas.clientWidth;
HEIGHT = canvas.clientHeight;

const aspect = 720 / 1280;

let ringtone;
let firstFrame;

const videoEl = document.getElementById('video');

function init() {

    ringtone = new Howl({
        src: ['ringtone.mp3']
      });

    firstFrame = new Image();
    firstFrame.onload = () => {
        // ctx.drawImage(firstFrame, 0, 0 );
    };
    firstFrame.src = 'firstFrame.png';

    // render();

}

function render() {

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    // ctx.drawImage(firstFrame, 0, 0 );

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(WIDTH,HEIGHT);
    ctx.stroke();

    requestAnimationFrame(render);
}


init();

document.addEventListener('mousedown', () => {

    if (currState === STATE_START) {
        document.getElementById('click-indicator').style.display = 'none';

        setTimeout(() => {
            ringtone.play();
            currState = STATE_RINGING;
        }, 5000)
    };

    if (currState === STATE_RINGING) {
        canvas.style.display = 'none';
        document.getElementById('callscreen').style.display = 'none';
        ringtone.stop();
        currState = STATE_PLAYING;
        videoEl.play();
    };

    if (currState === STATE_PLAYING) {
        videoEl.play();
        // currState = STATE_START;
    }

});