const {Page, ui, ScrollView, ImageView, Composite} = require('tabris');
const BigToolbar = require('../widgets/BigToolbar');
const cellBackgroundGenerator = require('../globalFunctions/appointmentCellBackgroundGenerator');
const colors = require('../appSettings/colors');
const MaterialInput = require('../widgets/MaterialInput');

const toolbarHeight = '170';

class createCalendarItemPage extends Page {
  constructor() {
    super(Object.assign({title: ''}));
    this.title = 'Nieuwe afspraak';
    this.subTitle = '';
    this._rootNavigationView = ui.contentView.find('#rootNavigationView');
    this._generateUI();
    this._generateInfoBox();
    this.on('disappear', () => {
      this._rootNavigationView.set('toolbarVisible', true);
    });
  }

  _generateUI() {
    this._rootNavigationView.set('toolbarVisible', false);
    this._toolbar = new BigToolbar({
      top: 0,
      left: 0,
      right: 0,
      height: toolbarHeight,
      animateToBigToolbar: true,
    }, this.title, this.subTitle).appendTo(this);
  }

  _generateInfoBox() {
    let titleInput;
    let calendarInfoBox = new ScrollView({
      left: 0, right: 0, top: toolbarHeight, bottom: 0
    }).appendTo(this);
    new Composite({
      left: 16, right: 16, top: 12
    }).append(
      new ImageView({
        left: 0, height: 24, width: 24, centerY: 0,
        image: {src: 'src/img/ic_info_black_36dp.png', width: 24, height: 24}
      })).append(
      titleInput = new MaterialInput({
        top: 0, right: 16, left: 36,
        text: 'Titel'
      })).appendTo(calendarInfoBox);
    titleInput.inputWidget.on('change:text', (widget, text) =>{
      this._toolbar.title = text;
    })
  }

}

module.exports = () => {
  let appointmentsDetailsPage = new createCalendarItemPage().appendTo(ui.contentView.find('#rootNavigationView'));
};
