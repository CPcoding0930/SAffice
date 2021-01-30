const AWS = require("aws-sdk");
AWS.config.apiVersions = {
  lexruntime: '2016-11-28'
};

const lex = new AWS.LexRuntime();

exports.handler = async (event) => {
    
    console.log(event);
    if(!event.data.userId || !event.data.message){
        return {
            statusCode: 400,
            message: "missing required attribute"
        }
    }
    
    const session = await getLexSesssion(event.data.userId);
    
    const params = {
        botAlias: '$LATEST', 
        botName: 'cityuHackAthonChatbot',
        userId: event.data.userId,
        inputText: event.data.message
    }
    
    return await lex.postText(params).promise().then(data => {
        console.log(data);
        const response = JSON.parse(data.message).response;
        if((Array.isArray(response) && event.data.userId != "0001") || (event.data.userId != "0001" && response.userId != null && response.userId != event.data.userId)){
            return {
                statusCode: 400,
                response: "permission error"
            }
        }
        
        return {
            statusCode: 200,
            response: response
        }
    }).catch(error => {
        console.log(error);
        return {
            statusCode: 400,
            message: "lex post message error"
        }
    })
    
};

const getLexSesssion = async (userId) => {
    
    const params = {
      botAlias: '$LATEST', 
      botName: 'cityuHackAthonChatbot',
      userId: userId
    };
    
    return await lex.getSession(params).promise().then(data => {
        return data;
    }).catch(error => {
        console.log(error);
        return putLexSession(userId, params);
    })
    
}

const putLexSession = async (userId, params) => {
    
    return await lex.putSession(params).promise().then(data => {
        return data;
    }).catch(error => {
        console.log(error)
        return {
            statusCode: 400,
            message: "Lex error"
        }
    });
    
}
