/**
 * Created by Nathan on 19-6-2017.
 */
const {ProgressBar, Page, ui, Composite, TextView} = require('tabris');
const MaterialInput = require('../widgets/MaterialInput');
const BigToolbar = require('../widgets/BigToolbar');
const FlatButton = require('../widgets/FlatButton');
const IndeterminateProgressBar = require('../widgets/IndeterminateProgressBar');
const colors = require('../appSettings/colors');

const Request = require('../globalFunctions/Request');

const toolbarHeight = '170'
const pageTitle = 'Inloggen';
const usernameInputLabel = 'Leerlingnummer';
const passwordInputLabel = 'Wachtwoord';
const incorrectCredentialsMessage = "Leerlingnummer of wachtwoord is incorrect";
const noConnectionMessage = "Er kan geen verbinding gemaakt worden";

module.exports = class LoginPage extends Page {

    constructor(properties) {
        super(Object.assign({title: pageTitle}, properties));
        this._rootNavigationView = ui.contentView.find('#rootNavigationView');
        this._createLoginUI()
        this._createInputSegment();
        this._logPage();
    }

    _logPage(){
        firebase.Analytics.screenName = "loginScreen";
        firebase.Analytics.logEvent('loginpage_opened', {screen: 'loginScreen'})
    }

    _createLoginUI() {
        this._rootNavigationView.set('toolbarVisible', false);
        new BigToolbar({
            top: 0,
            left: 0,
            right: 0,
            height: toolbarHeight
        }, 'Inloggen', 'Gebruik je Ichthus account om in te loggen.').appendTo(this);
        this._loginButton = new FlatButton(
            {
                bottom: 0, height: 50, right: 0, left: 0,
                background: colors.white_grey_bg, font: '19px', textColor: colors.UI_bg
            },
            'Inloggen', colors.black_grey, "right"
        ).appendTo(this)
        this._loginButton.once('tap', () => {
            this._login()
            firebase.Analytics.logEvent('login_button', {screen: 'loginScreen', button: 'loginButton', action: 'tap'})
        })
    }

    //loginSegment will be added to 'container'
    _createInputSegment() {
        this._inputContainer = new Composite({
            bottom: 50, top: toolbarHeight, left: 0, right: 0,
            elevation: 1,
            background: colors.white_bg
        }).appendTo(this);
        this._usernameInputWidget = new MaterialInput(
            {top: 5, left: 36, right: 36},
            usernameInputLabel
        ).appendTo(this._inputContainer);
        this._passwordInputWidget = new MaterialInput(
            {top: 'prev()', left: 36, right: 36},
            passwordInputLabel,
            'password'
        ).appendTo(this._inputContainer);
    }

    _login() {
        let PB = new IndeterminateProgressBar({left: 0, right:0, top: 0, height: 4}).appendTo(this._inputContainer);
        let userCode = this._usernameInputWidget.textInput;
        let password = this._passwordInputWidget.textInput;
        let data = {userCode: userCode, password: password};
        this._checkCredentials(data)
            .then(json => console.log(json))
            .catch((error) => {
                console.log(error);
                this._loginButton.once('tap', () => {
                    firebase.Analytics.logEvent('login_button', {screen: 'loginScreen', button: 'loginButton', action: 'tap'});
                    this._login();
                })
                PB.dispose()
            })
    }

    _checkCredentials(credentials){
        firebase.Analytics.logEvent('login_credentials_checking', {screen: 'loginScreen'});
        return new Promise((resolve, reject) => {
            new Request('login', credentials).post()
                //This syntax should be improved
                .then(((response) => {response.json()
                    .then(((json) => {
                        if (json.password !== "false") {
                            //Resolves the promise
                            firebase.Analytics.logEvent('login_credentials_checked', {screen: 'loginScreen', credentials: 'true'});
                            resolve(json)
                        } else {
                            reject(Error(incorrectCredentialsMessage))
                            firebase.Analytics.logEvent('login_credentials_checked', {screen: 'loginScreen', credentials: 'false'});
                        }
                    }))
                }), (error) => {
                    //error in fetch()
                    firebase.Analytics.logEvent('login_credentials_noConnection', {screen: 'loginScreen'});
                    reject(Error(noConnectionMessage))
                })
        })
    }
}
