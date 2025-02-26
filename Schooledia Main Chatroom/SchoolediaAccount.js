function logout(){
    
    const socket = new WebSocket("ws://192.168.x.x:58888");

    socket.onopen = () => {
        console.log("Logout Server Connected");
        window.location.href = ".../Schooledia Registration and Log-In/Schooledia log-in.html";
        socket.close();
    }

    socket.onclose = () => {
        console.log("Logout Server Closed");
    }

    socket.onerror = (error) => {
        console.log(error);
    }
}

async function terminateAccount(){

    let isPasswordValid = await validatePassword()
    let isCheckboxChecked = validateCheckbox()

    console.log(isCheckboxChecked)

    if (isPasswordValid && isCheckboxChecked){

        const socket = new WebSocket("ws:192.168.x.x:50000");

        socket.onopen = () => {
            console.log("Terminatation Server Connected");
            
            window.location.href = ".../Schooledia Registration and Log-In/Schooledia log-in.html";
            socket.close();
        }

        socket.onclose = () => {
            console.log("Termination Server Closed");
        }

        socket.onerror = (error) => {
            console.log(error);
        }
    }
}

isPasswordMasked = true

function showTermination() {

    confirmationDiv = document.getElementById("confirmDivs");
    confirmationDiv.style.visibility = "visible";

    terminateButton = document.getElementById("terminate_account");
    terminateButton.style.color = "#2affd4";
    terminateButton.style.backgroundColor = "#125245";
    terminateButton.disabled = true;
    terminateButton.style.cursor = "default";
}

function unmaskPassword() {

    let maskImg = document.getElementById("password_visibility");
    let password = document.getElementById("password");

    password.type = "text";
    maskImg.src = "imgs/see_password.png";
    maskImg.onclick = "checkMask()";

    isPasswordMasked = false
    return;
}

function unmaskPassword() {
    let maskImg = document.getElementById("password_visibility");
    let password = document.getElementById("password");

    password.type = "text";
    maskImg.src = "imgs/see_password.png";

    isPasswordMasked = false;
}

function maskPassword() {
    let maskImg = document.getElementById("password_visibility");
    let password = document.getElementById("password");

    password.type = "password";
    maskImg.src = "imgs/hide_password.png";

    isPasswordMasked = true;
}

function checkMask() {
    if (isPasswordMasked) {
        unmaskPassword();

    } else {
        maskPassword();
    }
}

function validatePassword() {

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    return new Promise((resolve,reject) => {
        
    const socket = new WebSocket("ws://192.168.x.x:59999");

    socket.onopen = () => {
        console.log("Validation Server Connected");
        console.log(username+password)
        socket.send(username + password);
    }

    socket.onmessage = (event) => {
        
        let validity = event.data;
        let passwordError = document.getElementById("password_error");

        if (JSON.parse(validity)){
            passwordError.style.visibility = "hidden"
            socket.close()
            resolve(true)
            return
        }
        
        passwordError.style.visibility = "visible";
        socket.close()
        resolve(false)
        return
    }

    socket.onclose = () => {
        console.log("Validation Server Closed")
    }

    socket.onerror = (error) => {
        reject(error)
    }
    })

}

function validateCheckbox() {
    let validity = document.getElementById("confirm_checkbox")
    let checkError = document.getElementById("checkbox_error")

    if (validity.checked){
        checkError.style.visibility = "hidden"
        return true
    }
    
    checkError.style.visibility = "visible"
    return false
}

function cancelTermination() {
     
    let passwordError = document.getElementById("password_error");
    confirmationDiv = document.getElementById("confirmDivs");
    terminateButton = document.getElementById("terminate_account");

    passwordError.style.visibility = "hidden";
    confirmationDiv.style.visibility = "hidden";
    terminateButton.style.color = "#125245";
    terminateButton.style.backgroundColor = "#1abc9c";
    terminateButton.disabled = false;
    terminateButton.style.cursor = "pointer"; 
    
}

const socket = new WebSocket("ws://192.168.x.x:53323");

socket.onopen = () => {
    console.log("Key Server Connected");
}

socket.onmessage = (event) => {
    let userUPK = event.data;
    
    username = userUPK.split("²")[0];
    upk = userUPK.split("²")[1];

    let usernameDiv = document.getElementById("username");
    let upkDiv = document.getElementById("upk");

    usernameDiv.value = username;
    upkDiv.value = upk;

    socket.close();
}

socket.onclose = () => {
    console.log("Key Server Closed");
}

socket.onerror = (error) => {
    console.log(error);
}