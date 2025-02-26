async function report_verification(){

    let usernameVerify = await verify_username();
    let optionsVerify = verify_options();

    console.log("Email verified:", usernameVerify);
    console.log("Option selected:", optionsVerify);

    if (!usernameVerify || !optionsVerify){
        console.log("Invalid fields");
        return;
    } 

    let reportSent = await sendReport();

    console.log("Report sent:", reportSent)

    if (reportSent){

        console.log("Valid fields")
        document.getElementById("reportSubmitted").style.visibility = "visible";

        setTimeout(() => {
            document.getElementById("reportSubmitted").style.visibility = "hidden";
        }, 3000);
        return;
    }
    console.log("Invalid fields")
    
}

function verify_username(){

    return new Promise((resolve,reject) => {

        const socket = new WebSocket("ws://192.168.x.x:54123")

        let username = document.getElementById("enter_username").value

        socket.onopen = () => {
            console.log("Existance Server Connected")
            socket.send(username)
        }

        socket.onmessage = (event) => {
            validity = JSON.parse(event.data)

            if (!validity){

                error_message = document.getElementById("username_inexistance_error");
    
                if (!error_message){
    
                    const username_inexistance_div = document.createElement("div");
                    username_inexistance_div.textContent = "There are no such usernames";
                    username_inexistance_div.id = "username_inexistance_error";
            
                    const parent_div = document.getElementById("username_section");
                    parent_div.appendChild(username_inexistance_div);
                }
    
                resolve(false);
    
            } else{
    
                error_message = document.getElementById("email_missing_error");
    
                if (error_message){
                    error_message.parentNode.removeChild(error_message);
                }
    
            }
    
            resolve(true);

            socket.close()
        }

        socket.onclose = () => {
            console.log("Existance Server Closed")
        }

        socket.onerror = (error) => {
            reject(error)
        }
    })
}

function verify_options(){

    if (document.getElementById("report_options").value == "select"){

        error_message = document.getElementById("empty_selection_error");

        if (!error_message){

            const selection_error_div = document.createElement("div");
            selection_error_div.textContent = "Nothing has been selected";
            selection_error_div.id = "empty_selection_error";

            const parent_div = document.getElementById("options_section");
            parent_div.appendChild(selection_error_div);
        }

        return false

    } else{
        error_message = document.getElementById("empty_selection_error");

        if (error_message){
            error_message.parentNode.removeChild(error_message);
        }
        
    }

    return true
}

function sendReport() {
    return new Promise((resolve , reject) => {

        const socket = new WebSocket("ws://192.168.x.x:55554")

        socket.onopen = () => {
            console.log("Connected to server")
            socket.send(document.getElementById("enter_username").value + "²" + document.getElementById("report_options").value + "²" + document.getElementById("extra_information").value)
        }

        socket.onmessage = (message) => {
            if (JSON.parse(message.data)){
                resolve(true)
            }
            resolve(false)
        }

        socket.onclose = () => {
            console.log("Server closed")
        }

        socket.onerror = (error) => {
            reject(`${error}`)
        }

    })
}