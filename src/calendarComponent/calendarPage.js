/**
 * Created by Nathan on 24-9-2017.
 */
const {TextView, CollectionView, Composite, Page} = require('tabris');
const IndeterminateProgressBar = require('../widgets/IndeterminateProgressBar');
const FloatingActionButton = require('../widgets/FloatingActionButton');
const colors = require('../appSettings/colors');
const getCalendar = require('./getCalendar');
const showToast = require('../globalFunctions/showToast');

const initialPageTitle = 'Agenda';

class AgendaPage extends Page {
  constructor(properties) {
    super(Object.assign({title: initialPageTitle, autoDispose: false}, properties));
    this._progressBar = new IndeterminateProgressBar({left: 0, right: 0, top: 0, height: 4}).appendTo(this);

    getCalendar(true).then((json)=>{
      this._createCalendarList(json.Calendar);
      this._updateCalendarList(this._calendarCollection);
      this._createUI();
      if(Boolean(json.Calendar[0].empty)){
        showToast('Je agenda is leeg. Je kan een afspraak of opdracht toevoegen met het plusje.');
        this._progressBar.top = 44;
      }else{
        this._progressBar.dispose();
      }
    }).catch((error) => {console.log(error)});

    this.on('appear', () => {
      this._logPage();
    })

  }

  _logPage(){
    firebase.Analytics.screenName = "agendaScreen";
    firebase.Analytics.logEvent('agenda_opened', {screen: 'agendaScreen'});
  }

  _createUI(){
    new FloatingActionButton({
      right: 16, bottom: 16, height: 56, width: 56,
      color: colors.accent,
      image: {src: "src/img/ic_add_white_36dp.png", width: 24, height: 24}
    }).appendTo(this)
  }

  _updateCalendarList(collectionView){
    getCalendar().then((json)=>{
      let oldCalendarItems = this.items;
      this.items = json.Calendar;
      if(oldCalendarItems !== this.items){
        collectionView.remove(0, oldCalendarItems.length);
        collectionView.insert(0, this.items.length);
        this.floatingSection.children()[0].text = this.items[0].text;
      }
      try{this._progressBar.dispose();}finally{}
      collectionView.refreshIndicator = false;
    }).catch((error)=>{console.log(error)})
  }

  _createCalendarList(calendarItems){
    this.sectionHeight = 48;
    const itemHeight = 78;

    this.scrollPosition = 0;
    this.items = calendarItems;

    this.floatingSection = this._createSectionView();

    this.floatingSection.children()[0].textColor = colors.white_bg;
    this.floatingSection.background = colors.UI_bg;
    this.floatingSection.elevation =  2;
    this.floatingSection.height = this.sectionHeight - 4;
    this.floatingSection.children()[0].font = '18px';
    this.floatingSection.children()[0].text = this.items[0].text;

    this._calendarCollection = new CollectionView({
      left: 0, top: 0, right: 0, bottom: 0,
      itemCount: this.items.length,
      refreshEnabled: true,
      cellType: index => this.items[index].type,
      cellHeight: (index, type) => type === 'header' ? this.sectionHeight : itemHeight,
      createCell: (cellType) => {
        let cell = new Composite({backgroundColor: colors.white_bg});
        if(cellType === 'header'){
          this._createSectionView().appendTo(cell);
          return cell;
        }else{
          let title = new TextView({
            left: 72, right: 16, top: 8, height: 24,
            font: 'bold 15px',
            color: colors.black
          }).appendTo(cell);
          let desc = new TextView({
            top: 32, left: 72, right: 16,
            font: '14px',
            alignment: 'left',
            color: colors.light_black,
            maxLines: 2
          }).appendTo(cell);
          let divider = new Composite({
            bottom: 0, height: 1, left: 72, right: 0
          }).appendTo(cell);
          let time = new TextView({
            left: 16, centerY: 0,
            font: 'bold 15px',
            textColor: colors.accent
          }).appendTo(cell);
          return cell;
        }
      },
      updateCell: (cell, index) => {
        if(this.items[index].type === 'header'){
          cell.children()[0].children()[0].text = this.items[index].text;
          if(Boolean(this.items[index].first)){
            cell.children()[0].height = this.sectionHeight - 4
          }

        }else{
          if(Boolean(this.items[index]._divider)){
            cell.children()[2].background = colors.divider_2
          }else{
            cell.children()[2].background = colors.transparant
          }
          cell.children()[0].text = this.items[index].title;
          cell.children()[1].text = this.items[index].descriptionPlainText;
          cell.children()[3].text = this.items[index]._startTimeParsed;
        }
      }
    }).on('scroll', ({target, deltaY})=> {
      this.scrollPosition += deltaY;
      let firstVisibleItem = target.firstVisibleIndex;
      this.floatingSection.children()[0].text = this._getCurrentSection(firstVisibleItem).text;
    }).on('refresh', (eventObject) => {
      this._updateCalendarList(eventObject.target);
    }).appendTo(this);

    this.floatingSection.appendTo(this);

  }

  _getCurrentSection(firstVisibleItem) {
    for (let i = firstVisibleItem; i >= 0; i--) {
      let item = this.items[i];
      if (item.type === 'header') {
        return item;
      }
    }
    return null;
  }
  _getNextSection(firstVisibleItem) {
    for (let i = firstVisibleItem + 1; i < this.items.length; i++) {
      let item = this.items[i];
      if (item.type === 'header') {
        return item;
      }
    }
    return null;
  }

  _getSectionTranslationY(firstVisibleItem) {
    if (this.scrollPosition < 0) {
      return -this.scrollPosition;
    }
    let nextSectionOffset = this.scrollPosition + this.sectionHeight - this._getNextSection(firstVisibleItem).top;
    if (nextSectionOffset > 0) {
      return -nextSectionOffset;
    }
    return 0;
  }

  _createSectionView() {
    let tmp = new tabris.Composite({
      layoutData: {
        top: 0,
        right: 0,
        height: this.sectionHeight,
        left: 0
      },
      background: colors.white_grey_bg
    });
    new tabris.TextView({
      top: 0, bottom: 0, left: 72, right: 0,
      textColor: colors.black,
      font: '15px',
      alignment: 'left',
      class: 'description'
    }).appendTo(tmp);
    return tmp
  }

}

module.exports = (rootNavigationView) => {
  let agendaPage = new AgendaPage().appendTo(rootNavigationView);
};
