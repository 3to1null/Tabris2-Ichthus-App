/**
 * Created by Nathan on 25-6-2017.
 */
const {Page, ui, Composite, TextView} = require('tabris');
const MaterialInput = require('../widgets/MaterialInput');
const BigToolbar = require('../widgets/BigToolbar');
const FlatButton = require('../widgets/FlatButton');
const IndeterminateProgressBar = require('../widgets/IndeterminateProgressBar');
const colors = require('../appSettings/colors');

module.exports = class RoosterPage extends Page {
    constructor() {
        super(Object.assign({title: pageTitle}, properties));
        this._rootNavigationView = ui.contentView.find('#rootNavigationView');
        this._renderSchedule();
    }

    _renderSchedule(){
        
    }


};