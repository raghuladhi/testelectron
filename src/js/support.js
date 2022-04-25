const remote = require('@electron/remote')
const AdmZip = require('adm-zip');
const { shell } = require('electron');


const dialog = remote.dialog;
var fs = require('fs'); 
let files = [], supportName = "";
const filesDir= './files/support';
const fullPath = __dirname+'/../..';


const fileInput = document.getElementById("filelabel");
const supportTextInput = document.getElementById("supporttext");
const fileNameText = document.getElementById("filenametext");
const uploadBtn = document.getElementById("upload-btn");
const table = document.getElementById("filesTable");

fileInput.addEventListener("click",()=>{
    dialog.showOpenDialog( {
        properties: ['openFile']
      }).then(result => {
        if(!result.canceled) {
            supportName = supportTextInput.value;
            fileNameText.innerText = "File(s) Selected";
            files = [...result.filePaths];
        }
      }).catch(err => {
        console.log(err)
      })
});

const successMessageText = document.getElementsByClassName("success")[0];
const failureMessageText = document.getElementsByClassName("failure")[0];

function handleFileUploadSuccess() {
    failureMessageText.style.display = "none";
    successMessageText.style.display = "block";
}

function handleFileUploadFailure() {
    failureMessageText.style.display = "block";
    successMessageText.style.display = "none";
}
function clearInputs() {
    supportTextInput.value = '';
    fileNameText.innerText = "No File Chosen";
}

uploadBtn.addEventListener("click", ()=> {
    if(files.length && supportTextInput.value != "") {
        files.forEach((filepath, index) => {
            fs.readFile(filepath, 'utf-8', (err, data) => {
                if(err){
                    handleFileUploadFailure();
                    return;
                }
                const file = new AdmZip();
                file.addFile('document.json', Buffer(data));
                const fileName = filepath.substring(filepath.lastIndexOf("/")+1,filepath.lastIndexOf("."));

                if (!fs.existsSync(filesDir)){
                    fs.mkdirSync(filesDir,{ recursive: true });
                }
                const supportDir = filesDir +'/'+ supportName;
                if (!fs.existsSync(supportDir)){
                    fs.mkdirSync(supportDir,{ recursive: true });
                }
                fs.writeFile(supportDir+'/'+fileName+'.docx', file.toBuffer(), err => {
                    if (err) {
                      handleFileUploadFailure();
                      return
                    }
                    //file written successfully
                    handleFileUploadSuccess();
                    clearInputs();
                });
                
            });
        });
        
    } else {
        handleFileUploadFailure();
    }
})


const downloadBtn = document.getElementById("download-btn");
const ticketIdText = document.getElementById("downloadsupport");
const fetchFailureDiv = document.querySelector(".fetchFailure");
function createSupportRow(name) {
    const htmlStr = '<tr class="filerow"><td><div class="cell"><div class="filename">'+name+'</div><div class="btns-container"><div class="btn btn-open" >View in Explorer</div><div class="btn btn-delete">Delete</div></div></div></td></tr>';
    const template = document.createElement("template");
    template.innerHTML = htmlStr;
    return template;
}
function hideTable() {
    table.style.display = "none";
}
function handleFolderFailure() {
    fetchFailureDiv.style.display = "block";
    hideTable();
}
downloadBtn.addEventListener("click",()=>{
    const ticketId = ticketIdText.value;
    if(ticketId.length){
        const supportDir =  filesDir +'/'+ ticketId;
        fs.readdir(supportDir, function (err, files) {
            //handling error
            if (err) {
                handleFolderFailure();
                return;
            } 
            fetchFailureDiv.style.display = "none";
            const rowDivs = [...document.getElementsByClassName("filerow")];
            rowDivs.forEach(row=>row.remove());
            //listing all files using forEach
            files.forEach(function (file) {
                const rowDiv = createSupportRow(file);
                const filePath = supportDir + '/' + file;
                const showBtn = rowDiv.content.querySelector(".btn-open");
                const deleteBtn = rowDiv.content.querySelector(".btn-delete");
                showBtn.addEventListener("click",()=>shell.showItemInFolder(fullPath+'/'+filePath));
                deleteBtn.addEventListener("click",()=>{
                    fs.unlink(filePath, ()=>{
                        if (err) throw err;
                        fs.readdir(supportDir, (err, files) => {
                            if(files.length == 0){
                                fs.rmdir(supportDir, err => {
                                    if(err) throw err
                                    hideTable();
                                });
                            }
                        });
                        deleteBtn.parentElement.parentElement.parentElement.parentElement.remove();
                        
                    });                    
                });
                table.children[0].appendChild(rowDiv.content);
                table.style.display = "block";
            });
        });
    } else {
        handleFolderFailure();
    }
});