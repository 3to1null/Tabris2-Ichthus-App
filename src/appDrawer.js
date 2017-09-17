const { Drawer, ui, Composite, TextView, CollectionView } = require('tabris');
const FlatButton = require('./widgets/FlatButton');
const colors = require('./appSettings/colors');

const topContainerHeight = 100;
const leftMargin = 16;

class AppDrawer{
  constructor() {
    this._drawer = ui.drawer;
    this.enableDrawer();
    this._drawerItems = ['Rooster', 'Cijfers', 'Instellingen'];
    this._createTopContainer();
    this._createPageSelector();

  }

  enableDrawer(){
    this._drawer.set({
      enabled: true
    });
  }

  disableDrawer(){
    this._drawer.set({
      enabled: false
    });
  }

  _createTopContainer(){
    this._containerTop = new Composite({
      top: 0, right: 0, left: 0, height: topContainerHeight,
      background: colors.white_grey_bg
    }).appendTo(this._drawer);
    new TextView({
      top: 24, left: leftMargin,
      font: '20px',
      text: localStorage.getItem('__userName')
    }).appendTo(this._containerTop);
    new TextView({
      bottom: 24,
      left: leftMargin,
      font: '14px',
      text: `${localStorage.getItem('__userGroup')} | ${localStorage.getItem('__userCode')}`
    }).appendTo(this._containerTop);
  }

  _createPageSelector(){
    this._pageSelectorCollection =  new CollectionView({
      top: topContainerHeight, left: 0, bottom: 0, right: 0,
      itemCount: this._drawerItems.length,
      cellHeight: 48,
      createCell: () => {
        let cell = new FlatButton();
        return cell
      },
      updateCell: (cell, index) => {
        let pageItem = this._drawerItems[index];
      }
    });
    this._pageSelectorCollection.appendTo(this._drawer)
  }

}

module.exports = AppDrawer;
