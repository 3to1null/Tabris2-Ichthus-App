/**
 * Created by Nathan on 8-7-2017.
 */
const {Composite, TextView} = require('tabris');
const colors = require('../appSettings/colors');

//TODO: Still need to add support for button in toast
module.exports = class Toast extends Composite {
    constructor(toastText, buttonText = false) {
        let properties = {
            bottom: 0, left: 0, right: 0, height: 60, elevation: 99,
            background: colors.toast_black,
            transform: {translationY: 60}
        };
        super(Object.assign({}, properties));
        this.toastText = toastText;
        this.buttonText = buttonText;
        this._createToast()
    }

    _createToast() {
        new TextView({
            bottom: 0, left: 24, right: 24, height: 60,
            text: this.toastText, textColor: colors.white_bg,
            font: '15px'
        }).appendTo(this)
    }
};
