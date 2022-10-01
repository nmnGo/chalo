  

### Introduction

In this guide, we will explain how to develop a WhatsApp bot on Node JS using our WhatsApp API gateway.

The bot will respond to the commands it receives as normal WhatsApp messages and respond to them. In our example, we will try to cover the basic, most frequently used functionality, such as:

*   Responding to commands
*   Outputting the current chat ID (in either private or group messages)
*   Outputting the name of the user chatting with the bot
*   Sending files of different formats (pdf, jpg, doc, mp3, etc.)
*   Sending voice messages (\*.ogg files)
*   Sending GPS coordinates (latitude and longitude)
*   Creating a conference (group) chatbot

An important note: For the bot to work, the phone must always be connected to the Internet and must not be used for Whatsapp Web.

### Step 1. Get Things Ready

##### A Bit of Theory

![Authorization of Whatsapp via QR code](/img/whatsapp_auth_en.gif)

In the beginning, let's link whatsapp with our script at once to check its work as we write the code. To do this, we go to a [personal account](https://app.chat-api.com) and get a QR code there. Then open WhatsApp on your mobile phone, go to Settings -> WhatsApp Web -> Scan QR Code.

The Chat-Api service allows for setting up a webhook that will send information about new messages (and more) to your webserver. For the server to call our script at new messages, it is necessary to specify WebHook URL. WebHook URL is a link where it will be sent by POST method, JSON data with information about incoming messages or notifications. Accordingly, for the bot to work, we need a server - which will receive and process this data. And we'll give it to you!

**UPD 2021-11-22**. We added the code in the repository with the bot's docker deployment and a description of the docker files. Docker hosting is available to our customers free of charge. Detailed instructions on how to upload a bot and get a Webhook can be found at the end of the guide.

[Get free access to WhatsApp API](https://app.chat-api.com)  
  

### Step 2.1. Install a Bot on your Host

We recommend that you start with cloning our [Git repository](https://github.com/chatapi/whatsapp-nodejs-bot-en "Example of whatsapp bot on node js") so you could adapt it for yourself later.

Create a WhatsAppBot folder and clone (or simply download) files from the Git repository into it. Now use the **npm install** command to set the necessary dependencies (libraries) for your bot.

Next, go to the config.js file and specify your URL for requests (in quotation marks) and your token — you can get them in your user account. This is how it should look:

                        `module.exports = {
    // API reference URL
    apiUrl: "https://eu14.chat-api.com/instance12345/",
    // API token from your personal account
    token: "xb1s668fphzmr9m"
}`
                    

Save the file and type **node index.js** in the console — this command will launch the webserver so it could process requests. If you do everything right, the bot will work.

### Step 2.2. Develop a Bot from Scratch

Now let’s look at how to develop a bot from scratch.

Since you are reading this guide, we assume that you know how to install Node.JS and NPM, so we will skip this part and get straight to the point.

Create a _WhatsAppBot_ folder, go there and open the terminal. Initialize a project by using the **npm init** command, fill out the information asked or just click Enter a few times until you see a dialog box that says **Is this OK? (yes)**. Press Enter again to confirm initializing.

After that, create a main file (index.js) that will contain basic bot logic. You will also need to create a config.js file where you will add the main parameters. Since these parameters can be dynamic, you won’t have to edit the main file every time you need to modify them.

Open the config.js file and add two parameters there — apiUrl and token:

                        `module.exports = {
    apiUrl: "",
    token: ""
}`
                    

Don’t forget about the first line — module.exports — it will allow you to access these parameters from another file. You can enter the parameters from your user account into the config.js file right away. Once you’re done, save and close it.

In our example, we will use the following requirements:

*   Express (https://www.npmjs.com/package/express)
    
*   Node-Fetch (https://www.npmjs.com/package/node-fetch)
    
*   Body-Parser (https://www.npmjs.com/package/body-parser)
    

To start creating a bot, open index.js and declare the dependencies:

                        `const config = require("./config.js");
const token = config.token, apiUrl = config.apiUrl;
const app = require('express')();
const bodyParser = require('body-parser');
const fetch = require('node-fetch');`
                    

Let us expand on this a bit. The _node-fetch_ allows sending requests to the API, the _config_ file loads data from other files, and assigning values to the _token_ and _apiUrl_ variables from the _config.js_ file helps ease access to them. The _Express_ module is used to set up a webserver while the _body-parser_ helps to easily extract incoming requests.

Next, let your parser know that you are going to work with _JSON_ data:

                        `app.use(bodyParser.json());`
                    

By the way, in order to find out what the received JSON will look like - you can go to a user-friendly [testing section](https://app.chat-api.com/testing), which we provide in the personal account. Here you can test requests and Webhook.

Just in case, add the full error handler to observe errors that can appear while processing requests:

                        `process.on('unhandledRejection', err => {
    console.log(err)
});`
                    

Next up, start writing the base code.

To check the domain parked to the host, you need to generate the main page (a kind of an _index.html_) with the following block:

                        `app.get('/', function (req, res) {
    res.send("It's working");
});` 
                    

Simply put, it is a way to check the work of your website. After you have launched the project, go to yoursite.com, and, if you have done everything right, you’ll see the words “It's working". Now it’s time to write the function for communicating with our API.

                        ``async function apiChatApi(method, params){
    const options = {};
    options['method'] = "POST";
    options['body'] = JSON.stringify(params);
    options['headers'] = { 'Content-Type': 'application/json' };
    
    const url = `${apiUrl}/${method}?token=${token}`; 
    
    const apiResponse = await fetch(url, options);
    const jsonResponse = await apiResponse.json();
    return jsonResponse;
}``
                    

Let’s look at it more closely. First, you need to create the apiChatApi asynchronous function that will have two parameters: the method called, and the parameter object used to call the method. To give you a rough idea, when you want to send a message, you call the _message_ method and pass the message text and sender as parameters.

**Next, inside the function, create an _option_ object. Add the _json_ and _method_ keys to the object. Json is used to send values required for the API, while _method_ specifies the method you use to call and get the response.**

Once you’re done, define the constant value of your URL for the API. This will include the URL itself (from the _config file_), the _method_ and the _token_ passed via a GET request.

After that, send the request and get the response in apiResponse (by the way, with a simple bot, you won’t really need a function response except for detecting errors).

Now that the API communication function is ready, it’s time to write the logic for the bot.

Choose the name for your processing page. In our case, it’s webhook (since requests to the address http://domain.com/webhook will be sent by a webhook). Write a handler for your URL:

                        `app.post('/webhook', async function (req, res) {

});`
                    

Inside the handler, save everything you will get into the _data_ variable:

                        `app.post('/webhook', async function (req, res) {
    const data = req.body;

});`
                    

Then parse all the messages:

                        `app.post('/webhook', async function (req, res) {
    const data = req.body;
    for (var i in data.messages) {

    }
});`
                    

Next, add information about incoming messages to variables and skip information about outgoing messages:

                        `app.post('/webhook', async function (req, res) {
    const data = req.body;
    for (var i in data.messages) {
        const author = data.messages[i].author;
        const body = data.messages[i].body;
        const chatId = data.messages[i].chatId;
        const senderName = data.messages[i].senderName;

        if(data.messages[i].fromMe)return;
    }
});`
                    

**Now the information about the author is presented in the _author_ variable, _body_ contains the text, _chatId_ — the Id of the current chat, and _senderName_ — the name of the person you are chatting with.**

Don’t forget to add the code for launching the webserver at the end of the file:

                        `app.listen(80, function () {
    console.log('Listening on port 80..');
});`
                    

You can check the work of your bot by writing the following code in the for cycle after the declared variables:

                        `console.log(senderName, author, chatId, body);`
                    

Launch the bot by using the **node index.js** command and write the following bot-message: _Test_. If everything is correct, here is what you’ll see in the console: _Eugene 79123456789@c.us 79123456789@c.us Test_

The next step (provided everything works as it should) is to remove (or comment out) the debugging line with the _console.log_. You’ll also have to decide how you will process commands.

While there are several ways to do it, we recommend using the _if else if_ construction in combination with regular expressions because, it will allow you, first, to create complex commands with arguments; second, not to deal with duplicating variables (as was the case with _switch – case_); and, third, to very easily identify a wrongly entered command (with the last _else_) and display the corresponding prompt.

Next up, we are going to look at the code nested in for. Don’t get confused 😉

First of all, write the commands’ structure:

                        `if(/help/.test(body)) {
    // This section will work when the user enters "help"
    } else if(/chatId/.test(body)) {
    // This section will work when the user enters "chatId"
    } else if(/file (pdf|jpg|doc|mp3)/.test(body)) {
    // This section will work when the user enters "file pdf, file jpg, etc"
    } else if(/ptt/.test(body)) {            
    // This section will work when the user enters "ptt"
    } else if(/geo/.test(body)) {
    // This section will work when the user enters "geo"
    } else if(/group/.test(body)) {
    // This section will work when the user enters "group"
}`
                    

Next, move on to writing the command handlers. Start with _help_ — this one is just a piece of cake.

                        ``const text = `${senderName}, this is a demo bot for https://chat-api.com/.
Commands:
1. chatId - view the current chat ID
2. file [pdf/jpg/doc/mp3] - get a file
3. ptt - get a voice message
4. geo - get a location
5. group - create a group with you and the bot`;
await apiChatApi('message', {chatId: chatId, body: text});``
                    

All you have to do is write a previously prepared text in the text variable and assign the name of the user who wrote to the bot to the _senderName_ variable.

As for the last line, it will include a call to the function working with the API where we pass the _message_ method and the object with the parameters {chatId: chatId, body: text}.

To launch the project, you can use the command **node index.js** and write _help_ to the bot.

_**By the way, in case users write something your bot can’t answer (like “Hi”, etc.), we recommend sending them the text with all the available commands. In this case, users will always have this starting message within their reach.**_

Now, it’s time to write a handler for the command _chatId_. This is pretty easy, too:

                        `await apiChatApi('message', {chatId: chatId, body: chatId});`
                    

Make a call to the API, the _message_ method, and ask it to send the text _chatId_ to the chat.

![whatsapp api](/img/node/chatid_ru.png)

This was quite easy, wasn’t it? Now, let’s dive deeper.

You are in for the most complicated part of the code — the _file_ command’s functionality. To begin with, have a good look at this line:

                        `/file (pdf|jpg|doc|mp3)/.test(body)`
                    

In short, the idea of its logic is to check if the _body_ value equals the _file_ value + one of the values in the brackets. For example, whether the _body_ value equals the _file pdf_ value or the _file jpg_ value, etc.

If it does, launch your handler. The first thing it’ll do is parse the file type and put it to the _fileType_ variable:

                        `const fileType = body.match(/file (pdf|jpg|doc|mp3)/)[1];`
                    

Consequently, the value we will have in the _fileType_ is _pdf/jpg/doc/mp3_. Now create an object with data to send:

                        `const files = {
     doc: "https://domain.com/tra.docx",
     jpg: "https://domain.com/tra.jpg",
     mp3: "https://domain.com/tra.mp3",
     pdf: "https://domain.com/tra.pdf"
};`
                    

It will allow you to get the URL address of the file by addressing its key index, for example:

                        `files["doc"] // => "https://domain.com/tra.docx"
files["mp3"] // => "https://domain.com/tra.mp3"`
                    

As a result, the _files\[fileType\]_ will return the URL of the file you need.

**UPD 2021-11-22**. We added the ability to send files with relative paths to the bot's code in the repository.

All that is left to do now is create an object of parameters to send to the API:

                        ``var dataFile = {
     phone: author,
     body: files[fileType],
     filename: `File *.${fileType}`            
};``
                    

The _phone_ variable will contain the information about the author of the message, the _body_ — a link to the file (see the API) and the _filename_ — a visible name of the file (in our example, it is the word _"File"_ and its extension).

Whenever an image is requested, you need to add the _caption_ key to the parameter object. Here is how to do it:

                        `if (fileType == "jpg") dataFile['caption'] = "Photo text";`
                    

Now add it all to the function specifying that you want to call the _sendFile_ method:

                        `await apiChatApi('sendFile', dataFile);`
                    

Now implement the _ptt_ command handler for voice messages.

                        `await apiChatApi('sendAudio', {audio: "https://domain.com//tra.ogg", chatId: chatId});`
                    

Call to the function specifying the _sendAudio_ method and the _audio_ key and providing a direct link to the file in the parameter object.

![Sending audio bot Whatsapp](/img/node/audio_ru.png)

_In this guide, all links to files are static (they call to the hosting), while the repository provides a variant of the code with relative paths. We advise you to send files in the **base64 format**. You can use our [encoding service in your personal account](https://app.chat-api.com/base64 "Encode file in Base 64")._

The _geo_ command handler is quite simple, too:

                        `await apiChatApi('sendLocation', {lat: 51.178843, lng: -1.826210, address: 'Stonehenge', chatId: chatId});`
                    

Instead of _audio_, you need to send the _lat_ and _lng_ keys that stand for the _latitude_ and _longitude_ of the place, respectively. The _address_ key must contain the address. As for the GPS coordinates, you can get them in Google Maps, for example.

Now we are left with the _group_ command that is responsible for creating a group chatbot. Its handler is not much different from the several previous ones:

                        `let arrayPhones = [ author.replace("@c.us","") ];

await apiChatApi('group', {groupName: 'Group with a bot', phones: arrayPhones, messageText: 'Welcome to the new group!'});`
                    

Create an _arrayPhones_ array. Add the _author_ variable removing _@c.us_ and leaving only the phone number in the line. You can add several phone numbers at once.

![Building WhatsApp bot on Node JS](https://chat-api.com/img/node/en/whatsapp-bot-nodejs-en.jpg)

Send a request to the function with the _group_ method specifying the _groupName_ keys — the name of the chat, the array of users in the _phones_, and the welcome text in the _messageText_.

Well, that’s pretty much it. Your handlers are ready!

All you need to do is set up your token from your personal account and instance number.  
  
[Get API key](https://app.chat-api.com)

Your free Docker hosting service!
---------------------------------

We continue to expand and improve the features of the service to make life easier for developers. Our new product is free Docker hosting for Chat API clients.

We know how often it's hard to deploy Webhook for your projects, especially if you don't have time to build your own server. That's why we're opening up the opportunity to host your applications on our Docker hosting for free.

It all works simply and we'll go through each point: 1) Check if you have Docker?; 2) Install Dockerize (a free solution for our customers); 3) Test and deploy your application on our hosting service.

Install Docker. You can do this at the [officially website](https://docs.docker.com/get-docker/). You can check if it is already installed with the command **_docker help_**

Next, install Dockerize:

                        `npm install -g @solohin/dockerize`
                    

Get a free [Docker Instance](https://app.chat-api.com) in your personal account. It's quick and easy, all you have to do is link it to your main whatsapp instance! You'll immediately get your Docker token to use for authorization:

                        `dockerize login {your_token}`
                    

![How to find the docker-instance token](/img/node/docker_token_en.jpg)

  

Let's create our app! To do this, enter this line with the name of your application:

                        `dockerize create app test-chat-api-bot`
                    

Now, in the working directory, we need to create a Dockerfile, which will contain the instructions for building the image from which the container will run. In it we will write:

                        `FROM node:14

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 80

CMD ["node", "index.js"]`
                    

Create a .dockerignore file and put some local files there that will be ignored (npm-debug.log and .idea)

It's time to test your application locally with a command: _dockerize test_

This will start your application on port 8080. Open localhost:8080 to check. Finally, let's deploy it:

                        `dockerize deploy`
                    

Your app is downloaded and available at **test-chat-api-bot.dockerize.xyz** (change to your app name in the format {name}.dockerize.xyz)

Looks pretty simple, doesn't it?

  

![A detailed guide to developing a bot in node js](https://chat-api.com/img/node/en/whatsapp-bot-nodejs-en.jpg)

Whatsapp bot on Node.JS
-----------------------

Now that we have uploaded our bot to Dockerize, don't forget to specify the resulting domain as the webhook. With every incoming message the server will receive and process the data.

The code will be available via a link to Github: [https://github.com/chatapi/whatsapp-nodejs-bot-en](https://github.com/chatapi/whatsapp-nodejs-bot-en "Example of whatsapp bot on node js")

 ![](/img/logo_small.jpg) ChatAPI

2021-11-22