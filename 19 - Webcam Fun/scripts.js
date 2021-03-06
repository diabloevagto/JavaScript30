const video = document.querySelector('.player');
const canvases = document.querySelectorAll('.photo');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        })
        .then(localMediaStream => {
            video.src = window.URL.createObjectURL(localMediaStream);
            video.play();
        })
        .catch(err => console.error(err));
}

function paintToCanvas() {
    const [width, height] = [video.videoWidth, video.videoHeight];

    canvases.forEach(canvas => {
        canvas.width = width;
        canvas.height = height;
    });


    return setInterval(() => {
        const process = [redEffect, rgbSplit, greenScreen];
        canvases.forEach((canvas, index) => {
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, width, height);
            //take the pixels out
            let pixels = ctx.getImageData(0, 0, width, height);
            //mass with them
            pixels = process[index](pixels);
            //put them back
            ctx.putImageData(pixels, 0, 0);
        })
    }, 16);
}

function takePhoto() {
    //played the sound
    snap.currentTime = 0;
    snap.play();

    //take the data out of the canvas
    const data = canvases[0].toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="" />`;
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 100; //Red
        pixels.data[i + 1] = pixels.data[i + 1] - 50; //Green
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //Blud
    }
    return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 150] = pixels.data[i + 0] + 100; //Red
        pixels.data[i + 100] = pixels.data[i + 1] - 50; //Green
        pixels.data[i - 550] = pixels.data[i + 2] * 0.5; //Blud
    }
    return pixels;
}

function greenScreen(pixels) {
    const levels = {};

    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.value;
    });

    for (let i = 0; i < pixels.data.length; i = i + 4) {
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];

        if (red >= levels.rmin &&
            green >= levels.gmin &&
            blue >= levels.bmin &&
            red <= levels.rmax &&
            green <= levels.gmax &&
            blue <= levels.bmax) {
            // take it out!
            pixels.data[i + 3] = 0;
        }
    }
    return pixels;
}

getVideo();
video.addEventListener('canplay', paintToCanvas);
