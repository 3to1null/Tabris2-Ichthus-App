/**
 * Created by Nathan on 19-6-2017.
 */
const {Page, ui, Composite, TextView} = require('tabris');
const MaterialInput = require('../widgets/MaterialInput');
const BigToolbar = require('../widgets/BigToolbar');
const FlatButton = require('../widgets/FlatButton');
const IndeterminateProgressBar = require('../widgets/IndeterminateProgressBar');
const colors = require('../appSettings/colors');

const Request = require('../globalFunctions/Request');
const showToast = require('../globalFunctions/showToast');

const toolbarHeight = '170';
const pageTitle = 'Inloggen';
const usernameInputLabel = 'Leerlingnummer';
const passwordInputLabel = 'Wachtwoord';
const incorrectCredentialsMessage = "Leerlingnummer of wachtwoord is incorrect";
const noConnectionMessage = "Er kan geen verbinding gemaakt worden";

class LoginPage extends Page {

    //controls and constructs loginPage.
    constructor(properties) {
        super(Object.assign({title: pageTitle, id: '#loginPage'}, properties));
        this._rootNavigationView = ui.contentView.find('#rootNavigationView');
        this._createLoginUI();
        this._createInputSegment();
        this._logPage();
    }

    //logs opening of loginPage and sets screenName.
    _logPage(){
        firebase.Analytics.screenName = "loginScreen";
        firebase.Analytics.logEvent('loginpage_opened', {screen: 'loginScreen'})
    }

    //controls the generation of loginPage's UI.
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
                background: colors.white_grey_bg,
                font: '19px',
                textColor: colors.UI_bg,
                id: 'loginButton'
            },
            'Inloggen', colors.black_grey, "right"
        ).appendTo(this)
    }

    //generates inputs that will be added to page
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

    //called on button tap, controls the login process.
    _login() {
        return new Promise((resolve, reject) => {
            let PB = new IndeterminateProgressBar({left: 0, right:0, top: 0, height: 4}).appendTo(this._inputContainer);
            let userCode = this._usernameInputWidget.textInput;
            let password = this._passwordInputWidget.textInput;
            let data = {userCode: userCode, password: password};
            this._checkCredentials(data)
                .then((json) => {
                    //uses keys defined in localStorageKeys.txt
                    localStorage.setItem('__sessionID', json.sessionID);
                    localStorage.setItem('__key', json.key);
                    localStorage.setItem('__userCode', userCode);
                    localStorage.setItem('__userName', json.userName);
                    localStorage.setItem('isLoggedIn', 'true');
                    resolve()
                })
                .catch((error) => {
                    console.log(error);
                    PB.dispose();
                    reject(error)
                })
        });
    }

    //called in _login(), sends post request to API.
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
                            reject(Error(incorrectCredentialsMessage));
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

module.exports = (rootNavigationView) => {
    return new Promise((resolve, reject) => {
        const loginPage = new LoginPage().appendTo(rootNavigationView);
        let loginButton = loginPage.find('#loginButton');
        const finalLogin = () => {
            loginPage._login().then(() => {
                //resets default toolbar
                resolve()
            }).catch((error) => {
                showToast(String(error).substring(7));
                loginButton.once('tap', () => {
                    finalLogin();
                })
            });
            firebase.Analytics.logEvent('login_button', {screen: 'loginScreen', button: 'loginButton', action: 'tap'})
        };
        loginButton.once('tap', () => {
            finalLogin()
        });
    });
};
