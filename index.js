//Setup
const express = require('express')
const multer  = require('multer')
const app = express()
const port = 3000

//Log port
app.listen(port, function() {
    console.log("App using port " + port)
})

//Store PDF in memory
const upload = multer({ storage: multer.memoryStorage() });

//Base page with form (/)
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/form.html")
})

//Take form input, store as a variable "schedule," and go to upload page (/upload)
var schedule;
app.post("/upload", upload.single("pdfUpload"), function(req, res) {
    schedule = req.file;
    console.log(schedule.originalname);
    res.sendFile(__dirname + "/app.html");
})