//Initialize on spreadsheet upload
function init() {
    var file = document.getElementById("xlsxUpload").files[0];
    console.log("File '" + file.name + "' uploaded successfully.");
}