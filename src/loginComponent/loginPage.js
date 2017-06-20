/**
 * Created by Nathan on 19-6-2017.
 */
const {Button, Page, ui, Composite} = require('tabris');
const pageTitle = 'Inloggen';
const staticText = require('./staticText.json');
const MaterialInput = require('../widgets/MaterialInput');
module.exports = class LoginPage extends Page{

    constructor(properties) {
        super(Object.assign({title: pageTitle}, properties));
        this._createLoginSegment()
    }

    //loginSegment will be added to 'container'
    _createLoginSegment(container){
        let userCodeInput 
    }

}