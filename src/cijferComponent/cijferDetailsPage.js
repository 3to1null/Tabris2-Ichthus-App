const {Page, ui, CollectionView, Canvas, Composite, TextView} = require('tabris');
const createCircleIcon = require('../globalFunctions/createIconCircle');

const colors = require('../appSettings/colors');

const toolbarHeight = '170';

class appointmentDetailsPage extends Page{
  constructor(vakData) {
    super(Object.assign({title: vakData.subject}));
    this._rootNavigationView = ui.contentView.find('#rootNavigationView');
    this.vakData = vakData;
    this.cijfers = this.vakData.cijfers.list;

    this._createCijferCollection();
  }

  _createCijferCollection(){
    new CollectionView({
      left: 0, top:0, right:0, bottom: 0,
      itemCount: this.cijfers.length,
      cellType: (index) => {
        return this.cijfers[index].cijfer;
      },
      createCell: (cellType) => {
        let cellContainer = new Composite({highlightOnTouch:true});
        let canvasCijfer = new tabris.Canvas({
          top: 0, left: 12, width: 60, height: 60
        }).appendTo(cellContainer);
        createCircleIcon(canvasCijfer, cellType, 'cijferDetailView');
        return cellContainer
      }
    }).appendTo(this)
  }
}

module.exports = (cijfers) => {
  let cijferDetailsPage = new appointmentDetailsPage(cijfers).appendTo(ui.contentView.find('#rootNavigationView'));
};
