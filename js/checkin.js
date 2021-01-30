
const faceIcon = new Image();
faceIcon.src = "icon/face_ID-512-white.png";

const detectWebCam = () => {

    model.detect(webcamElement).then((predictions) => {
        ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(webcamElement, 0, 0, canvas.width, canvas.height);
        let foundPerson = false;
        for(const detected of predictions){
            if(detected.class == "person"){
                checkInStatus.innerText = "System detected the face, please wait";
                if(!foundPerson)
                    foundPerson = true;
                const faceBase64 = canvas.toDataURL('image/jpeg').replace(/^data:.*?;base64,/, "");

                ctx.drawImage(faceIcon, detected.bbox[0], detected.bbox[1], detected.bbox[2], detected.bbox[3]);
                server_checkin(faceBase64);
            }
        }

        if(!foundPerson){
            setTimeout(() => {
                detectWebCam();
            });
        }

    });

}

const server_checkin = (userImageBase64) => {
    let http = new XMLHttpRequest();
    const url = 'https://w65ccii120.execute-api.us-east-1.amazonaws.com/v1/faceid';
    const params = {
        userId: localStorage.getItem("userId"),
        faceImage: userImageBase64
    }

    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/json');
    http.onreadystatechange = () => {//Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            jsonObj = JSON.parse(http.responseText);
            console.log(jsonObj);
            if (jsonObj.vaild) {
                checkInStatus.style.color = "springgreen";
                checkInStatus.innerText = `Check in successfully at ${jsonObj.date}`;
                document.getElementsByClassName('checkin-selection')[0].style.display = "flex";
            } else {
                checkInStatus.style.color = "red";
                checkInStatus.innerText = `System checkin failed, face detect restarting`;
                detectWebCam();
            }
        }
    }
    http.send(JSON.stringify(params));

}


const loadModel = async () => {
    return cocoSsd.load().then(function (loadedModel) {
        return loadedModel;
    })
}
