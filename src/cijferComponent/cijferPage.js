/**
 * Created by Nathan on 24-9-2017.
 */
const {Page, TabFolder, Tab, CollectionView, Canvas, Composite, device, TextView} = require('tabris');
const IndeterminateProgressBar = require('../widgets/IndeterminateProgressBar');
const colors = require('../appSettings/colors');
const getCijfers = require('./getCijfers');
const initialPageTitle = 'Cijferlijsten';
const showToast = require('../globalFunctions/showToast');
const cijferDetailsPage = require('./cijferDetailsPage');
const createCircleIcon = require('../globalFunctions/createIconCircle');

const tabs = ['Periode 1', 'Periode 2', 'Periode 3', 'Examendossier'];

class CijferPage extends Page {
  constructor(properties) {
    super(Object.assign({title: initialPageTitle, autoDispose: false}, properties));

    this._tabList = [];
    this._renderedTabs = [];
    this._createTabFolder();
    this._renderCijferlijst(0);
    this._renderCijferlijst(1);

    this._logPage();

    this.on('appear', () => {
      this._logPage()
    })
  }

  _logPage(){
    firebase.Analytics.screenName = "cijferScreen";
    firebase.Analytics.logEvent('cijferpage_opened', {screen: 'cijferScreen'});
    firebase.Analytics.logEvent('cijfertab1_opened', {screen: 'cijferScreen'});
  }

  _createTab(tab) {
    let tmp_tab = new Tab({
      title: tab,
      id: `cijferTab${tab}`,
      background: colors.white_bg,
    });
    this._tabList.push(tmp_tab);
    tmp_tab.appendTo(this.tabFolder);
  }

  _createTabFolder() {
    this.tabFolder = new TabFolder({
      left: 0, right: 0, top: 0, bottom: 0,
      textColor: colors.white_bg,
      paging: true,
      tabMode: 'scrollable',
      background: colors.UI_bg
    });

    for (let i = 0; i < tabs.length; i++) {
      this._createTab(tabs[i]);
    }
    this.tabFolder.on('selectionChanged', ({value: tab}) => {
      switch(tab.id.substr(tab.id.length - 1)){
        case 'r':
          firebase.Analytics.logEvent('cijfertab3_opened', {screen: 'cijferScreen'});
          this._loadTab(3);
          this._loadTab(2);
          break;
        default:
          firebase.Analytics.logEvent(`cijfertab${String((parseInt(tab.id.substr(tab.id.length - 1))-1))}_opened`, {screen: 'cijferScreen'});
          this._loadTab(parseInt(tab.id.substr(tab.id.length - 1))-1);
          this._loadTab(parseInt(tab.id.substr(tab.id.length - 1)));
      }
    });

    this.tabFolder.appendTo(this);
  }

  _loadTab(tabNum){
    if(!this._renderedTabs.includes(parseInt(tabNum))){
      this._renderCijferlijst(tabNum)
    }
  }

  // _checkIfNewMarks(newJson, oldJson){
  //   if(newJson === oldJson){
  //     return false
  //   }else{
  //     let notEqualIndexList = []
  //     for (let vakIndex = 0; vakIndex < newJson.length; vakIndex++){
  //       if(newJson[vakIndex] !== oldJson[vakIndex]){
  //
  //       }
  //     }
  //   }
  // }

  //tabNum is an integer 0,1,2,3 => corresponds with index of tabfolder.
  _renderCijferlijst(tabNum) {
    let progessBar = new IndeterminateProgressBar({left: 0, right: 0, top: 0, height: 4}).appendTo(this._tabList[tabNum]);
    this._renderedTabs.push(tabNum);
    //tabNum + 1 == periode
    getCijfers(tabNum + 1, true, false).then((json) => {
      let cijferItems;
      cijferItems = json;
      if(parseInt(tabNum) === 3 && String(JSON.stringify(cijferItems)) === '[]'){
        showToast('Het lijkt erop dat er nog geen cijfers in je examendossier zijn ingevuld.')
      }
      let cijferlijstCollectionView = new CollectionView({
        top: 0, left: 0, right: 0, bottom: 0,
        class: 'cijferlijstCollection',
        columnCount: 1,
        refreshEnabled: true,
        itemCount: cijferItems.length,
        highlightOnTouch: true,
        cellType: (index) => {
          return cijferItems[index].average;
        },
        createCell: (celltype) => {
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
          let canvasCijfer = new Canvas({
            top: 0,
            left: 12,
            width: 42,
            height: 50,
          });
          canvasCijfer.appendTo(cellContainer);
          createCircleIcon(canvasCijfer, celltype, 'small');
          new TextView({
            left: 45+24,
            right: 0,
            centerY: 0,
            font: '16px'
          }).appendTo(cellContainer);
          new Composite({
            left: 45+24,
            right: 0,
            height: 1,
            bottom: 0,
            background: colors.white_white_grey_bg
          }).appendTo(cellContainer);

          return cellContainer
        },
        updateCell: (cell, index) => {
          cell.apply({
            TextView: {text: cijferItems[index].subject}
          });
        }
      }).on('select', ({index}) => {
        let cijfers = cijferItems[index];
        if(cijfers.average === '-'){
          showToast(`Er zijn nog geen cijfers beschikbaar voor ${cijfers.subject}.`)
        }else{
          cijferDetailsPage(cijferItems[index])
        }
      }).on('refresh', (eventObject) => {
        firebase.Analytics.logEvent('start_refresh_cijferlijst', {screen: 'cijferScreen'});
          getCijfers(tabNum + 1, false, false).then((json) => {
            let oldCijferItems = cijferItems;
            cijferItems = json;
            if(cijferItems !== oldCijferItems){
              eventObject.target.remove(0,oldCijferItems.length);
              eventObject.target.insert(0, cijferItems.length);
            }
            eventObject.target.refreshIndicator = false;

            firebase.Analytics.logEvent('refreshed_cijferlijst', {screen: 'cijferScreen'});
          })
      }).appendTo(this._tabList[tabNum]);
      progessBar.dispose();

      //downloads updated cijfers:
      getCijfers(tabNum + 1, false, false).then((json) => {
        let oldCijferItems = cijferItems;
        cijferItems = json;
        if(cijferItems !== oldCijferItems){
          cijferlijstCollectionView.remove(0,oldCijferItems.length);
          cijferlijstCollectionView.insert(0, cijferItems.length);
        }
      })
    });



  }

}

module.exports = (rootNavigationView) => {
  let cijferPage = new CijferPage().appendTo(rootNavigationView);
};
