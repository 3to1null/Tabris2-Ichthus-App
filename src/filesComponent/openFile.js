module.exports = (fileEntry) => {
  //Get MIME type.
  fileEntry.file(
    //Succes function, passes a File object.
    (file) => {
      cordova.plugins.fileOpener2.open(
        decodeURIComponent(fileEntry.toURL()),
        file.type,
        {
          success: () => {},
          error: () => {}
        }
      )
    },
    (error) => {
      console.log(error)
    }
  )
};
