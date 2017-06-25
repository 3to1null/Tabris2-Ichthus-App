firebase.Analytics.analyticsCollectionEnabled = true;

const {Button, NavigationView, ui} = require('tabris');
const LoginPage = require('./loginComponent/loginPage');
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

if(isLoggedIn()){
    bootstrapApp()
}else{
    let loginPage = new LoginPage().appendTo(rootNavigationView);
    loginPage.on('dispose', () =>{
        bootstrapApp();
        delete loginPage
    })

}

let bootstrapApp = () => {
    
};

firebase.Messaging.on('message',
    ({data}) => console.log(JSON.stringify(data))
);
