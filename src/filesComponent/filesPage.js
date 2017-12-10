/**
 * Created by Nathan on 24-9-2017.
 */
const {Page, Action, CollectionView, ui} = require('tabris');
const IndeterminateProgressBar = require('../widgets/IndeterminateProgressBar');
const colors = require('../appSettings/colors');
const initialPageTitle = 'Bestanden';
const showToast = require('../globalFunctions/showToast');



class FilesPage extends Page {
  constructor(properties) {
    super(Object.assign({title: initialPageTitle, autoDispose: false}, properties));

    this._logPage();

    this.on('appear', () => {
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

  _createDir(path, name){}

  _uploadFile(path){}


}

module.exports = (rootNavigationView) => {
  let filesPage = new FilesPage().appendTo(rootNavigationView);
};
