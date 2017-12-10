/**
 * Created by Nathan on 24-9-2017.
 */
const {Page, Action, CollectionView, ui, ImageView, TextView, Composite} = require('tabris');
const IndeterminateProgressBar = require('../widgets/IndeterminateProgressBar');
const colors = require('../appSettings/colors');
const initialPageTitle = 'Bestanden';
const showToast = require('../globalFunctions/showToast');
const getFiles = require('./getFiles');
const downloadFile = require('./downloadFile');



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
    new Action({
      id: 'actionCreateFolder',
      title: 'Nieuwe map',
      image: 'src/img/ic_create_new_folder_white.png'
    }).on('select', () => {
      function onButtonPress(results) {
        if(results.buttonIndex === 1){
          this._createDir(path, results.input1)
        }
      }
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
      console.log('test', this._activePage)
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
      }).appendTo(page)
  }

  _onSelectFile(file){
    this._progessBar = new IndeterminateProgressBar({left: 0, right: 0, top: 0, height: 4}).appendTo(this._activePage);
    console.log(file);
    if(file.dir){
      getFiles(file.path).then((files) => {
        this._createNewFilesPage(file.path, files, file.name)
      });
    }else if(file.img){

    }else{
      downloadFile(file)
    }
  }

  _createDir(path, name){}

  _uploadFile(path){}



}

module.exports = (rootNavigationView) => {
  let filesPage = new FilesPage().appendTo(rootNavigationView);
};
