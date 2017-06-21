const {Button, NavigationView, ui} = require('tabris');
const LoginPage = require('./loginComponent/loginPage');
const colors = require('./appSettings/colors')

let setUIelements = () => {
    ui.statusBar.set('background', colors.UI_bg_light)
};
setUIelements();


let rootNavigationView = new NavigationView({
    left: 0, top: 0, right: 0, bottom: 0,
    toolbarColor: colors.UI_bg,
    id: 'rootNavigationView'
}).appendTo(ui.contentView);

new LoginPage().appendTo(rootNavigationView);
