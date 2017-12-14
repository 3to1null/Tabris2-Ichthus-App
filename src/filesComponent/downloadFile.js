const showToast = require('../globalFunctions/showToast');
const {ActionSheet} = require('tabris');

let errorMessage = 'Er is iets fout gegaan.';

module.exports = (fileData) => {
  return new Promise((resolve, reject) => {
    window.resolveLocalFileSystemURL(
      cordova.file.externalRootDirectory,
      function (Entry) {
        Entry.getDirectory('Schoolbestanden', {create: true}, function (dirEntry) {
          dirEntry.getFile(fileData.name, {create: true, exclusive: false}, function (fileEntry) {
            downloadFile(fileData.name, fileEntry, fileData.pathTo, resolve, reject);
          }, function () {
            showToast(errorMessage);
            console.log('error creating file');
          });
        });
      }
    );
  })
};

function downloadFile(name, localPath, pathTo, resolve, reject) {
    let fileUploadOptions = new FileUploadOptions();
    fileUploadOptions.chunkedMode = false;
    fileUploadOptions.headers = {
      connection: 'close',
      Authorization: `Basic ${String(localStorage.getItem('files_authToken'))}`,
      Cookie: String(localStorage.getItem('files_cookies'))
    };
    let fileTransfer = new FileTransfer();
    let fileURLServer = `https://drive.ichthuscollege.nl/remote.php/webdav${encodeURIComponent(pathTo).replace(/%2F/g, '/')}${encodeURIComponent(name)}`;
    let fireURLLocal = localPath.toURL();

    fileTransfer.download(
      fileURLServer,
      fireURLLocal,
      (entry) => {
        resolve({entry: entry, name: name})
      },
      (error) => {
        showToast(errorMessage);
        reject({entry: entry, name: name});
      },
      true, //whether or not to trust all hosts
      fileUploadOptions
    );
}
