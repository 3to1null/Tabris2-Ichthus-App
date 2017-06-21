/**
 * Created by Nathan on 19-6-2017.
 */
const {Page, ui, Composite, TextView} = require('tabris');
const MaterialInput = require('../widgets/MaterialInput');
const BigToolbar = require('../widgets/BigToolbar');
const colors = require('../appSettings/colors');

const pageTitle = 'Inloggen';
const usernameInputLabel = 'Leerlingnummer';
const passwordInputLabel = 'Wachtwoord';

module.exports = class LoginPage extends Page{

    constructor(properties) {
        super(Object.assign({title: pageTitle}, properties));
        this._rootNavigationView = ui.contentView.find('#rootNavigationView');
        this._createLoginUI()
        this._createInputSegment();
    }

    _createLoginUI(){
        this._rootNavigationView.set('toolbarVisible', false);
        new BigToolbar({top: 0, left: 0, right: 0, height: 180}, 'Inloggen', 'Gebruik je Ichthus account om in te loggen.').appendTo(this)
    }

    //loginSegment will be added to 'container'
    _createInputSegment(){
        this._usernameInputWidget = new MaterialInput(
            {top: 'prev() 25', left: 36, right: 36},
            usernameInputLabel
        ).appendTo(this);
        this._passwordInputWidget = new MaterialInput(
            {top: 'prev()', left: 36, right: 36},
            passwordInputLabel,
            'password'
        ).appendTo(this);
    }

}
