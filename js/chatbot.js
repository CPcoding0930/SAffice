const btnSubmit = document.getElementsByClassName("submit")[0];
const chatroom = document.getElementById("chat-container");

btnSubmit.addEventListener("click", async () => {
    const userInput = document.getElementById("message").value;
    console.log(userInput);
    const chatRow = document.createElement("div");
    chatRow.className = "rowchats";
    const chatSysCol = document.createElement("div");
    chatSysCol.className = "chats column sys"
    const chatConvCol = document.createElement("div");
    chatConvCol.className = "chats column conv";
    const chatUserSb2 = document.createElement("div");
    chatUserSb2.innerText = userInput;
    chatUserSb2.className = "box user sb2"
    const chatUserCol = document.createElement("div");
    chatUserCol.className = "chats column user";
    const userProfileImage = document.createElement("img");
    userProfileImage.src = "img/profilepic.png";
    userProfileImage.className = "userimg";
    chatUserCol.appendChild(userProfileImage);
    chatConvCol.appendChild(chatUserSb2);
    chatRow.appendChild(chatSysCol);
    chatRow.appendChild(chatConvCol);
    chatRow.appendChild(chatUserCol);
    chatroom.appendChild(chatRow);
    sendMessage(userInput);
    document.getElementById("message").value = "";
});


const sendMessage = async (message) => {

    let http = new XMLHttpRequest();
    const url = 'https://w65ccii120.execute-api.us-east-1.amazonaws.com/v1/chat';
    const params = {
        userId: localStorage.getItem("userId"),
        message: message
    }

    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/json');
    http.onreadystatechange = () => {
        if (http.readyState == 4 && http.status == 200) {
            jsonObj = JSON.parse(http.responseText);
            if (Array.isArray(jsonObj.response)) {
                console.log(jsonObj.response)
                let table = "<table><tr><th>UserID</th><th>DateTime</th></tr>";
                for (const record of jsonObj.response) {
                    console.log(record);
                    table += `<tr><td>${record.userId}</td><td>${record.datetime}</td></tr>`
                }
                table += "</table>";

                sendSysMessage(table);
                return;
            }else if(jsonObj.response.userId != null){
                sendSysMessage(`${jsonObj.response.userId} ${jsonObj.response.datetime}`);
                return;
            }
            console.log(jsonObj);
            sendSysMessage(jsonObj.response);
        }
    }

    http.send(JSON.stringify(params));
}

const sendSysMessage = (response) => {
    const sysChatRow = document.createElement("div");
    sysChatRow.className = "rowchats";
    const sysChatSysCol = document.createElement("div");
    sysChatSysCol.className = "chats column sys";
    const sysProfileImage = document.createElement("img");
    sysProfileImage.className = "systemimg";
    sysProfileImage.src = "img/system.png";
    sysChatSysCol.appendChild(sysProfileImage);

    const sysChatConvCol = document.createElement("div");
    sysChatConvCol.className = "chats column conv";
    const sysChatSysSb1 = document.createElement("div");
    sysChatSysSb1.innerHTML = response;
    sysChatSysSb1.className = "box sys sb1";
    sysChatConvCol.appendChild(sysChatSysSb1);

    const sysChatUserCol = document.createElement("div");
    sysChatUserCol.className = "chats column user";

    sysChatRow.appendChild(sysChatSysCol);
    sysChatRow.appendChild(sysChatConvCol);
    sysChatRow.appendChild(sysChatUserCol);
    chatroom.append(sysChatRow);
}