isPasswordMasked = true

function toggleMask() {

    let password = document.getElementById("password")
    let repeatPassword = document.getElementById("repeat_password")
    let image = document.getElementById("toggle_mask")

    if (isPasswordMasked) {

        password.type = "text";
        repeatPassword.type = "text";
        image.src = "imgs/see_password.png";
        image.onclick = toggleMask
        isPasswordMasked = false
        return;
    } 

    password.type = "password"
    repeatPassword.type = "password"
    image.src = "imgs/hide_password.png"
    image.onclick = toggleMask
    isPasswordMasked = true
    return;

}

function verify_password(){

    if (document.getElementById("password").value == document.getElementById("repeat_password").value){
        error_message = document.getElementById("password_match_error")
        if (error_message){
            error_message.parentNode.removeChild(error_message)
        }

        console.log("Password matched");

    } else{

        error_message = document.getElementById("password_match_error")

        if (!error_message){
            const password_error_div = document.createElement("div");
            password_error_div.textContent = "Error, passwords do not match"
            password_error_div.id = "password_match_error"
            const parent_div = document.getElementById("password_section");
            parent_div.appendChild(password_error_div);
        } 

        console.log("Error, password do not match");
        return false;
    }

    if (!document.getElementById("password").value){
        error_message = document.getElementById("password_missing_error")

        if (!error_message){
            const password_missing_div = document.createElement("div");
            password_missing_div.textContent = "Error, password fields are empty"
            password_missing_div.id = "password_missing_error"
            const parent_div = document.getElementById("password_section");
            parent_div.appendChild(password_missing_div);
        } 

        console.log("Missing password");
        return false;

    } else{
        error_message = document.getElementById("password_missing_error")
        if (error_message){
            error_message.parentNode.removeChild(error_message)
        }

        console.log("Password found");
    }

    return true
}

function verify_email(){

    if (!document.getElementById("school_email").value){
        error_message = document.getElementById("email_missing_error")

        if (!error_message){
            const email_missing_div = document.createElement("div");
            email_missing_div.textContent = "Error, email field is empty"
            email_missing_div.id = "email_missing_error"
            const parent_div = document.getElementById("email_section");
            parent_div.appendChild(email_missing_div);
        }

        console.log("Missing email");
        return false;

    } else{
        error_message = document.getElementById("email_missing_error")
        if (error_message){
            error_message.parentNode.removeChild(error_message)
        }

        console.log("Email found");
    }

    const reg_email_pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    test_subj = document.getElementById("school_email").value

    if (!reg_email_pattern.test(test_subj)){
        error_message = document.getElementById("email_format_error")

        if (!error_message){
            const email_error_div = document.createElement("div");
            email_error_div.textContent = "Error, email not formatted correctly"
            email_error_div.id = "email_format_error"
            const parent_div = document.getElementById("email_section");
            parent_div.appendChild(email_error_div);
        } 

        console.log("Incorrect Email format")
        return false
    } else{
        error_message = document.getElementById("email_format_error")
        if (error_message){
            error_message.parentNode.removeChild(error_message)
        }

        console.log("Email is valid");
    } 
    return true
}

function verify_username(){
    username = document.getElementById("username").value

    if (!username){
        error_message = document.getElementById("username_missing_error")

        if (!error_message){
            const username_error_div = document.createElement("div");
            username_error_div.textContent = "Error, username field is empty"
            username_error_div.id = "username_missing_error"
            const parent_div = document.getElementById("username_section");
            parent_div.appendChild(username_error_div);
        }
        console.log("Missing username")
        return false

    } else{
        error_message = document.getElementById("username_missing_error")

        if (error_message){
            error_message.parentNode.removeChild(error_message)
        }
        console.log("Username found")
    }
    return true
}

function verify_agreements(){

    if (document.getElementById("agreements").checked){
        console.log("Agreements accepted")

        error_message = document.getElementById("agreements_denied_error")
        if (error_message){
            error_message.parentNode.removeChild(error_message)
        }
    } else{
        error_message = document.getElementById("agreements_denied_error")

        if (!error_message){
            const agreements_denied_div = document.createElement("div");
            agreements_denied_div.textContent = "Error, agreements have not been accepted"
            agreements_denied_div.id = "agreements_denied_error"
            const parent_div = document.getElementById("agreements_section");
            parent_div.appendChild(agreements_denied_div);
        }
        console.log("Agreements denied")
    }

    return document.getElementById("agreements").checked
}


function username_existance() {
    return new Promise((resolve,reject) => {

        const socket = new WebSocket("ws://192.168.x.x:56786")

        socket.onopen = () => {
            console.log("Connected to server");
            socket.send(document.getElementById("username").value + "²" + document.getElementById("password").value)
        }
        
        socket.onmessage = (event) => {
            if (event.data === "existant"){
                console.log("Data recieved:", event.data)
                resolve(false)
            }
            resolve(true) 
        }
        
        socket.onclose = () => {
            console.log("Server closed")
        }
        
        socket.onerror = (error) => {
            console.log(`${error}`)
            reject(error)
        }

    })
                
    
}

async function registration_verification(){

        let agreementsValid = verify_agreements()
        let emailVerify = verify_email()
        let passwordVerify = verify_password()
        let usernameVerify = verify_username()

        console.log("Agreements valid:", agreementsValid);
        console.log("Email valid:", emailVerify);
        console.log("Username valid:", usernameVerify);
        console.log("Password valid:", passwordVerify);
        

        if (!agreementsValid || !emailVerify || !passwordVerify || !usernameVerify){

            console.log("Invalid fields")

        } else{

            const existanceVerification = await username_existance()

            if (existanceVerification){

                window.location.href = ".../Schooledia Main Chatroom/schooledia.html"
                return;

            } else{

                console.log("Username not existant:", false)
                console.log("Invalid fields");
                return;

            }
        }        
    }
