/**
 * Created by Nathan on 8-7-2017.
 */
const {ui} = require('tabris');
const Toast = require('../widgets/Toast');

module.exports = (toastText, time=3000) => {
    let toast = new Toast(toastText).appendTo(ui.contentView)
    toast.animate({transform: {translationY: "0"}}, {delay: 0, duration: 300, easing: "ease-out"});
    toast.animate({transform: {translationY: "50"}}, {delay: 3000, duration: 200, easing: "ease-in"})
        .then(() => {
            toast.dispose();
        })
        .catch((e) => {console.log(e)});
};