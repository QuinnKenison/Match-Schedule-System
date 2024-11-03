//Setup
const express = require('express');
const multer = require('multer');
const { PdfReader } = require("pdfreader");
const { TableParser } = require("pdfreader");
const app = express();
const port = 3000;

//Log port
app.listen(port, function () {
    console.log("App using port " + port);
});

//Store PDF in memory
const upload = multer({ storage: multer.memoryStorage() });

//Base page with form (/)
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/form.html");
});

//Take form input, store as a variable "schedule," parse the pdf, and go to upload page (/app)
var schedule;
var currentLine = [];
var currentCell = [];
var previousCharacterX = 0;
const tableParser = new TableParser();
var table;
var pageNumber = 0;
app.post("/app", upload.single("pdfUpload"), function (req, res) {
    schedule = req.file;
    console.log(schedule.originalname);
    //Get PDF data
    new PdfReader().parseBuffer(schedule.buffer, function (err, item) {
        if (!item) {
            if (currentCell.length) { //(Have to get last cell)
                var cellString = currentCell.map(function (character) {
                    return character.text;
                }).join("");
                var cellAsItem = {
                    x: currentCell[0].x,
                    y: currentCell[0].y + (pageNumber * 1000),
                    text: cellString,
                };
                tableParser.processItem(cellAsItem);
                table = tableParser.getMatrix();
                table.forEach(function (row) {
                    row.forEach(function (cellArray) {
                        var cellText1 = cellArray[0].text;
                        var cellText2 = cellArray[1].text;
                        var cellText3 = cellArray[2].text;
                        var cellText4 = cellArray[3].text;
                        var cellText5 = cellArray[4].text;
                        console.log(cellText1 + " | " + cellText2 + " | " + cellText3 + " | " + cellText4 + " | " + cellText5);
                    });
                });
            }
        } else if (item.text) {
            if (currentLine.length && currentLine[0].y == item.y) { //Same row
                if (item.x - previousCharacterX <= 1) { //Same cell
                    currentCell.push(item);
                } else { //New cell
                    var cellString = currentCell.map(function (character) {
                        return character.text;
                    }).join("");
                    var cellAsItem = {
                        x: currentCell[0].x,
                        y: currentCell[0].y + (pageNumber * 1000),
                        text: cellString,
                    };
                    tableParser.processItem(cellAsItem);
                    currentCell = [];
                    currentCell.push(item);
                }
            } else { //New row
                if (currentCell.length) { //(Have to get first cell of row)
                    var cellString = currentCell.map(function (character) {
                        return character.text;
                    }).join("");
                    var cellAsItem = {
                        x: currentCell[0].x,
                        y: currentCell[0].y + (pageNumber * 1000),
                        text: cellString,
                    };
                    tableParser.processItem(cellAsItem);
                }
                currentCell = [];
                currentCell.push(item);
                currentLine = [];
            }
            previousCharacterX = item.x;
            currentLine.push(item);         
        } else if (item.page) {
            if (currentCell.length) { //(Have to last cell of page)
                var cellString = currentCell.map(function (character) {
                    return character.text;
                }).join("");
                var cellAsItem = {
                    x: currentCell[0].x,
                    y: currentCell[0].y + (pageNumber * 1000),
                    text: cellString,
                };
                tableParser.processItem(cellAsItem);
            }
            currentCell = [];
            currentCell.push(item);
            currentLine = [];
            pageNumber = pageNumber + 1;
        }
    });
    res.sendFile(__dirname + "/app.html");
});