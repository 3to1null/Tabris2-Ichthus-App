firebase.Analytics.analyticsCollectionEnabled = true;

const {Button, NavigationView, ui} = require('tabris');
const handleLogin = require('./loginComponent/handleLogin');
const RoosterPage = require('./roosterComponent/roosterPage');
const colors = require('./appSettings/colors');

const isLoggedIn = require('./globalFunctions/isLoggedIn');

let setUIelements = () => {
    ui.statusBar.set('background', colors.UI_bg_light)
};

setUIelements();

let rootNavigationView = new NavigationView({
    left: 0, top: 0, right: 0, bottom: 0,
    toolbarColor: colors.UI_bg,
    id: 'rootNavigationView'
}).appendTo(ui.contentView);

const bootstrapApp = () => {
    let roosterPage = new RoosterPage().appendTo(rootNavigationView);
    console.log(rootNavigationView)
};

if(isLoggedIn()){
    bootstrapApp()
}else{
    handleLogin(rootNavigationView).then().catch((error) => {console.log(error)})
}





