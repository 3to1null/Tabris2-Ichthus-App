/**
 * Created by Nathan on 24-9-2017.
 */
const {TextView, CollectionView, Composite, Page} = require('tabris');
const IndeterminateProgressBar = require('../widgets/IndeterminateProgressBar');
const colors = require('../appSettings/colors');
const getCalendar = require('./getCalendar');

const initialPageTitle = 'Agenda';

class AgendaPage extends Page {
  constructor(properties) {
    super(Object.assign({title: initialPageTitle, autoDispose: false}, properties));

    this.on('appear', () => {
      this._logPage();
      getCalendar().then((json)=>{this._createCalendarList(json.Calendar)})
    })
  }

  _logPage(){
    firebase.Analytics.screenName = "agendaScreen";
    firebase.Analytics.logEvent('agenda_opened', {screen: 'agendaScreen'});
  }

  _createCalendarList(calendarItems){
    const sectionHeight = 48;
    const itemHeight = 78;

    let scrollPosition = 0;
    let items = calendarItems;

    let floatingSection = createSectionView();

    floatingSection.children()[0].textColor = colors.white_bg;
    floatingSection.background = colors.UI_bg;
    floatingSection.elevation =  2;
    floatingSection.height = sectionHeight;
    floatingSection.children()[0].font = '18px';
    floatingSection.children()[0].text = items[0].text;

    new CollectionView({
      left: 0, top: 0, right: 0, bottom: 0,
      itemCount: items.length,
      cellType: index => items[index].type,
      cellHeight: (index, type) => type === 'header' ? sectionHeight : itemHeight,
      createCell: (cellType) => {
        let cell = new Composite({backgroundColor: colors.white_bg});
        if(cellType === 'header'){
          createSectionView().appendTo(cell);
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
        console.log(items[index].startTimeParsed);
        if(items[index].type === 'header'){
          cell.children()[0].children()[0].text = items[index].text
        }else{
          if(Boolean(items[index]._divider)){
            cell.children()[2].background = colors.divider_2
          }else{
            cell.children()[2].background = colors.transparant
          }
          cell.children()[0].text = items[index].title;
          cell.children()[1].text = items[index].descriptionPlainText;
          cell.children()[3].text = items[index]._startTimeParsed;
        }
      }
    }).on('scroll', ({target, deltaY})=> {
      scrollPosition += deltaY;
      let firstVisibleItem = target.firstVisibleIndex;
      floatingSection.set({
        text: getCurrentSection(firstVisibleItem).text,
        transform: {translationY: getSectionTranslationY(firstVisibleItem)}
      });
      floatingSection.children()[0].text = getCurrentSection(firstVisibleItem).text;
    }).appendTo(this);

    floatingSection.appendTo(this);

    function createSectionView() {
      let tmp = new tabris.Composite({
        layoutData: {
          top: 0,
          right: 0,
          height: sectionHeight,
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

    function getSectionTranslationY(firstVisibleItem) {
      if (scrollPosition < 0) {
        return -scrollPosition;
      }
      let nextSectionOffset = scrollPosition + sectionHeight - getNextSection(firstVisibleItem).top;
      if (nextSectionOffset > 0) {
        return -nextSectionOffset;
      }
      return 0;
    }

    function getNextSection(firstVisibleItem) {
      for (let i = firstVisibleItem + 1; i < items.length; i++) {
        let item = items[i];
        if (item.type === 'header') {
          return item;
        }
      }
      return null;
    }

    function getCurrentSection(firstVisibleItem) {
      for (let i = firstVisibleItem; i >= 0; i--) {
        let item = items[i];
        if (item.type === 'header') {
          return item;
        }
      }
      return null;
    }
  }


}

module.exports = (rootNavigationView) => {
  let agendaPage = new AgendaPage().appendTo(rootNavigationView);
};
