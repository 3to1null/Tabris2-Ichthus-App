/**
 * Created by Nathan on 24-9-2017.
 */
const {Page, CollectionView, Composite, TextView, Switch, Picker, app, ActionSheet} = require('tabris');
const colors = require('../appSettings/colors');
const initialPageTitle = 'Instellingen';
const globalSettings = require('../appSettings/globalSettings.json');
const FlatButton = require('../widgets/FlatButton');
const showToast = require('../globalFunctions/showToast');
const headerHeight = 24;
const settingHeight = 48;

class SettingsPage extends Page {
  constructor(properties) {
    super(Object.assign(
      {title: initialPageTitle, background: colors.white_bg, autoDispose: false},
      properties));

    this._renderSettings();

    this._logPage();
    this.on('appear', () => {
      this._logPage()
    })
  }

  _logPage(){
    firebase.Analytics.screenName = "settingsScreen";
    firebase.Analytics.logEvent('settingsScreen_opened', {screen: 'cijferScreen'});
  }

  _renderSettings(){
    new CollectionView({
      left: 0, right: 0, top: 0, bottom: 0,
      itemCount: globalSettings.length,
      cellType: index => globalSettings[index].type,
      cellHeight: (index, cellType) => cellType === 'header' ? headerHeight : settingHeight,
      createCell: (cellType) => {
        let cell = new Composite();
        if(cellType !== "header" && cellType !== "confirm"){
          console.log('test');
          let descriptionRightMargin = 100;
          let description = new TextView({
            centerY: 0, left: 25, right: descriptionRightMargin,
            font: '15px',
            textColor: colors.black
          }).appendTo(cell);
          new tabris.Composite({
            left: 0, bottom: 0, right: 0, height: 1,
            background: colors.divider
          }).appendTo(cell);
          if(cellType === "boolSwitch"){
            let boolSwitch = new Switch({
              centerY: 0, right: 20
            }).appendTo(cell);
          }else if(cellType === "picker"){
            let picker = new Picker({
              centerY: 0, right: 20,
              itemText: (index) => globalSettings[index].name,
              alignment: "right",
              textColor: colors.accent,
            }).appendTo(cell)
          }
        }else if(cellType === 'header'){
          let header = new TextView({
            bottom: 0, left: 10,
            textColor: colors.accent,
            font: "bold 14px"
          }).appendTo(cell)
        }else if(cellType === 'confirm'){
          cell = new FlatButton({
            background: colors.white_bg,
            textAlignment: 'left',
            textLeftMargin: 25,
            highlightColor: colors.black_grey,
            font: '15px',
            textColor: colors.black,
            maxLines: 3
          })
        }
        return cell;
      },
      updateCell: (cell, index) => {
        let settingItem = globalSettings[index];
        if(settingItem.isHeader){
          cell.children()[0].text = settingItem.header
        }else if(settingItem.type !== "confirm"){
          cell.children()[0].text = settingItem.desc;
          if(settingItem.type === "boolSwitch"){
            if(localStorage.getItem(settingItem.storageKey) !== null){
              cell.children()[2].checked = Boolean(localStorage.getItem(settingItem.storageKey))
            }else{
              cell.children()[2].checked = Boolean(settingItem.default)
            }
            cell.children()[2].on('checkedChanged', this._handleBoolSwitchSelectionChange)
          }else if(settingItem.type === "picker"){
            cell.children()[2].itemCount = settingItem.options.length;
            cell.children()[2].itemText = (index) => settingItem.options[index].name;
            if(localStorage.getItem(settingItem.storageKey) !== null){
              cell.children()[2].selectionIndex = settingItem.options.index(localStorage.getItem(settingItem.storageKey))
            }else{
              cell.children()[2].selectionIndex = parseInt(settingItem.default)
            }
            cell.children()[2].on('selectionIndexChanged', this._handlePickerSelectionChange)
          }
        }else{
          //confirm setting type
          cell.text = settingItem.desc;
        }
      }
    }).on("select", ({index}) => {
      let settingItem = globalSettings[index];
      if(settingItem.type === "confirm"){
        let popupDetails = settingItem.confirmPopup;
        new ActionSheet({
          title: popupDetails.title,
          message: popupDetails.message,
          actions: popupDetails.actions,
        }).on('select', this._onConfirmSelect(popupDetails.confirmFunction)).open()
      }
    }).appendTo(this)
  }

  _handleBoolSwitchSelectionChange(){}

  _handlePickerSelectionChange(){}

  _onConfirmSelect(confirmFunction){
    //TODO maybe remove toasts from this function?
    let confirmFunctions = {
      'confirmLogout': ({index}) => {
        //Uitloggen selected
        if(index === 1){
          //TODO: create global logout function
          localStorage.clear();
          app.reload()
        }
      },
      'deleteAllDownloadedFiles': ({index}) => {
        if(index === 1){
          //TODO create global file delete function
          window.resolveLocalFileSystemURL(
            cordova.file.externalRootDirectory,
            function(entry){
              entry.getDirectory('Schoolbestanden', {create:false}, function(dirEntry){
                dirEntry.removeRecursively(
                  function(){
                    showToast('Bestanden verwijderd.')
                  },
                  function(error){
                    showToast('Er is iets fouts gegaan bij het verwijderen van de bestanden. (' + error.code + ')')
                  }
                )
              })
            }
          )
        }
      }
    };
    return confirmFunctions[confirmFunction]
  }

}

module.exports = (rootNavigationView) => {
  let cijferPage = new SettingsPage().appendTo(rootNavigationView);
};
