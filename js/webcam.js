const setupWebcam = () => {
    return new Promise((resolve, reject) => {
        const navigatorAny = navigator;
        navigator.getUserMedia = navigator.getUserMedia ||
            navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
            navigatorAny.msGetUserMedia;;
        if (navigator.getUserMedia) {
            navigator.getUserMedia({
                video: true
            },
                (stream) => {
                    const {width, height} = stream.getTracks()[0].getSettings();
                    console.log(width, height)
                    resizeCanvas(width, height);
                    console.log(stream);
                    webcamElement.width = width;
                    webcamElement.height = height;
                    webcamElement.srcObject = stream;
                    console.log(stream);
                    webcamElement.addEventListener('loadeddata', () => resolve(), false);
                },
                (err) => console.log(err));
        } else {
            reject("Webcam failed");
        }
    });
}

const resizeCanvas = (width, height) => {
    canvas.width = width;
    canvas.height = height;
}

const resizeVideo = (width, height) => {
    webcam.width = width;
    webcam.height = height;
}