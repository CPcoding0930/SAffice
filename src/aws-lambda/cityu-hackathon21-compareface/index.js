const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB();

const rekognition = new AWS.Rekognition({
    apiVersion: '2016-06-27',
    region: 'us-east-1'
});


exports.handler = async (event) => {
    
    if(event.data.faceImage && event.data.userId){
    
        const date = new Date();
        date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000  +  8 * 60 * 60 * 1000);
        const imageName = `${event.data.userId}/${date.getUTCFullYear()}-${("0" + date.getMonth() + 1).slice(-2)}-${("0" + date.getDate()).slice(-2)}-${date.getTime()}-0.jpg`;
        const buffer = Buffer.from(event.data.faceImage, 'base64');
        await s3.putObject({
             Body: buffer,
             Key: imageName,
             Bucket: "staffface-cityuhackathon21"
        }).promise().then(data=> {
            console.log(`uploaded: ${imageName}`)
        }).catch(error => {
            return {statCode: 400, message: "Upload data error"} 
        });
        
        let faceDetected = await rekognition.searchFacesByImage({
            CollectionId: event.data.userId, 
            FaceMatchThreshold: 80, 
            Image: {
                S3Object: {
                    Bucket: "staffface-cityuhackathon21", 
                    Name: imageName
                }
            }, 
            MaxFaces: 1
        }).promise().then(data=> {
            return data
        }).catch(error => {
            return {statueCode: 400, message: "upload failded"}
        })
        
        if(faceDetected.FaceMatches.length < 1 || faceDetected.FaceMatches[0].Similarity <= 80){
            await s3.deleteObject({
                Bucket: "staffface-cityuhackathon21", 
                Key: imageName
            }).promise().then(data=> {
                console.log(`deleted: ${imageName}`)
            })
            return {statueCode: 200, vaild: false}
            
        }else if(faceDetected.FaceMatches[0].Similarity > 80){
            return await dynamodb.putItem({
                Item:{
                    "userId": {
                        S: event.data.userId
                    },
                    "datetime": {
                        S: `${date.getUTCFullYear()}-${("0" + date.getMonth() + 1).slice(-2)}-${("0" + date.getDate()).slice(-2)} ${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}`
                    }
                },
                ReturnConsumedCapacity: "NONE", 
                TableName: "cityu-hackathon21-Staff"
            }).promise().then(data => {
                return {
                    statueCode: 200, 
                    date: `${date.getUTCFullYear()}-${("0" + date.getMonth() + 1).slice(-2)}-${("0" + date.getDate()).slice(-2)} ${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}`,
                    vaild: true};
            }).catch(error => {
                return {statueCode: 400, message: error}
            })
        }
        
    
    }else{
        return {statueCode: 400, message: "please send the image and userId"}
    }
    
};
