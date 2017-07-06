/**
 * Created by Nathan on 28-6-2017.
 */
const LoginPage = require('./loginPage');

module.exports = function (rootNavigationView) {
    console.log('tes')
    return new Promise((resolve, reject) => {
        const loginPage = new LoginPage().appendTo(rootNavigationView);
        console.log('test')
        let loginButton = loginPage.find('#loginButton')
        loginButton.on('tap', () => {
            _login()
        });

        let _login = () => {
            let PB = new IndeterminateProgressBar({
                left: 0,
                right: 0,
                top: 0,
                height: 4
            }).appendTo(this._inputContainer);
            let userCode = this._usernameInputWidget.textInput;
            let password = this._passwordInputWidget.textInput;
            let data = {userCode: userCode, password: password};
            this._checkCredentials(data)
                .then((json) => {
                    //uses keys defined in localStorageKeys.txt
                    localStorage.setItem('__sessionID', json.sessionID);
                    localStorage.setItem('__key', json.key);
                    localStorage.setItem('isLoggedIn', 'true');
                })
                .catch((error) => {
                    console.log(error);
                    this._loginButton.once('tap', () => {
                        firebase.Analytics.logEvent('login_button', {
                            screen: 'loginScreen',
                            button: 'loginButton',
                            action: 'tap'
                        });
                        this._login();
                    });
                    PB.dispose()
                })
        };

        let _checkCredentials = (credentials) => {
            new Event('loggedIn');
            firebase.Analytics.logEvent('login_credentials_checking', {screen: 'loginScreen'});
            return new Promise((resolve, reject) => {
                new Request('login', credentials).post()
                    //This syntax should be improved
                    .then(((response) => {
                        response.json()
                            .then(((json) => {
                                if (json.password !== "false") {
                                    //Resolves the promise
                                    firebase.Analytics.logEvent('login_credentials_checked', {
                                        screen: 'loginScreen',
                                        credentials: 'true'
                                    });
                                    resolve(json)
                                } else {
                                    reject(Error(incorrectCredentialsMessage));
                                    firebase.Analytics.logEvent('login_credentials_checked', {
                                        screen: 'loginScreen',
                                        credentials: 'false'
                                    });
                                }
                            }))
                    }), (error) => {
                        //error in fetch()
                        firebase.Analytics.logEvent('login_credentials_noConnection', {screen: 'loginScreen'});
                        reject(Error(noConnectionMessage))
                    })
            })
        };
    })
}