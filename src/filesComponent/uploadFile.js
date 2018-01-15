module.exports = (onlinePath, localFilePath) => {
  return new Promise((resolve, reject) => {
    let filePathList = localFilePath.split('/');
    let fileName = filePathList[filePathList.length - 1];
    uploadFile(onlinePath, localFilePath, fileName, resolve, reject)
  });
};

function uploadFile(onlinePath, localPath, fileName, resolve, reject) {
  console.log('tst');
  let fileUploadOptions = new FileUploadOptions();
  fileUploadOptions.chunkedMode = false;
  fileUploadOptions.headers = {
    connection: 'close',
    Authorization: `Basic ${String(localStorage.getItem('files_authToken'))}`,
    Cookie: String(localStorage.getItem('files_cookies'))
  };
  let fileTransfer = new FileTransfer();
  let fileURLOnline = `https://drive.ichthuscollege.nl/remote.php/webdav${encodeURIComponent(onlinePath).replace(/%2F/g, "/")}${fileName}`;
  fileTransfer.upload(
    localPath,
    fileURLOnline,
    (response) => {
      //TODO handle response
    },
    (error) => {
      console.log(error)
    },
    fileUploadOptions,
    true
  )
}
