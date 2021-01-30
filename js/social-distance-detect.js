const detectWebCam = () => {
    if (!change) {
        model.detect(webcamElement).then((predictions) => {
            console.log("detec");
            ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(webcamElement, 0, 0, canvas.width, canvas.height);
            draw_bounding_boxes(ctx, predictions);
            let canvasToBase64 = canvas.toDataURL();
            canvasToImage.src = canvasToBase64;
        });

        setTimeout(() => {
            detectWebCam();
        }, 200);
    }
}

const social_distance = (person, nextPerson) => {
    const distanceX = person.centerX - nextPerson.centerX;
    const distanceY = person.cetnerY - nextPerson.cetnerY;

    return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
}

const getCenterCoordinates = (id, x, y, width, height) => {

    return {
        id: id,
        x: parseInt(x),
        y: parseInt(y),
        width: parseInt(width),
        height: parseInt(height),
        rightTopX: parseInt(Math.round(x + width)),
        rightTopY: parseInt(y),
        rightBottomX: parseInt(Math.round(x + width)),
        rightBottomY: parseInt(Math.round(y + height)),
        leftBottomX: parseInt(x),
        leftBottomY: parseInt(Math.round(y + height)),
        centerX: parseInt(Math.round(x + width / 2)),
        cetnerY: parseInt(Math.round(y + height / 2))
    }

}

const draw_bounding_boxes = (ctx, detectedResults) => {

    let persons = [];
    let index = 0;
    for (const detected of detectedResults) {
        if (detected.class == "person") {
            let person = getCenterCoordinates(index, detected.bbox[0], detected.bbox[1], detected.bbox[2], detected.bbox[3]);
            persons.push(person);
            index++;
        }
    }

    toClose_social_distance_list = [];
    for (const person of persons) {
        for (const nextPerson of persons) {
            if (person.id != nextPerson.id) {
                const distance = social_distance(person, nextPerson);
                if (distance < 90.0) {
                    if (!(person in toClose_social_distance_list) || !(nextPerson in toClose_social_distance_list)) {
                        toClose_social_distance_list.push(person);
                        toClose_social_distance_list.push(nextPerson);
                        ctx.moveTo(person.centerX, person.cetnerY);
                        ctx.lineTo(nextPerson.centerX, nextPerson.cetnerY);
                        ctx.strokeStyle = "red";
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    }
                }
            }
        }
    }

    for (const person of persons) {
        ctx.beginPath();
        let found = false;
        for (const close_people of toClose_social_distance_list) {
            if (close_people.id == person.id)
                found = true;
        }

        if (found)
            ctx.strokeStyle = "red";
        else
            ctx.strokeStyle = "green";

        ctx.rect(person.x, person.y, person.width, person.height);
        ctx.stroke();

    }

    if (canvas.width < 900) {
        ctx.drawImage(recordingIcon, 10, 10, recordingIcon.width * 0.5, recordingIcon.height * 0.5)
        ctx.fillStyle = "red";
        ctx.font = "14px Arial";
        ctx.fillStyle = "red";
        ctx.fillText("Recording", recordingIcon.width * 0.5 + 20, recordingIcon.height * 0.5 + 10)
        ctx.font = "15px Arial";
        ctx.fillStyle = "#66F3ED";
        ctx.fillText(`People Count: ${index}`, 10, canvas.height - 10);

    } else {
        ctx.drawImage(recordingIcon, 20, 10);
        ctx.font = "25px Arial";
        ctx.fillStyle = "red";
        ctx.fillText("Recording", recordingIcon.width + 20 + 15, recordingIcon.height + 5);
        ctx.font = "30px Arial";
        ctx.fillStyle = "#66F3ED";
        ctx.fillText(`People Count: ${index}`, 10, canvas.height - 30);
    }
}


const loadModel = async () => {
    return cocoSsd.load().then(function (loadedModel) {
        return loadedModel;
    })
}

const recordingIcon = new Image();
recordingIcon.src = "icon/recording.png";