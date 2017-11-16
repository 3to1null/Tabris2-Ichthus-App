firebase.Analytics.analyticsCollectionEnabled = true;

const {Button, NavigationView, ui} = require('tabris');
const handleLogin = require('./loginComponent/loginPage');
const colors = require('./appSettings/colors');

const isLoggedIn = require('./globalFunctions/isLoggedIn');

//sets basics UI settings that should be visible before anything else (theme, statusbar, etc.)
let setUIelements = () => {
    ui.statusBar.set('background', colors.UI_bg_light)
};

setUIelements();

let rootNavigationView = new NavigationView({
    left: 0, top: 0, right: 0, bottom: 0,
    toolbarColor: colors.UI_bg,
    id: 'rootNavigationView'
}).appendTo(ui.contentView);

//bootstraps the complete application with the exception of the login screen.
const bootstrapApp = (wasLoggedInOnStart=true) => {
    const AppDrawer = require('./appDrawer');
    const createRoosterPage = require('./roosterComponent/roosterPage');
    createRoosterPage(rootNavigationView);
    rootNavigationView.drawerActionVisible = true;
    let appDrawer = new AppDrawer(rootNavigationView);
    if(!wasLoggedInOnStart){
        rootNavigationView._children[0].dispose()
    }
};

if(isLoggedIn()){
    bootstrapApp(true)
}else{
    handleLogin(rootNavigationView).then(() => {
        rootNavigationView.set('toolbarVisible', true);
        bootstrapApp(false)
    }).catch((error) => {
        //this shouldn't get called, in case it does, something's wrong with the login procedure.
        console.log('fuck', error)
    })
}





