/**
 * Created by Nathan on 25-6-2017.
 */
const {Tab, Page, ui, Button, Composite, TextView, TabFolder} = require('tabris');
const MaterialInput = require('../widgets/MaterialInput');
const BigToolbar = require('../widgets/BigToolbar');
const FlatButton = require('../widgets/FlatButton');
const IndeterminateProgressBar = require('../widgets/IndeterminateProgressBar');
const colors = require('../appSettings/colors');
const getSchedule = require('./getSchedule');
const getWeekNumber = require('../globalFunctions/getWeekNumber');

const initialPageTitle = "Rooster";

class RoosterPage extends Page {
    constructor(properties) {
        super(Object.assign({title: initialPageTitle}, properties));
        this._rootNavigationView = ui.contentView.find('#rootNavigationView');
        this._renderTabFolder();
        getSchedule().then((json) => {this._generateTabs(json)}).catch((error) => console.log(error));
    }

    //renders the tab-bar and creates the tabfolder. It does create the tabs.
    _renderTabFolder(){
      this.tabFolder = new TabFolder({
        left: 0, right: 0, top: 0, bottom: 0,
        textColor: colors.white_bg,
        paging: true,
        tabMode: 'scrollable',
        background: colors.UI_bg
      }).appendTo(this)
    }

    _generateTabs(json){
        let firstWeekNumber = getWeekNumber(new Date()) - 1;
        this._tabList = [];
        for(let weekIndex = 0; weekIndex < 7; weekIndex++) {
          let tabTitle;
          if (weekIndex === 0) {
            tabTitle = 'Vorige week'
          }
          else if (weekIndex === 1) {
            tabTitle = 'Deze week'
          }
          else if (weekIndex === 2) {
            tabTitle = 'Volgende week'
          }
          else {
            tabTitle = `Week ${firstWeekNumber + weekIndex}`
          }
          let tmp_tab = new Tab({
            title: tabTitle,
            id: `weekTab${weekIndex}`,
            background: colors.white_bg,
          });
          this._tabList.push(tmp_tab);
          tmp_tab.appendTo(this.tabFolder)
        }
    }

    _renderSchedule(){
        new Button({
            centerX: 0, centerY: 0,
            text: 'test'
        }).on('select', () => {
            new Request('getSchedule').get().then()
        })
    }


}

module.exports = (rootNavigationView) => {
    let roosterPage = new RoosterPage().appendTo(rootNavigationView);
    return new Promise((resolve, reject) => {})
};
