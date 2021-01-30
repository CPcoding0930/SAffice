const detectWebCam = () => {

    console.log("loading finish");
    detect(webcamElement).then((results) => {
        console.log(results);
        console.log(webcamElement.width + " " + webcamElement.height);
        ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(webcamElement, 0, 0, canvas.width, canvas.height);

        console.log(results);
        for (bboxInfo of results) {
            bbox = bboxInfo[0];
            classID = bboxInfo[1];
            score = bboxInfo[2];

            ctx.beginPath();
            ctx.lineWidth = "3";
            if (classID == 1) {
                ctx.strokeStyle = "red";
                ctx.fillStyle = "red";
                
                if(recordDateTime == null){
                    recordDateTime = new Date();
                    sendSysMessage(`Please wear your mask`);
                }else{
                    nowDateTime = new Date();
                    seconds = nowDateTime.getTime()/1000 - recordDateTime.getTime()/ 1000
                    
                    if( seconds >= 10 && !reportedLevel.levelThree){
                        sendSysMessage("Reported to Manager");
                        reportedLevel.levelThree = true;
                        reportedLevel.count++;
                    }else if ( seconds >= 6 && !reportedLevel.levelTwo){
                        sendSysMessage("Please wear your mask or you will be PENALIZED for HKD10 /second.");
                        reportedLevel.levelTwo = true;
                    }else if ( seconds > 2 && seconds < 6 && !reportedLevel.levelOne){
                        sendSysMessage(`Please wear your mask, ${localStorage.getItem("userId")}`);
                        reportedLevel.levelOne = true;
                    }
                }
            } else {
                ctx.strokeStyle = "green";
                ctx.fillStyle = "green";
                reportedLevel.levelOne = false;
                reportedLevel.levelTwo = false;
                reportedLevel.levelThree = false;
                recordDateTime = null;
            }

            console.log(reportedLevel);

            ctx.rect(bbox[0], bbox[1], bbox[2] - bbox[0], bbox[3] - bbox[1]);
            ctx.stroke();

            ctx.font = "15px Arial";
            const content = (classID == 1) ? `without_mask ${score}` : `with_mask  ${score}`
            ctx.fillText(content, bbox[0], bbox[1] < 20 ? bbox[1] + 30 : bbox[1] - 5);
        }
    })

    const canvasToBase64 = canvas.toDataURL();
    canvasToImage.src = canvasToBase64;

    setTimeout(() => {
        detectWebCam();
    });
}

const loadModel = async () => {
    console.log("load model")
    model = await tf.loadLayersModel('model/model.json');
    return model;
}

let recordDateTime = null;

const reportedLevel = {
    levelOne: false,
    levelTwo: false,
    levelThree: false,
    count: 0
};
