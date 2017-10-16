/**
 * Created by Nathan on 24-9-2017.
 */
const {Page, TabFolder, Tab} = require('tabris');
const IndeterminateProgressBar = require('../widgets/IndeterminateProgressBar');
const colors = require('../appSettings/colors');
const getCijfers = require('./getCijfers');
const initialPageTitle = 'Cijferlijsten';

const tabs = ['P1', 'P2', 'P3', 'Dossier'];

class CijferPage extends Page {
  constructor(properties) {
    super(Object.assign({title: initialPageTitle, autoDispose: false}, properties));
    this.progessBar = new IndeterminateProgressBar({left: 0, right: 0, top: 0, height: 4}).appendTo(this);
    this._createTabFolder()
  }

  _createTabFolder(){
    function createTab(tab) {
      console.log(tab)
    }
    this._tabFolder = new TabFolder({
      top: 0, left: 0, bottom: 0, right: 0,
      background: colors.UI_bg,
      textColor: colors.white_bg
    });
    for(let tab in tabs){
      createTab(tab)
    }
  }
}

module.exports = (rootNavigationView) => {
  let cijferPage = new CijferPage().appendTo(rootNavigationView);
};
