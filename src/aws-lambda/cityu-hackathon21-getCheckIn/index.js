const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();


exports.handler = async (event) => {
    const userInputUserId = event.currentIntent.slots["userID"];
    const userInputDate = event.currentIntent.slots["Date"];
    console.log(userInputUserId);
    let params;
    if(!userInputDate){
        const today = new Date();
        today.setTime(today.getTime() + today.getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000);
        params = {
            TableName: "cityu-hackathon21-Staff",
            FilterExpression: " #attr1 = :attr1Value and begins_with(#attr2, :attr2Value)",
            ExpressionAttributeNames:{
                "#attr1": "userId",
                "#attr2": "datetime"
            },
            ExpressionAttributeValues: {
                ":attr1Value": userInputUserId,
                ":attr2Value": `${today.getUTCFullYear()}-${("0" + today.getMonth() + 1).slice(-2)}-${("0" + today.getDate()).slice(-2)}`
            }
        }
    }else{
        params = {
            TableName: "cityu-hackathon21-Staff",
            FilterExpression: " #attr1 = :attr1Value and begins_with(#attr2, :attr2Value)",
            ExpressionAttributeNames:{
                "#attr1": "userId",
                "#attr2": "datetime"
            },
            ExpressionAttributeValues: {
                ":attr1Value": userInputUserId,
                ":attr2Value": userInputDate
            }
        }
        
    }
    
    return await dynamodb.scan(params).promise().then(data => {
        let result = {};
        if(data.Items.length == 0 )
            result.response = []
        else
            result.response = data.Items[data.Count - 1]
        
        return {
          "sessionAttributes": {},
          "dialogAction": {
            "type": "Close",
            "fulfillmentState": "Fulfilled",
            "message": {
              "contentType": "PlainText",
              "content": `${JSON.stringify(result)}`
            }
          }
        }
    }).catch(error => {
            console.log(error)
    })
};
