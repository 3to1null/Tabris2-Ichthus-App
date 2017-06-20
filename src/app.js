const {Button, NavigationView, ui} = require('tabris');
const LoginPage = require('./loginComponent/loginPage');

let rootNavigationView = new NavigationView({
    left: 0, top: 0, right: 0, bottom: 0
}).appendTo(ui.contentView);

new LoginPage().appendTo(rootNavigationView);
