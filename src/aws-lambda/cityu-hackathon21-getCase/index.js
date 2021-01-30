const axios = require("axios");

exports.handler = async (event) => {

    const today = new Date();
    today.setTime(today.getTime() + today.getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000)
    const url = 'https://api.data.gov.hk/v2/filter?q=%7B%22resource%22%3A%22http%3A%2F%2Fwww.chp.gov.hk%2Ffiles%2Fmisc%2Flatest_situation_of_reported_cases_covid_19_eng.csv%22%2C%22section%22%3A1%2C%22format%22%3A%22json%22%2C%22filters%22%3A%5B%5B1%2C%22eq%22%2C%5B%22' + ("0" + today.getDate()).slice(-2) + '%2F' + ("0" + (today.getMonth() + 1)).slice(-2) + '%2F' + today.getFullYear() + '%22%5D%5D%5D%7D';
    try {
        const response = await axios.get(url);
        const data = response.data;
        let confirmed = 0;
        let probable = 0;
        data.forEach(objCase => {
            (objCase["Confirmed/probable"] === "Confirmed") ? confirmed++ : probable++;
        });

        let result = `${today.getUTCFullYear()}-${("0" + today.getMonth() + 1).slice(-2)}-${("0" + today.getDate()).slice(-2)}, Confiremd: ${confirmed}, Probable: ${probable}`;
        const checkDateTime = new Date(today.getFullYear, today.getMonth(), today.getDate(), 8, 00, 00); //Coordinated Universal Time
        checkDateTime.setTime(today.getTime() + today.getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000);
        console.log(checkDateTime.toString())
        console.log(today.toString());

        if(confirmed == 0 && probable == 0 && (today.toString() <= checkDateTime.toString() || checkDateTime.toString() > today.toString() ))
            result += (today.toTimeString() < checkDateTime.toTimeString() || checkDateTime.toString() > today.toString())? " [Not yet accurate]" : "";

        return {
            "sessionAttributes": {},
            "dialogAction": {
                "type": "Close",
                "fulfillmentState": "Fulfilled",
                "message": {
                    "contentType": "PlainText",
                    "content": JSON.stringify({response: result})
                }
            }
        }

    } catch (error) {
        console.log(error)
    }
}