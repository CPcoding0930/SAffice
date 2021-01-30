const sessionChecking = () => {
    if (localStorage.getItem("userId") == null) {
        window.location.replace("login.html");
    } else {

       /* let http = new XMLHttpRequest();
        const url = 'https://w65ccii120.execute-api.us-east-1.amazonaws.com/v1/session';
        const params = {
            userId: document.getElementById("username").value,
            session: localStorage.getItem("sessionAttr");
        };
        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/json');
        http.onreadystatechange = () => {
            if (http.readyState == 4 && http.status == 200) {
                jsonObj = JSON.parse(http.responseText);
                if (jsonObj.vaild) {

                }
            }
        }

        http.send(JSON.stringify(params));


        */
    }

}