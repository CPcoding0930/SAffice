const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition({
    apiVersion: '2016-06-27',
    region: 'us-east-1'
});

exports.handler = async (event) => {
    
    if(event.collectionId){
        return await rekognition.listFaces({
            CollectionId: event.collectionId
        }).promise().then(data => {
            return data;
        }).catch(error => {
            return {statCode: 400, message: "Not match collection"};
        })
    }else{
        return await rekognition.listCollections({}).promise().then(data=>{
            return data;
        }).catch(error => {
            return {statCode: 400, message: "Get collection error"};
        })
    }

};
