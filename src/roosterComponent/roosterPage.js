/**
 * Created by Nathan on 25-6-2017.
 */
const {Tab, Page, ui, Button, Composite, TextView, TabFolder, CollectionView} = require('tabris');
const MaterialInput = require('../widgets/MaterialInput');
const BigToolbar = require('../widgets/BigToolbar');
const FlatButton = require('../widgets/FlatButton');
const IndeterminateProgressBar = require('../widgets/IndeterminateProgressBar');
const colors = require('../appSettings/colors');
const getSchedule = require('./getSchedule');
const getWeekNumber = require('../globalFunctions/getWeekNumber');

const initialPageTitle = 'Rooster';

class RoosterPage extends Page {
  constructor(properties) {
    super(Object.assign({title: initialPageTitle}, properties));
    this._rootNavigationView = ui.contentView.find('#rootNavigationView');
    this._renderTabFolder();
    this._tabsLoaded = [];
    this._scheduleCollectionList = {};
    getSchedule().then((json) => {
      this._generateTabs(json);
      this.tabFolder.selection = this.tabFolder.find('#weekTab1')[0];
      this._renderSchedule(json[this.tabFolder.selection.id.substr(-1)], this.tabFolder.selection.id.substr(-1));
    }).catch((error) => console.log(error));
  }

  //renders the tab-bar and creates the tabfolder. It does create the tabs.
  _renderTabFolder() {
    this.tabFolder = new TabFolder({
      left: 0, right: 0, top: 0, bottom: 0,
      textColor: colors.white_bg,
      paging: true,
      tabMode: 'scrollable',
      background: colors.UI_bg
    }).appendTo(this);
  }

  _generateTabs(json) {
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

  _cellBackGroundGenerator(appointment, cellIndex){
    let rowIsOdd = false;
    if(cellIndex < 5 ||
      (cellIndex >= 10 && cellIndex < 15) ||
      (cellIndex >= 20 && cellIndex < 25) ||
      (cellIndex >= 30 && cellIndex < 35) ||
      (cellIndex >= 40 && cellIndex < 45)
    ){rowIsOdd = true;}
    if(appointment !== "False" && appointment !== false && appointment !== "false"){
      return rowIsOdd ? '#ccccff' : '#e6e6ff';
    }else if(appointment['cancelled'] === true){
      return rowIsOdd ? '#ff0000' : '#ff3333';
    }else if(appointment['moved'] === true){
      return rowIsOdd ? '#ff9900' : '#ffad33';
    }else{
      return rowIsOdd ? '#b3b3b3' : '#cccccc';
    }
  }

  _renderSchedule(appointments, weekIndex) {
    console.log(weekIndex);
    console.log(this.tabFolder.find(`#weekTab${weekIndex}`)[0]);
    // let leraar, subject, lokaal;
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
          id: "leraar"
        }).appendTo(cellContainer);
        new TextView({
          top: 'prev()',
          height: 20,
          id: "subject"
        }).appendTo(cellContainer);
        new TextView({
          top: 'prev()',
          height: 20,
          id: "lokaal"
        }).appendTo(cellContainer);
        return cellContainer
      },
      updateCell: (cell, index) => {
        let appointment = appointments[index];
        cell.background = this._cellBackGroundGenerator(appointment, index);
        let leraar = cell.find('#leraar')[0];
        let subject = cell.find('#subject')[0];
        let lokaal = cell.find('#lokaal')[0];
        if(appointment !== "False" && appointment !== false && appointment !== "false"){
          leraar.text = appointment.teachers;
          subject.text = appointment.subjects;
          lokaal.text = appointment.locations;
        }
      }
    }).appendTo(this.tabFolder.find(`#weekTab${weekIndex}`));
  }


}

module.exports = (rootNavigationView) => {
  let roosterPage = new RoosterPage().appendTo(rootNavigationView);
  return new Promise((resolve, reject) => {
  });
};
