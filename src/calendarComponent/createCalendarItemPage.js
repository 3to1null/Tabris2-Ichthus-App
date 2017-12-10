const {Page, ui, ScrollView, ImageView, Composite, TextView, app} = require('tabris');
const BigToolbar = require('../widgets/BigToolbar');
const cellBackgroundGenerator = require('../globalFunctions/appointmentCellBackgroundGenerator');
const colors = require('../appSettings/colors');
const MaterialInput = require('../widgets/MaterialInput');
const FlatButton = require('../widgets/FlatButton');
const showToast = require('../globalFunctions/showToast');
const Request = require('../globalFunctions/Request');

const toolbarHeight = '170';
const days = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
const months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
const initialPageTitle = 'Nieuwe Afspraak';

class createCalendarItemPage extends Page {
  constructor() {
    super(Object.assign({title: ''}));
    this.title = initialPageTitle;
    this.subTitle = '';
    this._rootNavigationView = ui.contentView.find('#rootNavigationView');

    this._generateUI();
    this._generateInfoBox();

    this._newItemProps = {
      'title': '',
      'description': '',
      'date': '',
      'time': ''
    };

    this.on('disappear', () => {
      this._rootNavigationView.set('toolbarVisible', true);
    });
  }

  _saveItem(){
    function noPropsToast(property) {
      showToast(`Je hebt nog geen ${property} ingevoerd.`)
    }
    this._newItemProps.date = this._prettifyDate(this._newItemProps.date, false);
    if(this._newItemProps.title === ''){noPropsToast('titel')}
    else if(this._newItemProps.date.startsWith('NaN')){noPropsToast('datum')}
    else if(this._newItemProps.time === ''){noPropsToast('tijd')}
    else{
      console.log(this._newItemProps)
      new Request('calendar/create', this._newItemProps).post().then((json) => {
        console.log(json)
      })
    }
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

    this._saveButton = new FlatButton(
      {
        bottom: 0, height: 50, right: 0, left: 0,
        background: colors.white_grey_bg,
        font: '19px',
        textColor: colors.UI_bg,
        id: 'saveButton',
        highlightColor: colors.black_grey,
        textAlignment: 'right',
      }
    ).appendTo(this);
    this._saveButton.text = 'Opslaan';
    this._saveButton.on('touchEnd', () => {
      this._saveItem()
    });

    this._toolbar.addAction({
      side: 'left',
      image: {src: 'src/img/ic_add_white_36dp.png'},
      transform: {rotation: (1 / 4 * Math.PI)}
    }).on('touchEnd', () => {
      this.dispose();
    });
    this._toolbar.addAction({
      side: 'right',
      image: {src: 'src/img/ic_done_white_36dp.png'},
    }).on('touchEnd', () => {
      this._saveItem()
    });
  }

  _generateInfoBox() {
    let titleInput, descriptionInput;
    let calendarInfoBox = new ScrollView({
      left: 0, right: 0, top: toolbarHeight, bottom: 50
    }).appendTo(this);

    //TODO: following lines should be cleaner?
    //creates title input
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
    titleInput.inputWidget.on('textChanged', (target) => {
      this._toolbar.title = target.value !== '' ? target.value : initialPageTitle;
      this._newItemProps.title = target.value;
    });

    //creates description input
    new Composite({
      left: 16, right: 16, top: 'prev() 12'
    }).append(
      new ImageView({
        left: 0, height: 24, width: 24, centerY: 0,
        image: {src: 'src/img/ic_description_black_36dp.png', width: 24, height: 24}
      })).append(
      descriptionInput = new MaterialInput({
        top: 0, right: 16, left: 36,
        text: 'Beschrijving',
        type: 'multiline'
      })).appendTo(calendarInfoBox);
    descriptionInput.inputWidget.on('textChanged', (target) => {
      this._newItemProps.description = target.value;
    });

    //creates date input
    new Composite({
      left: 16, right: 16, top: 'prev() 28'
    }).append(
      new ImageView({
        left: 0, height: 24, width: 24, centerY: 0,
        image: {src: 'src/img/ic_date_range_black_36dp.png', width: 24, height: 24}
      })).append(
      this._dateTextView = new TextView({
        top: 0, right: 16, left: 36,
        text: 'Kies een datum...',
        font: '17px',
        textColor: colors.black
      })).on('tap', () => {
      this._createDateModal()
    }).appendTo(calendarInfoBox);

    //creates time input
    new Composite({
      left: 16, right: 16, top: 'prev() 12'
    }).append(
      new ImageView({
        left: 0, height: 24, width: 24, centerY: 0,
        image: {src: 'src/img/ic_clock_black.png', width: 24, height: 24}
      })).append(
      this._timeTextView = new TextView({
        top: 0, right: 16, left: 36,
        text: 'Kies een tijd...',
        font: '17px',
        textColor: colors.black
      })).on('tap', () => {
      this._createTimeModal()
    }).appendTo(calendarInfoBox);
  }


  _createDateModal(){
    let options = {
      type: 'date',         // 'date' or 'time', required
      date: new Date(),
      minDate: new Date(),
    };
    let outerScope = this;

    DateTimePicker.pick(options, function (timestamp) {
      let prettyDate = outerScope._prettifyDate(timestamp);
      outerScope._newItemProps.date = timestamp;
      outerScope._dateTextView.text = prettyDate;
    });
  }


  _createTimeModal(){
    let options = {
      type: 'time',         // 'date' or 'time', required
      date: new Date(),
      minDate: new Date(),
    };
    let outerScope = this;

    DateTimePicker.pick(options, function (timestamp) {
      let prettyTime = outerScope._prettifyTime(timestamp);
      outerScope._newItemProps.time = prettyTime;
      outerScope._timeTextView.text = prettyTime;
    });
  }



  //date should be in ms
  _prettifyDate(date, verbal=true){
    let dateObject = new Date(date);
    if(verbal){
      let dayName = days[dateObject.getDay()];
      let monthName = months[dateObject.getMonth()];
      return `${dayName}, ${dateObject.getDate()} ${monthName} ${dateObject.getFullYear()}`
    }else{
      return `${dateObject.getFullYear()}-${dateObject.getMonth() + 1}-${dateObject.getDate()}`
    }

  }
  //timestamp should be in ms
  _prettifyTime(timestamp){
    let dateObject = new Date(timestamp);
    let hours = dateObject.getHours();
    let minutes = dateObject.getMinutes();
    return `${hours}:${minutes}`
  }






}

module.exports = () => {
  let appointmentsDetailsPage = new createCalendarItemPage().appendTo(ui.contentView.find('#rootNavigationView'));
};
