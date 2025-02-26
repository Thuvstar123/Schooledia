import asyncio
import websockets
from datetime import datetime
import json
import os


upkDict = {}
usernameDict = {}


######################################################################
#-------------------------USERNAME VALIDATION------------------------#
######################################################################
async def username_validation(websocket,path):
    global upkDict,usernameDict

    async for usernamepassword in websocket:
        
        clientIP = websocket.remote_address[0]

        usernamepasswordarr = usernamepassword.split("²")

        username = usernamepasswordarr[0]
        password = usernamepasswordarr[1]

        usernameFile = open("usernames.txt","r")
        allUsernames = usernameFile.read()
        usernames = allUsernames.split("\n")

        if username in usernames:
            validation = "existant"

            usernameFile.close()

        else:
            validation = "nonexistant"

            usernameFile.close()
            usernameFile = open("usernames.txt" , "a")
            usernameFile.write(username+"\n")
            usernameFile.close()

            usernamepasswordFile = open("usernamepassword.txt" , "a")
            usernamepasswordFile.write(username + password + "\n")
            usernamepasswordFile.close()
        
            upkFile = open("usernamepasswordkey.txt","a+")
            upkCount = len(upkFile.read().split("\n"))
            upk = username[:3] + password[:5].upper() + f"{upkCount}"

            upkDict[str(clientIP)] = upk
            usernameDict[str(clientIP)] = username

            upkFile.write(upk + "\n")
            upkFile.close()

            requestFile = open(f"Friend Requests/{username}.txt","w")
            requestFile.close()
            friendsFile = open(f"Friends/{username}.txt","w")
            friendsFile.close()

        print(upkDict)
        print(usernameDict)

        await websocket.send(validation)

async def existanceValidation(websocket,path):

    async for username in websocket:
        
        usernameFile = open("usernames.txt","r")
        allUsernames = usernameFile.read().split("\n")

        if username in allUsernames:
            await websocket.send("true")
        
        await websocket.send("false")


######################################################################
#-------------------------DETAIL VALIDATION--------------------------#
######################################################################
async def login_validation(websocket,path):
    global upkDict,usernameDict

    async for login in websocket:

        loginFile = open("usernamepassword.txt","r")
        allLogins = loginFile.read().split("\n")

        if login in allLogins:
            await websocket.send("true")
        await websocket.send("false")

async def upValidation(websocket,path):

    async for usernamepassword in websocket:

        upFile = open("usernamepassword.txt")
        
        allUPs = upFile.read().split("\n")

        if usernamepassword in allUPs:
            await websocket.send("true")

        await websocket.send("false")

####################################################################
#-------------------------REPORT HANDLER---------------------------#
####################################################################
async def report_handler(websocket,path):
    global upkDict,usernameDict

    async for reportData in websocket:

        reportDataArr = reportData.split("²")

        reportEmail = reportDataArr[0]
        reportReason = reportDataArr[1]
        reportAdditional = reportDataArr[2]

        reportFile = open("reports.txt","a")

        if reportAdditional:
            reportFile.write(reportEmail + "\n" + reportReason + "\n" + reportAdditional + "\n\n")
        else:
            reportFile.write(reportEmail + "\n" + reportReason + "\n\n")

        reportFile.close()

        await websocket.send("true")

#####################################################################
#---------------------------KEY HANDLING----------------------------#
#####################################################################

async def add_key(websocket, path):
    global usernameDict, upkDict

    async for userPass in websocket:

        clientIP = websocket.remote_address[0]

        print(clientIP)

        username = userPass.split("²")[0]
        password = userPass.split("²")[1]

        print(username)
        print(password)

        usernameFile = open("usernames.txt","r")
        usernames = usernameFile.read().split("\n")
        userIndex = usernames.index(username)
        usernameFile.close()

        upkFile = open("usernamepasswordkey.txt","r")
        allUPK = upkFile.read().split("\n")
        upkCount = allUPK[userIndex]

        upk = username[:3] + password[:5].upper() + f"{upkCount}"
    
        usernameDict[str(clientIP)] = username
        upkDict[str(clientIP)] = upk
        
        print(clientIP)
        print(usernameDict)
        print(upkDict)
        
        await websocket.send("")

async def returnKey(websocket,path):
    global usernameDict,upkDict
    
    clientIP = websocket.remote_address[0]

    await websocket.send(usernameDict[str(clientIP)] + "²" + upkDict[str(clientIP)])

######################################################################
#--------------------------FRIEND REQUEST----------------------------#
######################################################################

async def findUsers(websocket,path):

    async for users in websocket:

        usernameFile = open("usernames.txt","r")
        allUsernames = usernameFile.read().split("\n")
        username = users.split("²")[0]
        userToFind = users.split("²")[1]

        matchedUsers = []

        if not userToFind:
            for user in allUsernames:
                
                if user:
                    requestFile = open(f"Friend Requests/{user}.txt","r")
                    allRequests = requestFile.read().split("\n")

                    if username not in allRequests:
                        matchedUsers.append(user)
                                
                    requestFile.close()
            
            if matchedUsers:
                matchedUsersJS = json.dumps(matchedUsers)
                await websocket.send(matchedUsersJS)
                
            await websocket.send("No usernames found")
        
        for user in allUsernames:
            
            if user:
                requestFile = open(f"Friend Requests/{user}.txt","r")
                allRequests = requestFile.read().split("\n")
                
                if username not in allRequests:

                    if userToFind in user:

                        if user:
                            matchedUsers.append(user)
                            
                requestFile.close()

        if matchedUsers:
            matchedUsersJS = json.dumps(matchedUsers)
            await websocket.send(matchedUsersJS)
            
        await websocket.send("No usernames found")
    
async def sendRequest(websocket, path):
    
    async for users in websocket:

        sender = users.split("²")[0]
        reciever = users.split("²")[1]

        requestFile = open(f"Friend Requests/{reciever}.txt", "r")
        allRequests = requestFile.read().split("\n")

        if sender not in allRequests:
            
            requestFile.close()
            requestFile = open(f"Friend Requests/{reciever}.txt","a+")
            requestFile.write(sender + "\n")

        requestFile.close()

async def rejectRequest(websocket,path):
    
    async for users in websocket:
         
        rejectedBy = users.split("²")[0]
        rejecting = users.split("²")[1]
        
        requestFile = open(f"Friend Requests/{rejectedBy}.txt","r")
        allRequests = requestFile.read().split("\n")
        allRequests.pop(allRequests.index(rejecting))
        requestFile.close()

        requestFile = open(f"Friend Requests/{rejectedBy}.txt","w")
        requestFile.write("\n".join(allRequests))
        requestFile.close()

async def acceptRequest(websocket,path):
    
    async for users in websocket:

        username = users.split("²")[0]
        userToAccept = users.split("²")[1]
        
        userFile = open(f"Friends/{username}.txt","a")
        userFile.write(userToAccept + "\n")

        utaFile = open(f"Friends/{userToAccept}.txt","a")
        utaFile.write(username + "\n")

        requestFile = open(f"Friend Requests/{username}.txt","r")
        allRequests = requestFile.read().split("\n")
        allRequests.pop(allRequests.index(userToAccept))
        requestFile.close()

        requestFile = open(f"Friend Requests/{username}.txt","w")
        requestFile.write("\n".join(allRequests))
        requestFile.close()
        
        try:
            requestFile = open(f"Friend Requests/{userToAccept}.txt","r")
            allRequests = requestFile.read().split("\n")
            allRequests.pop(allRequests.index(username))
            requestFile.close()

            requestFile = open(f"Friend Requests/{allRequests}.txt","w")
            requestFile.write("\n".join(username))
            requestFile.close()
        except:
            pass

        utaFile.close()
        userFile.close()


async def showRequests(websocket,path):
    
    async for username in websocket:

        userRequestFile = open(f"Friend Requests/{username}.txt","r")
        allUserRequests = userRequestFile.read().split("\n")

        await websocket.send(json.dumps(allUserRequests))

async def returnAllFriends(websocket,path):

    clientIP = websocket.remote_address[0]

    username = usernameDict[str(clientIP)]

    friendsFile = open(f"Friends/{username}.txt","r")
    allFriends = friendsFile.read().split("\n")
    allFriends.remove("")
    allFriendsJS = json.dumps(allFriends)
    friendsFile.close()

    await websocket.send(allFriendsJS)

######################################################################
#------------------------MESSAGE REQUESTS----------------------------#
######################################################################

async def returnMessages(websocket,path):
    global upkDict,usernameDict
    
    async for userToText in websocket:

        clientIP = websocket.remote_address[0]
        username = usernameDict[str(clientIP)]
        print(username)
        
        try:
            chatroomFile = open(f"Chats/{username}-{userToText}.txt","r")
        except FileNotFoundError:
            try:
                chatroomFile = open(f"Chats/{userToText}-{username}.txt","r")
            except FileNotFoundError:
                chatroomFile = open(f"Chats/{userToText}-{username}.txt","w")
                chatroomFile.close()
                chatroomFile = open(f"Chats/{userToText}-{username}.txt","r")
                await websocket.send("")

        allMessages = chatroomFile.read().split("\n")
        allMessagesJS = json.dumps(allMessages)

        await websocket.send(allMessagesJS)

async def returnActiveUsers(websocket,path):
    
    allActiveUsers = list(usernameDict.values())
    allActiveUsersJS = json.dumps(allActiveUsers)

    await websocket.send(allActiveUsersJS)

######################################################################
#--------------------------ACCOUNT CHANGE----------------------------#
######################################################################

async def logoutAccount(websocket,path):
    global upkDict, usernameDict

    clientIP = websocket.remote_address[0]

    del upkDict[str(clientIP)]
    del usernameDict[str(clientIP)]

async def terminateAccount(websocket,path):
    global upkDict, usernameDict

    clientIP = websocket.remote_address[0]
    username = usernameDict[str(clientIP)]

    try:
        os.remove(f"Friend Requests/{username}.txt")
    except:
        print("No such file found")

    usernameFileR = open("usernames.txt","r")
    allUsernames = usernameFileR.read().split("\n")
    upFileR = open("usernamepassword.txt","r")
    allUPs = upFileR.read().split("\n")
    upkFileR = open("usernamepasswordkey.txt","r")
    allUPKs = upkFileR.read().split("\n")

    usernameIndex = allUsernames.index(username)
    
    upkFileR.close()
    usernameFileR.close()
    upFileR.close()

    usernameFileW = open("usernames.txt","w")
    allUsernames.remove(username)
    usernameFileW.write("\n".join(allUsernames))
    usernameFileW.close()

    upFileW = open("usernamepassword.txt","w")
    allUPs.pop(usernameIndex)
    upFileW.write("\n".join(allUPs))
    upFileW.close()

    upkFileW = open("usernamepasswordkey.txt","w")
    allUPKs.pop(usernameIndex)
    upkFileW.write("".join(allUPKs))
    upkFileW.close()

    del usernameDict[str(clientIP)]
    del upkDict[str(clientIP)]

    print(usernameDict)
    print(upkDict)
    

######################################################################
#-------------------------WEBSOCKET SERVES---------------------------#
######################################################################
start_login_verification = websockets.serve(login_validation, "192.168.x.x", 55555)
start_register_verification = websockets.serve(username_validation, "192.168.x.x", 56786)
start_handler_reports = websockets.serve(report_handler, "192.168.x.x", 55554)
start_add_key = websockets.serve(add_key,"192.168.x.x", 54444)
start_find_users = websockets.serve(findUsers,"192.168.x.x",51111)
start_return_key = websockets.serve(returnKey, "192.168.x.x", 53323)
start_send_request = websockets.serve(sendRequest,"192.168.x.x", 52222)
start_show_requests = websockets.serve(showRequests, "192.168.x.x", 56666)
start_reject_requests = websockets.serve(rejectRequest, "192.168.x.x", 57777)
start_logout_account = websockets.serve(logoutAccount, "192.168.x.x", 58888)
start_terminate_account = websockets.serve(terminateAccount, "192.168.x.x", 50000)
start_up_validation = websockets.serve(upValidation, "192.168.x.x",59999)
start_accept_request = websockets.serve(acceptRequest, "192.168.x.x", 51515)
start_return_friends = websockets.serve(returnAllFriends, "192.168.x.x", 52525)
start_return_messages = websockets.serve(returnMessages, "192.168.x.x", 51151)
start_existance_validaiton = websockets.serve(existanceValidation, "192.168.x.x", 54123)
start_return_actives = websockets.serve(returnActiveUsers,"192.168.x.x", 59898)

######################################################################
#-----------------------INFINITE LOOP THREADS------------------------#
######################################################################
asyncio.get_event_loop().run_until_complete(start_up_validation)
asyncio.get_event_loop().run_until_complete(start_terminate_account)
asyncio.get_event_loop().run_until_complete(start_logout_account)
asyncio.get_event_loop().run_until_complete(start_add_key)
asyncio.get_event_loop().run_until_complete(start_show_requests)
asyncio.get_event_loop().run_until_complete(start_send_request)
asyncio.get_event_loop().run_until_complete(start_return_key)
asyncio.get_event_loop().run_until_complete(start_register_verification)
asyncio.get_event_loop().run_until_complete(start_login_verification)
asyncio.get_event_loop().run_until_complete(start_handler_reports)
asyncio.get_event_loop().run_until_complete(start_find_users)
asyncio.get_event_loop().run_until_complete(start_reject_requests)
asyncio.get_event_loop().run_until_complete(start_accept_request)
asyncio.get_event_loop().run_until_complete(start_return_friends)
asyncio.get_event_loop().run_until_complete(start_return_messages)
asyncio.get_event_loop().run_until_complete(start_existance_validaiton)
asyncio.get_event_loop().run_until_complete(start_return_actives)
asyncio.get_event_loop().run_forever()
