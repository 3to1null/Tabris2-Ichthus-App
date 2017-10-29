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

        let canvasCijfer = new Canvas({
          top: 10, left: 12, width: 60, height: 60
        }).appendTo(cellContainer);

        new TextView ({
          top: 12, left: 84, right: 12,
          font: '16px',
          textColor: colors.black
        }).appendTo(cellContainer);

        new TextView ({
          top: "prev()", left: 84, right: 12,
          markupEnabled: true,
          font: 'light 14px',
          textColor: colors.black
        }).appendTo(cellContainer);
        new TextView ({
          top: "prev()", left: 84, right: 12,
          markupEnabled: true,
          font: 'light 14px',
          textColor: colors.black
        }).appendTo(cellContainer);
        new TextView ({
          top: "prev()", left: 84, right: 12,
          markupEnabled: true,
          font: 'light 14px',
          textColor: colors.black
        }).appendTo(cellContainer);
        new TextView ({
          top: "prev()", left: 84, right: 12,
          markupEnabled: true,
          font: 'light 14px',
          textColor: colors.black
        }).appendTo(cellContainer);
        //divider
        new Composite({
          bottom: 0, height: 1, left: 84, right: 12,
          background: colors.white_white_grey_bg
        }).appendTo(cellContainer);

        createCircleIcon(canvasCijfer, cellType, 'cijferDetailView');
        return cellContainer
      },
      updateCell: (cell, index) => {
        let cellData = this.cijfers[index]
        console.log(this.cijfers[index]);
        console.log(cell);
        cell.children()[1].text = cellData.details.Beschrijving;
        cell.children()[2].text = `Weging: <b>${cellData.details.Weging}</b>`;
        cell.children()[3].text = `Groep: <b>${cellData.details.Toetssoort}</b>`;
        cell.children()[4].text = `Code: <b>${cellData.details.Toetscode}</b>`;
        if(cellData.isBubble === true || cellData.isBubble === 'true' || cellData.isBubble === 'True'){
          cell.children()[5].text = `Cijfers: <b>${cellData.bubbleSTR}</b>`;
        }
      }
    }).appendTo(this)
  }
}

module.exports = (cijfers) => {
  let cijferDetailsPage = new appointmentDetailsPage(cijfers).appendTo(ui.contentView.find('#rootNavigationView'));
};
