/**
 * Created by Nathan on 25-6-2017.
 */
const {Tab, Page, ui, Button, Composite, TextView, TabFolder, CollectionView, SearchAction, Action} = require('tabris');
const MaterialInput = require('../widgets/MaterialInput');
const BigToolbar = require('../widgets/BigToolbar');
const FlatButton = require('../widgets/FlatButton');
const IndeterminateProgressBar = require('../widgets/IndeterminateProgressBar');
const colors = require('../appSettings/colors');
const getSchedule = require('./getSchedule');
const getWeekNumber = require('../globalFunctions/getWeekNumber');
const Request = require('../globalFunctions/Request');
const showToast = require('../globalFunctions/showToast');
//const appointmentDetailsPage = require('./appointmentDetailsPage');
const cellBackgroundGenerator = require('../globalFunctions/appointmentCellBackgroundGenerator');
const getSetting = require('../globalFunctions/getSetting');

const initialPageTitle = 'Rooster';

class RoosterPage extends Page {
  constructor(properties) {
    super(Object.assign({title: localStorage.getItem('__userName'), autoDispose: false}, properties));
    this._rootNavigationView = ui.contentView.find('#rootNavigationView');

    this._renderTabFolder();
    this._tabsLoaded = [];
    this._scheduleCollectionList = {};
    this.progessBar = new IndeterminateProgressBar({left: 0, right: 0, top: 0, height: 4}).appendTo(this);


    firebase.Analytics.logEvent('get_schedule', {screen: 'scheduleScreen'});
    getSchedule().then((json) => {
      this.progessBar.dispose();
      this._generateTabs(json);
      this.tabFolder.selection = this.tabFolder.find('#weekTab1')[0];
      firebase.Analytics.logEvent(`schedule_tab1_opened`, {screen: 'scheduleScreen'});

      this._renderSchedule(json[this.tabFolder.selection.id.substr(-1)], this.tabFolder.selection.id.substr(-1));
      this._tabsLoaded.push(this.tabFolder.selection.id.substr(-1));
      this._renderSchedule(json[parseInt(this.tabFolder.selection.id.substr(-1)) - 1], String(parseInt(this.tabFolder.selection.id.substr(-1)) - 1));
      this._tabsLoaded.push(String(parseInt(this.tabFolder.selection.id.substr(-1)) - 1));
      this._renderSchedule(json[parseInt(this.tabFolder.selection.id.substr(-1)) + 1], String(parseInt(this.tabFolder.selection.id.substr(-1)) + 1));
      this._tabsLoaded.push(String(parseInt(this.tabFolder.selection.id.substr(-1)) + 1));

      this.tabFolder.on('selectionChanged', (data) => {
        firebase.Analytics.logEvent(`schedule_tab${data.value.id.substr(-1)}_opened`, {screen: 'scheduleScreen'});
        this._loadTabsOnSelectionChange(data, json)
      });
      firebase.Analytics.logEvent('schedule_rendered', {screen: 'scheduleScreen'})
    }).catch((error) => console.log(error));

    this.on('appear', () => {
      this._createActions();
      this._createSearchAction();
      this._logPage()
    });

    this.on('disappear', () => {
      this._disposeAllActions();
    })
  }

  _logPage(){
    firebase.Analytics.screenName = "scheduleScreen";
    firebase.Analytics.logEvent('schedulepage_opened', {screen: 'scheduleScreen'});
  }

  _loadTabsOnSelectionChange(data, json){
    if (!(this._tabsLoaded.includes(data.value.id.substr(-1)))) {
      this._renderSchedule(json[data.value.id.substr(-1)], data.value.id.substr(-1));
      this._tabsLoaded.push(String(data.value.id.substr(-1)));
    }
    //loads prev tab if it is not loaded: reduces visible lag
    //TODO: this doesn't yet work with custom amounts of weeks!!
    if (!(this._tabsLoaded.includes(String(parseInt(data.value.id.substr(-1)) - 1))) && parseInt(data.value.id.substr(-1)) - 1 >= 0) {
      this._renderSchedule(json[String(parseInt(data.value.id.substr(-1)) - 1)], String(parseInt(data.value.id.substr(-1)) - 1));
      this._tabsLoaded.push(String(parseInt(data.value.id.substr(-1)) - 1));
    }
    //loads next tab if it is not loaded: reduces visible lag
    if (!(this._tabsLoaded.includes(String(parseInt(data.value.id.substr(-1)) + 1))) && parseInt(data.value.id.substr(-1)) + 1 <= 6) {
      this._renderSchedule(json[String(parseInt(data.value.id.substr(-1)) + 1)], String(parseInt(data.value.id.substr(-1)) + 1));
      this._tabsLoaded.push(String(parseInt(data.value.id.substr(-1)) + 1));
    }
  }

  //render schedule after search result.
  _renderNextSchedule(userObject) {
    if(userObject.userCode === '~me'){
      firebase.Analytics.logEvent('get_schedule', {screen: 'scheduleScreen'});
    }else if(userObject.userCode === localStorage.getItem('__userCode')){
      firebase.Analytics.logEvent('get_schedule_own_via_search', {screen: 'scheduleScreen'});
    }else{
      firebase.Analytics.logEvent('get_schedule_someone_else', {screen: 'scheduleScreen'});
    }
    this._loadOwnScheduleAction.visible = false;
    this.tabFolder.dispose();
    this.title = userObject.name;
    this._tabsLoaded = [];
    this._scheduleCollectionList = {};
    this._renderTabFolder();
    this.progessBar = new IndeterminateProgressBar({left: 0, right: 0, top: 0, height: 4}).appendTo(this);
    getSchedule(userObject.userCode).then((json) => {
      if(userObject.userCode === '~me'){
        this._loadOwnScheduleAction.image = {
          src: 'src/img/ic_refresh_white_24dp_2x.png',
          scale: 2
        }
      }else{
        this._loadOwnScheduleAction.image = {
          src: 'src/img/ic_person_white_24dp_2x.png',
          scale: 2
        }
      }
      this._loadOwnScheduleAction.visible = true;
      this.progessBar.detach();
      this._generateTabs(json);
      this.tabFolder.selection = this.tabFolder.find('#weekTab1')[0];
      firebase.Analytics.logEvent(`schedule_tab1_opened`, {screen: 'scheduleScreen'});
      this._renderSchedule(json[this.tabFolder.selection.id.substr(-1)], this.tabFolder.selection.id.substr(-1));
      this._tabsLoaded.push(this.tabFolder.selection.id.substr(-1));
      this.tabFolder.on('selectionChanged', (data) => {
        firebase.Analytics.logEvent(`schedule_tab${data.value.id.substr(-1)}_opened`, {screen: 'scheduleScreen'});
        this._loadTabsOnSelectionChange(data, json)
      });
      firebase.Analytics.logEvent('schedule_rendered', {screen: 'scheduleScreen'})
    }).catch((error) => {
      showToast('Er kon geen verbinding gemaakt worden met de server en er is geen offline rooster beschikbaar. We gaan het opnieuw Proberen!');
      this._renderNextSchedule(userObject)
    });
  }

  _parseSearchResult(name) {
    let userObject = this.proposals.find(user => user.name === name);
    if (userObject !== undefined){
      let offlineProposalsObjects = JSON.parse(localStorage.getItem('offlineProposalsObjects'));
      if(offlineProposalsObjects === null){offlineProposalsObjects = []}
      this.searchAction.text = "";
      if(!offlineProposalsObjects.map(object => object.name).includes(userObject.name)){
        offlineProposalsObjects.unshift(userObject);
      }
      this._renderNextSchedule(userObject);
      localStorage.setItem('offlineProposalsObjects', JSON.stringify(offlineProposalsObjects));
    }else{
      //User didn't click on a name but used enter button, so show the search results.
      this._searchResultContainer().then((user) => {console.log(user)})
    }
  }

  //returns a promise that resolves a name.
  _searchResultContainer(){
    return new Promise((resolve, reject) => {
      new Composite({
        left: 0, right: 0, height: 200, top: 0
      }).appendTo(this)

    })
  }


  //gets new proposals on input in searchbar.
  _getProposals(searchQuery) {
    if (searchQuery !== '') {
      new Request('searchQuery', {q: searchQuery}, false, false, 300).get().then(((response) => {
        response.json().then((json) => {
          this.proposals = json;
          this.searchAction.proposals = json.map(proposal => proposal.name);
        })
      }), (error) => {
        let offlineProposalsObjects = JSON.parse(localStorage.getItem('offlineProposalsObjects'));
        let offlineProposals = offlineProposalsObjects.map(proposal => proposal.name);
        this.proposals = offlineProposalsObjects;
        this.searchAction.proposals = offlineProposals.filter((proposal) => {
          try{
            return proposal.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1;
          } catch (err){
            console.log(err)
          }
        })
      });
    }
  }

  _disposeAllActions(){
    this.searchAction.detach();
    this.searchAction.dispose();
    this._loadOwnScheduleAction.dispose();
  }

  _createSearchAction() {
    this.searchAction = new SearchAction({
      title: 'Zoeken',
      placementPriority: 'high',
      id: 'SearchAction',
      image: {
        src: 'src/img/search-white-24dp@3x.png',
        scale: 3,
        message: 'Zoeken'
      }
    }).appendTo(this._rootNavigationView);
    this.searchAction.on('select', () => firebase.Analytics.logEvent('search_opened', {screen: 'scheduleScreen'}));
    this.searchAction.on('input', ({text}) => this._getProposals(text));
    this.searchAction.on('accept', ({text}) => this._parseSearchResult(text));
    let offlineProposalsObjects = JSON.parse(localStorage.getItem('offlineProposalsObjects'));
    if(offlineProposalsObjects === null){offlineProposalsObjects = []}
    this.searchAction.proposals = offlineProposalsObjects.map(proposal => proposal.name);
    this.proposals = offlineProposalsObjects;
  }

  _createActions(){
    this._loadOwnScheduleAction = new Action({
      title: 'Eigen rooster',
      id: 'loadOwnScheduleAction',
      image: {
        src: 'src/img/ic_refresh_white_24dp_2x.png',
        scale: 2
      }
    }).appendTo(this._rootNavigationView);
    this._loadOwnScheduleAction.on('select', () => {
      let userObject = {
        id: '1',
        userCode: '~me',
        name: localStorage.getItem('__userName'),
        isStudent: true
      };
      this._renderNextSchedule(userObject);
    });
  }

  //renders the tab-bar and creates the tabfolder. It does create the tabs.
  _renderTabFolder() {
    this.tabFolder = new TabFolder({
      left: 0, right: 0, top: 0, bottom: 0,
      textColor: colors.white_bg,
      paging: true,
      tabMode: 'scrollable',
      //to prevent fully indigo screen, background is changed on render of tabs folders
      background: colors.white_grey_bg,
    }).appendTo(this);
  }


  _generateTabs(json) {
    this.tabFolder.background = colors.UI_bg;
    let firstWeekNumber = getWeekNumber(new Date());
    this._tabList = [];
    for (let weekIndex = 0; weekIndex < 7; weekIndex++) {
      let tabTitle;
      if (weekIndex === 0) {
        tabTitle = 'Vorige week';
      }
      else if (weekIndex === 1) {
        tabTitle = 'Deze week';
      }
      else if (weekIndex === 2) {
        tabTitle = 'Volgende week';
      }
      else {
        tabTitle = `Week ${firstWeekNumber + weekIndex - 1}`;
      }
      let tmp_tab = new Tab({
        title: tabTitle,
        id: `weekTab${weekIndex}`,
        background: colors.white_bg,
      });
      this._tabList.push(tmp_tab);
      tmp_tab.appendTo(this.tabFolder);
    }
  }

  //populates the appointment cell with appropriate info.
  _populateCell(appointment, index, cell) {
    let leraar = cell.find('#leraar')[0];
    let subject = cell.find('#subject')[0];
    let lokaal = cell.find('#lokaal')[0];
    let klas = cell.find('#klas')[0];
    if (appointment !== 'False' && appointment !== false && appointment !== 'false') {
      if(getSetting('showLeraar')){
        leraar.text = appointment.teachers;
      }
      if(getSetting('showKlas')){
        klas.text = appointment['groups'];
      }
      subject.text = appointment.subjects;
      lokaal.text = appointment.locations;
    } else {
      if(getSetting('showLeraar')){
        leraar.text = '';
      }
      if(getSetting('showKlas')){
        klas.text = '';
      }
      subject.text = '';
      lokaal.text = '';
    }
  }

  _renderSchedule(appointments, weekIndex) {
    const scheduleCollectionTopMargin = 20;
    let aboveScheduleTextList = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'];
    if(getSetting('showDatesAboveSchedule')) {

      const months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
      const days = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];


      function getMonday(d) {
        d = new Date(d);
        let day = d.getDay(),
          diff = d.getDate() - day + (day === 0 ? -6:1); // adjust when day is sunday
        return new Date(d.setDate(diff));
      }
      //offset is in days
      function getPrettyDate(date, offset) {
        date.setDate(date.getDate() + offset);
        let month = months[date.getMonth()];
        let day = days[date.getDay() - 1];
        return `${day.substring(0, 2)} ${date.getDate()} ${month.substring(0,3)}`
      }

      let today = new Date();
      today.setDate(today.getDate() + (weekIndex === 0 ? -7 : (weekIndex - 1) * 7));
      let mondayOfWeek = getMonday(today);
      aboveScheduleTextList = [];

      //x = 0 => monday, x = 1 => tuesday, etc.
      for(let x = 0; x < 5; x++){
        aboveScheduleTextList.push(getPrettyDate(mondayOfWeek, 1))
      }
    }
    new CollectionView({
      top: 0, left: 0, right: 0, height: scheduleCollectionTopMargin,
      columnCount: 5,
      itemCount: 5,
      createCell: () => {
        let cell = new Composite({
          background: colors.UI_bg
        });
        new TextView({
          centerY: 0, centerX: 0,
          textColor: colors.white_light_bg
        }).appendTo(cell);
        return cell;
      },
      updateCell: (cell, index) => {
        cell.children()[0].text = aboveScheduleTextList[index];
      }
    }).appendTo(this.tabFolder.find(`#weekTab${weekIndex}`));
    this._scheduleCollectionList[String(weekIndex)] = new CollectionView({
      top: scheduleCollectionTopMargin - 1, left: 0, right: 0, bottom: 0,
      class: 'scheduleCollection',
      columnCount: 5,
      itemCount: appointments.length,
      highlightOnTouch: true,
      createCell: () => {
        let cellContainer = new Composite();
        if(getSetting('showLeraar')){
          new TextView({
            top: 'prev()',
            height: 20,
            id: 'leraar'
          }).appendTo(cellContainer);
        }
        new TextView({
          top: 'prev()',
          height: 20,
          id: 'subject'
        }).appendTo(cellContainer);
        new TextView({
          top: 'prev()',
          height: 20,
          id: 'lokaal'
        }).appendTo(cellContainer);
        if(getSetting('showKlas')){
          new TextView({
            top: 'prev()',
            height: 20,
            id: 'klas'
          }).appendTo(cellContainer);
        }
        return cellContainer;
      },
      updateCell: (cell, index) => {
        let appointment = appointments[index];
        cell.background = cellBackgroundGenerator(appointment, index);
        this._populateCell(appointment, index, cell);
      }
    }).on('select', ({index}) => {
      //TODO: add appointmentDetailsPage
      //if(appointments[index] !== false) {
      //   appointmentDetailsPage(index, appointments[index], this._rootNavigationView);
      //}

    }).appendTo(this.tabFolder.find(`#weekTab${weekIndex}`));
  }


}

module.exports = (rootNavigationView) => {
  let roosterPage = new RoosterPage().appendTo(rootNavigationView);
};
