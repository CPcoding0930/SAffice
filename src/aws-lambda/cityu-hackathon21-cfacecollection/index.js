const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const rekognition = new AWS.Rekognition({
    apiVersion: '2016-06-27',
    region: 'us-east-1'
});

exports.handler = async (event) => {

    await rekognition.createCollection({
        CollectionId: event.data.userId
    }).promise().then(data=> {
        console.log(`create collection ${event.data.userId}`)
    }).catch(error => {
        return {statCode: 400, config: false,message: "create collection error"}
    })
    
    let count = 0;
    console.log(event.data);
    for(const faceImagesData of event.data.faceImages){
        const date = new Date();
        let imageName = `${event.data.userId}/${date.getUTCFullYear()}-${("0" + date.getMonth() + 1).slice(-2)}-${("0" + date.getDate()).slice(-2)}-${date.getTime()}-${count}.jpg`;
        let buffer = Buffer.from(faceImagesData, 'base64');
        console.log(buffer);
        console.log(imageName)
        await s3.putObject({
             Body: buffer,
             Key: imageName,
             Bucket: "staffface-cityuhackathon21"
        }).promise().then(data=> {
            console.log(data);
        }).catch(error => {
             return {statCode: 400, config: false, message: "Upload data error"} 
        });
        
        await rekognition.indexFaces({
            CollectionId: event.data.userId, 
            DetectionAttributes: [], 
            ExternalImageId: event.data.userId, 
            Image:{
                S3Object: {
                Bucket: "staffface-cityuhackathon21", 
                Name: imageName
                }
            }
        }).promise().then(data=> {
            console.log(data);
        }).catch(error => {
             return {statCode: 400, config: false, message: "Index Face error"}
        });
        
    }
    
    return {
                statueCode: 200,
                config: true
            }
    
};

let deleteCollection = async (collectionId) => {
    await rekognition.deleteCollection({
        CollectionId: collectionId
    }).promise().then(data => {
        console.log(data)
    }).catch(error => {
        console.log(error);
    });
    
}
