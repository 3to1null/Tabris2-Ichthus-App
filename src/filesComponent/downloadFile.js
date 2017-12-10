module.exports = (fileData) => {
  window.resolveLocalFileSystemURL(
    cordova.file.externalRootDirectory,
    function(Entry){
      Entry.getDirectory('Schoolbestanden', {create:true}, function(dirEntry){
        dirEntry.getFile(fileData.name, {create: true, exclusive: false},function(fileEntry){
          download_and_open_file(fileData.name, fileEntry, fileData.pathTo);
        }, function(){
          console.log("error creating file")
        })
      })
    }
  )
};
function download_and_open_file(name, localPath, pathTo){
  // TODO: Add auth.
  let fileUploadOptions = new FileUploadOptions();
  fileUploadOptions.chunkedMode = false;
  fileUploadOptions.headers = {
    connection: "close"
  };
  let fileTransfer = new FileTransfer();
  let fileURLServer = `https://drive.ichthuscollege.nl/remote.php/webdav${encodeURIComponent(pathTo).replace(/%2F/g, "/")}${encodeURIComponent(name)}`
  let fireURLLocal = localPath.toURL()

  fileTransfer.download(
    fileURLServer,
    fireURLLocal,
    (entry) => {
      console.log(entry)
    },
    (error) => {
      console.log(error)
    },
    false, //whether or not to trust all hosts
    fileUploadOptions
  )
}
