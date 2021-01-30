const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();


exports.handler = async (event) => {
    
    const today = new Date();
    today.setTime(today.getTime() + today.getTimezoneOffset() * 60 * 1000  +  8 * 60 * 60 * 1000);
    const params = {
        TableName: "cityu-hackathon21-Staff",
        FilterExpression: "begins_with(#attr1, :attr1Value)",
        ExpressionAttributeNames:{
            "#attr1": "datetime"
        },
        ExpressionAttributeValues: {
            ":attr1Value": `${today.getUTCFullYear()}-${("0" + today.getMonth() + 1).slice(-2)}-${("0" + today.getDate()).slice(-2)}`
        }
    }
    
    let rebuildedItems = [];
    return await dynamodb.scan(params).promise().then(data => {
        let count = 0;
        for(const record of data.Items){
            if(count == 0){
                rebuildedItems.push(record);
                count++;
            }else{
                let found = false;
                for(const userRecord of rebuildedItems){
                    if(userRecord.userId == record.userId){
                        userRecord.userId = record.userId;
                        userRecord.datetime = record.datetime;
                        found = true;
                        break;
                    }
                }
                if(!found)
                    rebuildedItems.push(record);
            }
        }
        //console.log(rebuildedItems);
        
        return {
          "sessionAttributes": {},
          "dialogAction": {
            "type": "Close",
            "fulfillmentState": "Fulfilled",
            "message": {
              "contentType": "PlainText",
              "content": JSON.stringify({response: rebuildedItems})
            }
          }
        }
    }).catch(error => {
        console.log(params);
        console.error("Unable to query. Error:", JSON.stringify(error, null, 2));
    })

    
};
