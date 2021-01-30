const loadModel = async () => {
    return cocoSsd.load().then((loadedModel) => {
        return loadedModel;
    })
}

let count = 0;
const faceIcon = new Image();
faceIcon.src = "icon/face_ID-512-white.png";
let face_base64 = null;
let faces = [];
let approved = false;

const detectWebCam = () => {
    //console.log(localStorage.getItem("userId"));
    if (!approved) {
        model.detect(webcamElement).then((predictions) => {
            ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(webcamElement, 0, 0, canvas.width, canvas.height);
            detected_face(ctx, predictions);
        });

        setTimeout(() => {
            detectWebCam();
        });
    }

}

const detected_face = (ctx, detectedResults) => {

    let persons = [];
    let index = 0;
    for (const detected of detectedResults) {
        if (detected.class == "person") {
            if (count < 5)
                face_base64 = canvas.toDataURL('image/jpeg').replace(/^data:.*?;base64,/, "");
            if (count == 0)
                append_face();
            ctx.drawImage(faceIcon, detected.bbox[0], detected.bbox[1], detected.bbox[2], detected.bbox[3])
        }

    }
}

const append_face = () => {
    if (count < 5) {
        if (!(face_base64 in faces)) {
            faces.push(face_base64);
            count++;
        }

        if (count == 5)
            server_handler()


        setTimeout(() => {
            append_face();
        }, Math.floor(Math.random() * 1000 + 500));

    }
    console.log(faces.length);
}

const server_handler = () => {
    let http = new XMLHttpRequest();
    const url = 'https://w65ccii120.execute-api.us-east-1.amazonaws.com/v1/reg';
    const params = {
        userId: localStorage.getItem("userId"),
        faceImages: []
    }
    faces.forEach((face) => {
        params.faceImages.push(face);
    })

    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/json');
    http.onreadystatechange = () => {//Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            jsonObj = JSON.parse(http.responseText);
            console.log(jsonObj);
            if (jsonObj.config) {
                canvas.style.display = "none";
                faceIdDesc.innerText = "Face Set Up approved.";
                approved = true;
            } else {
                faceIdDesc.innerText = "Face Setup Failed (Restarting)"
                count = 0;
            }
        }
    }
    http.send(JSON.stringify(params));
}


