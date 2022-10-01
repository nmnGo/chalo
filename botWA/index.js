const config = require("./config.js");
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const { token, botUrl, apiUrl } = config;
const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + "/files"));

process.on("unhandledRejection", (err) => {
  console.log(err);
});

app.get("/", function (req, res) {
  res.send("It's working.");
});

app.post("/webhook", async function (req, res) {
  const data = req.body;
  for (let i in data.messages) {
    const author = data.messages[i].author;
    const body = data.messages[i].body;
    const chatId = data.messages[i].chatId;
    const senderName = data.messages[i].senderName;
    if (data.messages[i].fromMe) continue;

    if (/help/.test(body)) {
      const text = `${senderName},  this is a demo bot for https://chat-api.com/.
            Commands:
            1. chatId - view the current chat ID
            2. file [pdf/jpg/doc/mp3] - get a file
            3. ptt - get a voice message
            4. geo - get a location
            5. group - create a group with you and the bot`;
      await apiChatApi("message", { chatId: chatId, body: text });
    } else if (/chatId/.test(body)) {
      await apiChatApi("message", { chatId: chatId, body: chatId });
    } else if (/file (pdf|jpg|doc|mp3)/.test(body)) {
      const fileType = body.match(/file (pdf|jpg|doc|mp3)/)[1];
      const files = {
        doc: botUrl + "/tra.docx",
        jpg: botUrl + "/tra.jpg",
        mp3: botUrl + "/tra.mp3",
        pdf: botUrl + "/tra.pdf",
      };
      let dataFile = {
        phone: author,
        body: files[fileType],
        filename: `File *.${fileType}`,
      };
      if (fileType === "jpg") dataFile["caption"] = "Text under the photo.";
      await apiChatApi("sendFile", dataFile);
    } else if (/ptt/.test(body)) {
      await apiChatApi("sendAudio", {
        audio: botUrl + "/tra.ogg",
        chatId: chatId,
      });
    } else if (/geo/.test(body)) {
      await apiChatApi("sendLocation", {
        lat: 51.178843,
        lng: -1.82621,
        address: "Stonehenge",
        chatId: chatId,
      });
    } else if (/group/.test(body)) {
      let arrayPhones = [author.replace("@c.us", "")];
      await apiChatApi("group", {
        groupName: "Bot group",
        phones: arrayPhones,
        messageText: "Welcome to the new group!",
      });
    }
  }
  res.send("Ok");
});

app.listen(80, function () {
  console.log("Listening on port 80..");
});

async function apiChatApi(method, params) {
  const options = {};
  options["method"] = "POST";
  options["body"] = JSON.stringify(params);
  options["headers"] = { "Content-Type": "application/json" };

  const url = `${apiUrl}/${method}?token=${token}`;

  const apiResponse = await fetch(url, options);
  try {
    return await apiResponse.json();
  } catch (e) {
    return "error";
  }
}
