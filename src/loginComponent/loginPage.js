/**
 * Created by Nathan on 19-6-2017.
 */
const {ProgressBar, Page, ui, Composite, TextView} = require('tabris');
const MaterialInput = require('../widgets/MaterialInput');
const BigToolbar = require('../widgets/BigToolbar');
const FlatButton = require('../widgets/FlatButton');
const IndeterminateProgressBar = require('../widgets/IndeterminateProgressBar');
const colors = require('../appSettings/colors');

const toolbarHeight = '170'
const pageTitle = 'Inloggen';
const usernameInputLabel = 'Leerlingnummer';
const passwordInputLabel = 'Wachtwoord';

module.exports = class LoginPage extends Page {

    constructor(properties) {
        super(Object.assign({title: pageTitle}, properties));
        this._rootNavigationView = ui.contentView.find('#rootNavigationView');
        this._createLoginUI()
        this._createInputSegment();
    }

    _createLoginUI() {
        this._rootNavigationView.set('toolbarVisible', false);
        new BigToolbar({
            top: 0,
            left: 0,
            right: 0,
            height: toolbarHeight
        }, 'Inloggen', 'Gebruik je Ichthus account om in te loggen.').appendTo(this);
        new FlatButton(
            {
                bottom: 0, height: 50, right: 0, left: 0,
                background: colors.white_grey_bg, font: '19px', textColor: colors.UI_bg
            },
            'Inloggen', colors.black_grey, "right"
        ).appendTo(this)
    }

    //loginSegment will be added to 'container'
    _createInputSegment() {
        let inputContainer = new Composite({
            bottom: 50, top: toolbarHeight, left: 0, right: 0,
            elevation: 1,
            background: colors.white_bg
        }).appendTo(this);
        this._usernameInputWidget = new MaterialInput(
            {top: 5, left: 36, right: 36},
            usernameInputLabel
        ).appendTo(inputContainer);
        this._passwordInputWidget = new MaterialInput(
            {top: 'prev()', left: 36, right: 36},
            passwordInputLabel,
            'password'
        ).appendTo(inputContainer);
    }

}
