//Initialize on spreadsheet upload
function init() {
    var file = document.getElementById("xlsxUpload").files[0];
    console.log("File '" + file.name + "' uploaded successfully.");
    document.getElementById("xlsxUpload").hidden = true;
    document.getElementById("xlsxLabel").hidden = true;

    var reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = function() {
        var sheet = XLSX.read(reader.result, {type: "binary"});
        console.log(sheet);
        var cellA1 = sheet.Sheets[sheet.SheetNames[0]]["A1"].v;
        console.log(cellA1);
        var cellB1 = sheet.Sheets[sheet.SheetNames[0]]["B1"].v;
        console.log(cellB1);
        var cellC1 = sheet.Sheets[sheet.SheetNames[0]]["C1"].v;
        console.log(cellC1);
    };
}