const { Drawer, ui, Composite, TextView, CollectionView } = require('tabris');

const FlatButton = require('./widgets/FlatButton');
const colors = require('./appSettings/colors');

const topContainerHeight = 100;
const leftMargin = 16;

class AppDrawer{
  constructor(rootNavigationView) {
    this._drawer = ui.drawer;
    this._rootNavigationView = rootNavigationView;
    this._drawer.background = colors.white_bg;
    this.enableDrawer();
    this._drawerItems = ['Rooster', 'Cijfers', 'Instellingen'];
    this._createTopContainer();
    this._createPageSelector();
    this._activePage = 'Rooster';
    this._pages = {
      'Rooster': this._rootNavigationView._children[0]
    }

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
    //TODO: Check why there is an error if line 61 is uncommented
    this._pageSelectorCollection =  new CollectionView({
      top: topContainerHeight, left: 0, bottom: 0, right: 0,
      itemCount: this._drawerItems.length,
      cellHeight: 48,
      createCell: () => {
        return new FlatButton({
          background: colors.white_bg,
          textAlignment: 'left',
          highlightColor: colors.black_grey,
          font: '16px',
          textColor: colors.black
        })
      },
      updateCell: (cell, index) => {
        cell.text = this._drawerItems[index];
      }
    }).on('select', ({index}) => {this._onPageSelect(index)});
    this._pageSelectorCollection.appendTo(this._drawer)
  }

  _onPageSelect(index){
    const selectedPage = this._drawerItems[index];
    if(this._activePage !== selectedPage){
      this._openPage(selectedPage)
    }
  }

  _openPage(pageToBeOpened){
    //Creates a reference to page that was opened before
    this._pages[this._activePage] = this._rootNavigationView._children[0];
    if(pageToBeOpened in this._pages){
      this._rootNavigationView.append(this._pages[pageToBeOpened])
    }else{
      //TODO: create the new page
    }
    this._rootNavigationView._children[0].detach();
  }

}



module.exports = AppDrawer;
