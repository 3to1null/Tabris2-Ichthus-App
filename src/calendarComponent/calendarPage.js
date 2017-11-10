/**
 * Created by Nathan on 24-9-2017.
 */
const {Page, TabFolder, Tab, CollectionView, Canvas, Composite, device, TextView} = require('tabris');
const IndeterminateProgressBar = require('../widgets/IndeterminateProgressBar');
const colors = require('../appSettings/colors');
const getCalendar = require('./getCalendar');

const initialPageTitle = 'Agenda';

class AgendaPage extends Page {
  constructor(properties) {
    super(Object.assign({title: initialPageTitle, autoDispose: false}, properties));

    this.on('appear', () => {
      this._logPage();
      getCalendar().then((json)=>{console.log(json)})
    })
  }

  _logPage(){
    firebase.Analytics.screenName = "agendaScreen";
    firebase.Analytics.logEvent('agenda_opened', {screen: 'agendaScreen'});
  }


}

module.exports = (rootNavigationView) => {
  let agendaPage = new AgendaPage().appendTo(rootNavigationView);
};
