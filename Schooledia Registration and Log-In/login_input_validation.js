/*
------Password masking function-------
*/

isPasswordMasked = true

function toggle_mask(){

    let passwordField = document.getElementById("password")
    let img = document.getElementById("toggle_mask")

    if (isPasswordMasked){
        passwordField.type = "text";
        img.src = "imgs/see_password.png";
        isPasswordMasked = false;
        return;
    }

    passwordField.type = "password";
    img.src = "imgs/hide_password.png";
    isPasswordMasked = true;
    return;
}



/*
------Log-In Button-------
*/

async function login_verification(){
        
    document.getElementById("inexistant").style.visibility = "hidden";

    let usernameVerify = verify_username();
    let passwordVerify = verify_password();

    console.log("Username found:", usernameVerify);
    console.log("Password found:", passwordVerify);

    if (!passwordVerify || !usernameVerify){
        console.log("Invalid fields");
        return;
    }
            
    const upExistance = await username_password_existance()

    console.log("User exists:", upExistance)

    if (upExistance){
        console.log("Valid fields");
        
        var socket = new WebSocket("ws:192.168.x.x:54444")

        socket.onopen = () => {
            console.log("Key Server Connected")
            let username = document.getElementById("username").value
            let password = document.getElementById("password").value
            socket.send(`${username}²${password}`)
        }

        socket.onmessage = (message) => {
            window.location.href = ".../Schooledia Main Chatroom/schooledia.html"
            socket.close()
        }

        socket.onclose = () => {
            console.log("Key Server Closed")
        }

        socket.onerror = (error) => {
            console.log(error)
        }

        return;
    }
    
    document.getElementById("inexistant").style.visibility = "visible";
    console.log("Invalid fields");
    return;

}

function verify_username(){
    username = document.getElementById("username").value

    if (!username){
        username_error_message = document.getElementById("username_missing_error")

        if (!username_error_message){

            const username_error_div = document.createElement("div");
            username_error_div.textContent = "Error, username field is empty"
            username_error_div.id = "username_missing_error"

            const parent_div = document.getElementById("username_section");
            parent_div.appendChild(username_error_div);
        }
        return false

    } else{
        username_error_message = document.getElementById("username_missing_error")

        if (username_error_message){
            username_error_message.parentNode.removeChild(username_error_message)
        }
    }
    return true
}

function verify_password(){

    if (!document.getElementById("password").value){
        error_message = document.getElementById("password_missing_error")

        if (!error_message){

            const password_missing_div = document.createElement("div");
            password_missing_div.textContent = "Error, password fields are empty"
            password_missing_div.id = "password_missing_error"

            const parent_div = document.getElementById("password_section");
            parent_div.appendChild(password_missing_div);
        } 
        return false;

    } else{

        error_message = document.getElementById("password_missing_error")

        if (error_message){
            error_message.parentNode.removeChild(error_message)
        }
    }
    return true
}

function username_password_existance(){

    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    return new Promise((resolve , reject) => {

        const socket = new WebSocket("ws://192.168.x.xx:55555")

        socket.onopen = () => {
            
            console.log("Connected to server")
            socket.send(username+password)
        }

        socket.onmessage = (message) => {

            if (JSON.parse(message.data)){
                resolve(true)
            }
            
            resolve(false)
        }
        
        socket.onerror = (error) => {

            console.log(`${error}`)
            reject(error)
        }

        socket.onclose = () => {

            console.log("Server closed.")
        }
    })
}