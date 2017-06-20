/**
 * Created by Nathan on 19-6-2017.
 */
const {Button, Page, ui, Composite, TextView} = require('tabris');
const MaterialInput = require('../widgets/MaterialInput');

const pageTitle = 'Inloggen';
const usernameInputLabel = 'Leerlingnummer';
const passwordInputLabel = 'Wachtwoord';

module.exports = class LoginPage extends Page{

    constructor(properties) {
        super(Object.assign({title: pageTitle}, properties));
        this._createLoginSegment()
    }

    //loginSegment will be added to 'container'
    _createLoginSegment(){
        new TextView({
            top: 15, left: 1, right: 0,
            text: 'test',
            font: '18px',
            textColor: "#ff0000"
        }).appendTo(this)
        this._usernameInputWidget = new MaterialInput(
            {top: 'prev() 15', left: 30, right: 30},
            usernameInputLabel
        ).appendTo(this)
    }

}
