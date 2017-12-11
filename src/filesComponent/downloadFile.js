const showToast = require('../globalFunctions/showToast');
const {ActionSheet} = require('tabris');

let errorMessage = 'Er is iets fout gegaan.';

module.exports = (fileData) => {
  window.resolveLocalFileSystemURL(
    cordova.file.externalRootDirectory,
    function(Entry){
      Entry.getDirectory('Schoolbestanden', {create:true}, function(dirEntry){
        dirEntry.getFile(fileData.name, {create: true, exclusive: false},function(fileEntry){
          download_and_open_file(fileData.name, fileEntry, fileData.pathTo);
        }, function(){
          showToast(errorMessage);
          console.log("error creating file")
        })
      })
    }
  )
};
function download_and_open_file(name, localPath, pathTo){
  let fileUploadOptions = new FileUploadOptions();
  fileUploadOptions.chunkedMode = false;
  fileUploadOptions.headers = {
    connection: "close",
    Authorization: `Basic ${String(localStorage.getItem('files_authToken'))}`,
    Cookie: String(localStorage.getItem('files_cookies'))
  };
  let fileTransfer = new FileTransfer();
  let fileURLServer = `https://drive.ichthuscollege.nl/remote.php/webdav${encodeURIComponent(pathTo).replace(/%2F/g, "/")}${encodeURIComponent(name)}`;
  let fireURLLocal = localPath.toURL();

  fileTransfer.download(
    fileURLServer,
    fireURLLocal,
    (entry) => {
      //Open file, maybe this should be done in a separate function?
      window.cordova.plugins.FileOpener.canOpenFile(
        decodeURIComponent(entry.toURL()),
        () => {
          new ActionSheet({
            title: name,
            message: `Wil je ${name} openen?`,
            actions: [
              {title: 'Open'},
              {title: 'Annuleren', style: 'cancel'}
            ]
          }).open()
        }
      )
    },
    (error) => {
      showToast(errorMessage);
      console.log(error);
    },
    true, //whether or not to trust all hosts
    fileUploadOptions
  )
}
