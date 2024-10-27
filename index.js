//Setup
const express = require('express')
const multer  = require('multer')
const { PdfReader } = require("pdfreader");
const fileSystem = require("fs");
const app = express()
const port = 3000

//Log port
app.listen(port, function () {
    console.log("App using port " + port)
});

//Store PDF in memory
const upload = multer({ storage: multer.memoryStorage() });

//Base page with form (/)
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/form.html")
});

//Take form input, store as a variable "schedule," and go to upload page (/app)
var schedule;
app.post("/app", upload.single("pdfUpload"), function (req, res) {
    schedule = req.file;
    console.log(schedule.originalname);
    //Get PDF data
    new PdfReader().parseBuffer(schedule.buffer, function (err, pdf) {
        if (pdf && pdf.text) {
            console.log(pdf.text);
        }
    });
    res.sendFile(__dirname + "/app.html");
});