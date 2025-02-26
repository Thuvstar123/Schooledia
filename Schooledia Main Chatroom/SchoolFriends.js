const socket = new WebSocket("ws:192.168.x.x:53323")

socket.onopen = () => {
    console.log("Key Server Connected")
}

socket.onmessage = (event) => {

    usernameRecieved = String(event.data).split("²")[0]
    document.getElementById("username").value = usernameRecieved;
    showRequests()
    findUsers()
    socket.close()
}

socket.onclose = () => {
    console.log("Key Server Closed")
}

socket.onerror = (error) => {
    console.log(error)
}

function findUsers(){

    const userToFind = document.getElementById("friend_name_input").value;
    const username = document.getElementById("username").value;

    const socket = new WebSocket("ws:192.168.x.x:51111");

    socket.onopen = () => {
        console.log("Friends Server Connected");
        console.log(username)
        socket.send(username + "²" + userToFind);
    }

    socket.onmessage = (event) => {

        const parent_div = document.getElementById("user_list");
        const userCount = parent_div.querySelectorAll("div").length;

        if (userCount > 0 ){

            for (userIndex = 0; userIndex < userCount; userIndex++){

                userDivRemove = document.getElementById(`user${userIndex}`);
                hrDivRemove = document.getElementById(`hr${userIndex}`);

                userDivRemove.parentNode.removeChild(userDivRemove);
                hrDivRemove.parentNode.removeChild(hrDivRemove);
            }
        }

        if (event.data !== "No usernames found"){

            allUsers = JSON.parse(event.data);

            for (index = 0;  index < allUsers.length ; index++){
                
                if (allUsers[index] != document.getElementById("username").value && allUsers[index] != ""){
                    
                    var userDiv = document.createElement("div");
                    userDiv.textContent = allUsers[index];
                    userDiv.value = allUsers[index]
                    userDiv.id = `user${index}`;

                    var buttonDiv = document.createElement("button");
                    buttonDiv.textContent = "Add";
                    buttonDiv.onclick = addFriend;
                    buttonDiv.id = `button${index}`

                    var hrDiv = document.createElement("hr");
                    hrDiv.id = `hr${index}`;

                    parent_div.appendChild(userDiv);
                    parent_div.appendChild(hrDiv);

                    let userParentDiv = document.getElementById(`user${index}`);
                    userParentDiv.appendChild(buttonDiv);

                }
            }

        } else{
            const parent_div = document.getElementById("user_list");
            const userCount = parent_div.querySelectorAll("div").length;

            console.log(userCount);

            if (userCount > 0 ){

                for (userIndex = 0; userIndex < userCount; userIndex++){

                    userDivRemove = document.getElementById(`user${userIndex}`);
                    hrDivRemove = document.getElementById(`hr${userIndex}`);

                    userDivRemove.parentNode.removeChild(userDivRemove);
                    hrDivRemove.parentNode.removeChild(hrDivRemove);
                }
            }
        }

        socket.close();
    }

    socket.onclose = () => {
        console.log("Friend Server Closed");
    }

    socket.onerror = (error) => {
        console.log(error);
    }

}

const friendInput = document.getElementById("friend_name_input");

friendInput.addEventListener("keydown",function(event) {
    if (event.key === "Enter"){
        findUsers();
    }
})

function addFriend(event) {
    let username = document.getElementById("username").value;
    let selectedButton = event.target.id;
    let userToSend = document.getElementById(`user${selectedButton.replace(/\D/g, "")}`).value;
    
    selectedButtonDiv = document.getElementById(selectedButton);
    selectedButtonDiv.style.backgroundColor = "#125245";
    selectedButtonDiv.style.color = "#2affd4";
    selectedButtonDiv.textContent = "Added"
    selectedButtonDiv.disabled = "true"
    selectedButtonDiv.style.cursor = "default"
    const socket = new WebSocket("ws://192.168.x.x:52222");

    socket.onopen = () => {
        console.log("Sending Server Connected");
        socket.send(username + "²" + userToSend);
        socket.close();
    }

    socket.onclose = () => {
        console.log("Sending Server Closed")
    }

    socket.onerror = (error) => {
        console.log(error)
    }
}

function showRequests(){
    let username = document.getElementById("username").value
    
    const socket = new WebSocket("ws://192.168.x.x:56666")

    socket.onopen = () => {
        console.log("Recieved Server Connected")
        socket.send(username);
    }

    socket.onmessage = (event) => {

        allUserRequests = JSON.parse(event.data)
        console.log(allUserRequests)
        for (userIndex = 0; userIndex < allUserRequests.length; userIndex++){

            if (allUserRequests[userIndex]){

                var userRequestDiv = document.createElement("div");
                userRequestDiv.id = `userRequest${userIndex}`;
                userRequestDiv.className = "request-item";
                userRequestDiv.textContent = allUserRequests[userIndex]
                userRequestDiv.value = allUserRequests[userIndex];

                var acceptDiv = document.createElement("button");
                acceptDiv.id = `accept${userIndex}`;
                acceptDiv.style.marginLeft = "70%"
                acceptDiv.onclick = acceptRequest;
                acceptDiv.style.height = "30px"

                var rejectDiv = document.createElement("button");
                rejectDiv.id = `reject${userIndex}`;
                rejectDiv.onclick = rejectRequest;
                rejectDiv.style.height = "30px"
                rejectDiv.style.marginRight = "auto"
                rejectDiv.style.marginLeft = "0%"
                
                var acceptImg = document.createElement("img");
                acceptImg.src = "imgs//accept.png";
                acceptImg.style.height = "100%"

                var rejectImg = document.createElement("img");
                rejectImg.src = "imgs//reject.png";
                rejectImg.style.height = "100%"

                var hrRequestDiv = document.createElement("hr");
                hrRequestDiv.id = `hrRequest${userIndex}`
                hrRequestDiv.style.marginRight = "2%"

                rejectDiv.appendChild(rejectImg)
                acceptDiv.appendChild(acceptImg)

                var buttonsDiv = document.createElement("div");
                buttonsDiv.className = "request-buttons";
                buttonsDiv.append(acceptDiv, rejectDiv);

                userRequestDiv.append(buttonsDiv);

                let requestsDiv = document.getElementById("requestsList")

                requestsDiv.append(userRequestDiv,hrRequestDiv)

            }
        }
        socket.close()
    }

    socket.onclose = () => {
        console.log("Recieved Server Closed")
    }

    socket.onerror = (error) => {
        console.log(error)
    }
}

function acceptRequest(event){
    
    let userToAccept
    let username = document.getElementById("username").value

    if (event.target.tagName === "IMG"){
        selectedAcceptButton = event.target.parentNode.id
    } else{
        selectedAcceptButton = event.target.id
    }

    userToAccept = document.getElementById(`userRequest${selectedAcceptButton.replace(/\D/g, "")}`)
    hrToRemove = document.getElementById(`hrRequest${selectedAcceptButton.replace(/\D/g, "")}`)

    const socket = new WebSocket("ws:192.168.x.x:51515")

    socket.onopen = () => {
        console.log("AddFriend Server Connected")
        socket.send(username + "²" + userToAccept.value)
        socket.close()
    }

    socket.onclose = () => {
        console.log("AddFriend Server Closed")
    }

    socket.onerror = (error) => {
        console.log(error)
    }
    
    userToAccept.parentNode.removeChild(userToAccept)
    hrToRemove.parentNode.removeChild(hrToRemove)
    
}

function rejectRequest(event){

    let userToReject;
    let username = document.getElementById("username").value

    if (event.target.tagName === "IMG"){
        selectedRejectButton = event.target.parentNode.id
    } else{
        selectedRejectButton = event.target.id
    }

    userToReject = document.getElementById(`userRequest${selectedRejectButton.replace(/\D/g, "")}`)
    hrToRemove = document.getElementById(`hrRequest${selectedRejectButton.replace(/\D/g, "")}`)

    const socket = new WebSocket("ws:192.168.x.x:57777")

    socket.onopen = () => {
        console.log("Reject Server Connected")
        socket.send(username + "²" + userToReject.value)
        socket.close()
    } 

    socket.onclose = () => {
        console.log("Reject Server Closed")
    }

    socket.onerror = (error) => {
        console.log(error)
    }
    
    userToReject.parentNode.removeChild(userToReject)
    hrToRemove.parentNode.removeChild(hrToRemove)
}
