currentRoom = ""
showFriends()

function menu_options_appear(){
    let status = document.getElementById("menu_status").value;
    if (status == "hidden"){
        document.getElementById("menu_options").style.opacity = "100%";
        document.getElementById("menu_status").value = "visible";
        document.getElementById("friends").style.cursor = "pointer";
        document.getElementById("report").style.cursor = "pointer";
        document.getElementById("account").style.cursor = "pointer";
        document.getElementById("menu").style.opacity = "30%";
    } else{
        document.getElementById("menu_options").style.opacity = "0%";
        document.getElementById("menu_status").value = "hidden"
        document.getElementById("friends").style.cursor = "default";
        document.getElementById("report").style.cursor = "default";
        document.getElementById("account").style.cursor = "default";
        document.getElementById("menu").style.opacity = "100%";
    }
}

function changeCurrentRoom(event) {

    let chatContainer = document.getElementById("chat_box")
    chatContainer.style.visibility = "visible";

    let previousChatroom = document.getElementById("chatroom_title").textContent

    userToText = event.target.textContent
    chatroomName = document.getElementById("chatroom_title")
    chatroomName.value = userToText
    chatroomName.textContent = userToText

    username = document.getElementById("username").value

    const socket = new WebSocket("ws://192.168.x.x:51151")

    socket.onopen = () => {
        console.log("Message Server Connected")
        socket.send(userToText)
    }

    socket.onmessage = (array) => {

        allMessages = JSON.parse(array.data);

        parentDiv = document.getElementById("chat_list")
        parentDiv.innerHTML = ""

        for (messageIndex = 0; messageIndex < allMessages.length; messageIndex++){

            if (allMessages[messageIndex]){
                let fromUser = allMessages[messageIndex].split(":")[0]

                textMsg = document.createElement("div")
                hrDiv = document.createElement("hr")

                textMsg.id = `message${messageIndex}`
                hrDiv.id = `hrMessage${messageIndex}`

                textMsg.value = allMessages[messageIndex]
                textMsg.textContent = allMessages[messageIndex]

                if (fromUser === username){
                    textMsg.style.backgroundColor = "#1abc9c"
                }

                parentDiv.appendChild(textMsg)
                parentDiv.appendChild(hrDiv)

            }
        }
    }
}

function showFriends() {

    const socket = new WebSocket("ws:192.168.x.x:52525")
    
    socket.onopen = () => {
        console.log("ReturnFriends Server Connected")
    }

    socket.onmessage = (event) => {
        
        allFriends = JSON.parse(event.data)

        console.log(allFriends)

        let parentDiv = document.getElementById("chatroom_list")
        parentDiv.innerHTML = ""

        for (friendIndex = 0; friendIndex < allFriends.length; friendIndex++){
            if (allFriends[friendIndex]){

                friendDiv = document.createElement("div")
                friendDiv.value = allFriends[friendIndex]
                friendDiv.textContent = allFriends[friendIndex]
                friendDiv.id = `friend${friendIndex}`
                friendDiv.onclick = changeCurrentRoom

                hrDiv = document.createElement("hr")

                parentDiv.appendChild(friendDiv)
                parentDiv.appendChild(hrDiv)

            }
        }
    }

}

function messageSend() {

    username = document.getElementById("username").value
    userToSend = document.getElementById("chatroom_title").textContent
    inputDiv = document.getElementById("text_input")
    message = inputDiv.value
    
    if (message){
        const socket = new WebSocket("ws:192.168.x.x:56667")

        socket.onopen = () => {
            console.log("MessageSend Server Connected")
            socket.send(username + "²" + message + "\n²" + userToSend)
            
            parentDiv = document.getElementById("chat_list")

            textMsg = document.createElement("div")
            hrDiv = document.createElement("hr")

            textMsg.id = `message${parentDiv.querySelectorAll("div").length}`
            hrDiv.id = `hrMessage${parentDiv.querySelectorAll("div").length}`

            textMsg.value = message
            textMsg.textContent = message
            textMsg.style.backgroundColor = "#1abc9c"

            parentDiv.appendChild(textMsg)
            parentDiv.appendChild(hrDiv)

            inputDiv.value = ""

            socket.close()
        }

        socket.onclose = () => {
            console.log("MessageSend Server Closed")
        }

        socket.onerror = (error) => {
            console.log(error)
        }
    }

}

document.addEventListener("DOMContentLoaded", () => {
    const inputField = document.getElementById("text_input");

    inputField.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            messageSend()
        }
    });
});


let keysocket = new WebSocket("ws://192.168.x.x:53323")

keysocket.onopen = () => {
    console.log("Key Server Connected");
}

keysocket.onmessage = (message) => {

    let upk = message.data.split("²")[1];
    let username = message.data.split("²")[0];

    document.getElementById("upk").value = upk;
    document.getElementById("username").value = username;
    console.log(document.getElementById("username").value)
    
    keysocket.close()
}

keysocket.onclose = () => {
    console.log("Key Server Closed")
}

keysocket.onerror = (error) => {
    console.log(error)
}

const socket = new WebSocket("ws://192.168.x.x:59898")

socket.onopen = () => {
    console.log("Actives Server Connected")
}

socket.onmessage = (array) => {
    allActiveUsers = JSON.parse(array.data)
    activeUsers = allActiveUsers.join("||")
    document.getElementById("activeFriends").textContent = activeUsers
}
