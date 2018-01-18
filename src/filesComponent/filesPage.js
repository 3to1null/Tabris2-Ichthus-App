/**
 * Created by Nathan on 24-9-2017.
 */
const {Page, Action, CollectionView, ui, ImageView, TextView, Composite, ActionSheet} = require('tabris');
const IndeterminateProgressBar = require('../widgets/IndeterminateProgressBar');
const colors = require('../appSettings/colors');
const initialPageTitle = 'Bestanden';
const showToast = require('../globalFunctions/showToast');
const getFiles = require('./getFiles');
const downloadFile = require('./downloadFile');
const uploadFile = require('./uploadFile');
const openFile = require('./openFile');
const Request = require('../globalFunctions/Request');




class FilesPage extends Page {
  constructor(properties) {
    super(Object.assign({title: initialPageTitle, autoDispose: false}, properties));

    this._activePage = this;
    this._progessBar = new IndeterminateProgressBar({left: 0, right: 0, top: 0, height: 4}).appendTo(this._activePage);


    getFiles('/').then((files) => {
      this._renderFiles('/', files, this)
    });

    this._logPage();

    this.on('appear', () => {
      this._activePage = this;
      this._logPage();
      this._createActions('/');
    });
    this.on('disappear', () => {
      this._disposeActions();
    })
  }

  _logPage(){
    firebase.Analytics.screenName = "filesScreen";
    firebase.Analytics.logEvent('filespage_opened', {screen: 'filesScreen'});
  }

  _createActions(path){
    //TODO: update images to higher res.
    new Action({
      id: 'actionCreateFolder',
      title: 'Nieuwe map',
      image: 'src/img/ic_create_new_folder_white.png'
    }).on('select', () => {
      let outerScope = this;
      function onButtonPress(results) {
        if(results.buttonIndex === 1){
          outerScope._progessBar = new IndeterminateProgressBar({left: 0, right: 0, top: 0, height: 4}).appendTo(outerScope._activePage);
          outerScope._createDir(path, results.input1).then((files) => {
            outerScope._createNewFilesPage(`${path}${results.input1}/`, files, results.input1);
            outerScope._progessBar.dispose();
          })
        }
      }
      // TODO: add callback, so the folder actually gets created
      navigator.notification.prompt(
        'Hoe moet de map genoemd worden?',
        onButtonPress,
        'Nieuwe map',
        ['Maken','Annuleren'],
        'Nieuwe map'
      );
    }).appendTo(this.parent());

    new Action({
      id: 'actionUploadFile',
      title: 'Upload bestand',
      image: 'src/img/ic_file_upload_white.png'
    }).on('select', () => {
      this._uploadFile(path)
    }).appendTo(this.parent())
  }

  _disposeActions(){
    ui.find('#actionCreateFolder').dispose();
    ui.find('#actionUploadFile').dispose();
  }

  _createNewFilesPage(path, files, pageTitle){
    let newFilesPage = new Page({
      title: pageTitle || path
    });
    newFilesPage.on('appear', () => {
      this._activePage = newFilesPage;
      this._createActions(path)
    });
    newFilesPage.on('disappear', () => {
      this._disposeActions()
    });
    newFilesPage.appendTo(ui.contentView.find('#rootNavigationView'));
    this._renderFiles(path, files, newFilesPage)
  }

  _renderFiles(path, files, page){
    if(this._progessBar){this._progessBar.dispose()}
      new CollectionView({
        top: 0, left: 0, right: 0, bottom: 0,
        itemCount: files.length,
        highlightOnTouch: true,
        refreshEnabled: true,
        createCell: () => {
          let cellContainer;
          if(device.version >= 23){
            cellContainer = new Composite({highlightOnTouch:true});
          }else{
            //FUCKING HIGHLIGHT ON TOUCH SHIT BECAUSE IT DOESN'T FUCKING WORK FOR ANDROID 4!!
            cellContainer = new Composite({}).on('touchStart', ()=>{
              cellContainer.background = colors.white_grey_bg;
            }).on('touchEnd', ()=>{
              cellContainer.background = colors.transparant;
            }).on('touchCancel', ()=>{
              cellContainer.background = colors.transparant;
            });
          }
          //easyfix so cellcontainer gets height of at least 45.
          new Composite({
            height: 45, right: 0, top: 0, width: 1,
          }).appendTo(cellContainer);
          new ImageView({
            left: 16, width: 34, height: 34, centerY: 0
          }).appendTo(cellContainer);
          new TextView({
            centerY: 0, left: 66,
            maxLines: 1,
            font: '16px',
            textColor: colors.black,
          }).appendTo(cellContainer);
          new Composite({
            left: 66, bottom: 0, right: 0, height: 1,
            background: colors.divider_2
          }).appendTo(cellContainer);
          return cellContainer
        },
        updateCell: (cell, index) => {
          let image;
          if(files[index].dir){
            image = {src: 'src/img/ic_folder_teal.png'}
          }else{
            image = {src: 'src/img/ic_insert_drive_file_teal.png'}
          }
          cell.apply({
            TextView: {text: files[index].name},
            ImageView: {image: image}
          })
        }
      }).on('select', ({index}) => {
          this._onSelectFile(files[index])
      }).on('refresh', (eventObject) =>{
        getFiles(path).then((newFiles) => {
          //TODO: Check which files changed.
          eventObject.target.remove(0, files.length);
          eventObject.target.insert(0, newFiles.length);
          files = newFiles;
          eventObject.target.refreshIndicator = false;
        })
      }).appendTo(page)
  }

  _createDir(path, name){
    return new Promise((resolve, reject) => {
      new Request('files/mkdir', {path: path, dirName: name}).post().then((response) =>{response.json().then((json) => {
        //TODO: Error handling
        //TODO: Force refresh
        let newDirPath = `${path}${name}/`;
        resolve(json.files, newDirPath, name)
      })})
    })
  }

  _onSelectFile(file){
    this._progessBar = new IndeterminateProgressBar({left: 0, right: 0, top: 0, height: 4}).appendTo(this._activePage);
    if(file.dir){
      getFiles(file.path).then((files) => {
        this._createNewFilesPage(file.path, files, file.name)
      });
    //}else if(file.img){
    // custom handler for images?
    }else{
      downloadFile(file).then(({name, entry}) => {
        this._progessBar.dispose();
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
            }).on('select', ({index}) => {
              if(index === 0){openFile(entry)}
            }).open()
          }
        )
      })
    }
  }

  _uploadFile(path){
    window.OurCodeWorld.Filebrowser.filePicker.single({
      success: function(data){
        // Array with the file path
        // ["file:///storage/emulated/0/360/security/file.txt"]
        if(!data.length){
          // No file selected
          return;
        }else{
          uploadFile(path, data[0]).then()
        }

      },
      error: function(err){
        console.log(err);
      }
    });
  }



}

module.exports = (rootNavigationView) => {
  let filesPage = new FilesPage().appendTo(rootNavigationView);
};
