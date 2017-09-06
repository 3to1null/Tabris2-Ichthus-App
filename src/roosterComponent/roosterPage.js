/**
 * Created by Nathan on 25-6-2017.
 */
//TODO: add settings for cellContainer (show klas, teacher)
//TODO: add settings for collectionView (show days)
const {Tab, Page, ui, Button, Composite, TextView, TabFolder, CollectionView, SearchAction} = require('tabris');
const MaterialInput = require('../widgets/MaterialInput');
const BigToolbar = require('../widgets/BigToolbar');
const FlatButton = require('../widgets/FlatButton');
const IndeterminateProgressBar = require('../widgets/IndeterminateProgressBar');
const colors = require('../appSettings/colors');
const getSchedule = require('./getSchedule');
const getWeekNumber = require('../globalFunctions/getWeekNumber');
const Request = require('../globalFunctions/Request');

const initialPageTitle = 'Rooster';

class RoosterPage extends Page {
  constructor(properties) {
    super(Object.assign({title: localStorage.getItem('__userName')}, properties));
    this._rootNavigationView = ui.contentView.find('#rootNavigationView');
    this._renderTabFolder();
    this._tabsLoaded = [];
    this._scheduleCollectionList = {};
    this.progessBar = new IndeterminateProgressBar({left: 0, right: 0, top: 0, height: 4}).appendTo(this);
    this._createSearchAction();
    getSchedule().then((json) => {
      this.progessBar.dispose();
      this._generateTabs(json);
      this.tabFolder.selection = this.tabFolder.find('#weekTab1')[0];
      this._renderSchedule(json[this.tabFolder.selection.id.substr(-1)], this.tabFolder.selection.id.substr(-1));
      this._tabsLoaded.push(this.tabFolder.selection.id.substr(-1));
      this.tabFolder.on('selectionChanged', (data) => {
        if (!(this._tabsLoaded.includes(data.value.id.substr(-1)))) {
          this._renderSchedule(json[data.value.id.substr(-1)], data.value.id.substr(-1));
          this._tabsLoaded.push(String(data.value.id.substr(-1)));
        }
      });
    }).catch((error) => console.log(error));
  }

  _renderNextSchedule(userObject) {
    this.tabFolder.dispose();
    this.title = userObject.name;
    this._tabsLoaded = [];
    this._scheduleCollectionList = {};
    this._renderTabFolder();
    this.progessBar = new IndeterminateProgressBar({left: 0, right: 0, top: 0, height: 4}).appendTo(this);
    getSchedule(userObject.userCode).then((json) => {
      this.progessBar.detach();
      this._generateTabs(json);
      this.tabFolder.selection = this.tabFolder.find('#weekTab1')[0];
      this._renderSchedule(json[this.tabFolder.selection.id.substr(-1)], this.tabFolder.selection.id.substr(-1));
      this._tabsLoaded.push(this.tabFolder.selection.id.substr(-1));
      this.tabFolder.on('selectionChanged', (data) => {
        if (!(this._tabsLoaded.includes(data.value.id.substr(-1)))) {
          this._renderSchedule(json[data.value.id.substr(-1)], data.value.id.substr(-1));
          this._tabsLoaded.push(String(data.value.id.substr(-1)));
        }
      });
    }).catch((error) => console.log(error));
  }

  _parseSearchResult(name) {
    let userObject = this.proposals.find(user => user.name === name);
    let offlineProposalsObjects = JSON.parse(localStorage.getItem('offlineProposalsObjects'));
    if(offlineProposalsObjects === null){offlineProposalsObjects = []}
    if(userObject !== undefined){
      this.searchAction.text = "";
      if(!offlineProposalsObjects.map(object => object.name).includes(userObject.name)){
        offlineProposalsObjects.unshift(userObject);
      }
      this._renderNextSchedule(userObject);
      if(offlineProposalsObjects.length > 5){
        offlineProposalsObjects.pop[0];
      }
      localStorage.setItem('offlineProposalsObjects', JSON.stringify(offlineProposalsObjects));
    }
  }

  _getProposals(searchQuery) {
    if (searchQuery !== '') {
      new Request('searchQuery', {q: searchQuery}, false, false, 300).get().then(((response) => {
        response.json().then((json) => {
          this.proposals = json;
          this.searchAction.proposals = json.map(proposal => proposal.name);
        })
      }), (error) => {
        console.log(error);
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

  _createSearchAction() {
    this.searchAction = new SearchAction({
      title: 'Zoeken',
      image: {
        src: 'src/img/search-white-24dp@3x.png',
        scale: 3,
        message: 'Zoeken'
      }
    }).appendTo(this._rootNavigationView);
    this.searchAction.on('input', ({text}) => this._getProposals(text));
    this.searchAction.on('accept', ({text}) => this._parseSearchResult(text));
    let offlineProposalsObjects = JSON.parse(localStorage.getItem('offlineProposalsObjects'));
    if(offlineProposalsObjects === null){offlineProposalsObjects = []}
    this.searchAction.proposals = offlineProposalsObjects.map(proposal => proposal.name);;
    this.proposals = offlineProposalsObjects;
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
    let firstWeekNumber = getWeekNumber(new Date()) - 1;
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
        tabTitle = `Week ${firstWeekNumber + weekIndex}`;
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

  _cellBackGroundGenerator(appointment, cellIndex) {
    let rowIsOdd = false;
    if (cellIndex < 5 ||
      (cellIndex >= 10 && cellIndex < 15) ||
      (cellIndex >= 20 && cellIndex < 25) ||
      (cellIndex >= 30 && cellIndex < 35) ||
      (cellIndex >= 40 && cellIndex < 45)
    ) {
      rowIsOdd = true;
    }
    if (appointment === 'False' || appointment === false || appointment === 'false') {
      return rowIsOdd ? '#b3b3b3' : '#cccccc';
    } else if (appointment['cancelled'] === true) {
      return rowIsOdd ? '#ff0000' : '#ff3333';
    } else if (appointment['moved'] === true) {
      return rowIsOdd ? '#ff9900' : '#ffad33';
    } else {
      return rowIsOdd ? '#ccccff' : '#e6e6ff';
    }
  }

  _populateCell(appointment, index, cell) {
    let leraar = cell.find('#leraar')[0];
    let subject = cell.find('#subject')[0];
    let lokaal = cell.find('#lokaal')[0];
    if (appointment !== 'False' && appointment !== false && appointment !== 'false') {
      leraar.text = appointment.teachers;
      subject.text = appointment.subjects;
      lokaal.text = appointment.locations;
    } else {
      leraar.text = '';
      subject.text = '';
      lokaal.text = '';
    }
  }

  _renderSchedule(appointments, weekIndex) {
    this._scheduleCollectionList[String(weekIndex)] = new CollectionView({
      top: 0, left: 0, right: 0, bottom: 0,
      class: 'scheduleCollection',
      columnCount: 5,
      itemCount: appointments.length,
      createCell: () => {
        let cellContainer = new Composite();
        new TextView({
          top: 'prev()',
          height: 20,
          id: 'leraar'
        }).appendTo(cellContainer);
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
        return cellContainer;
      },
      updateCell: (cell, index) => {
        let appointment = appointments[index];
        cell.background = this._cellBackGroundGenerator(appointment, index);
        this._populateCell(appointment, index, cell);
      }
    }).appendTo(this.tabFolder.find(`#weekTab${weekIndex}`));
  }


}

module.exports = (rootNavigationView) => {
  let roosterPage = new RoosterPage().appendTo(rootNavigationView);
};
