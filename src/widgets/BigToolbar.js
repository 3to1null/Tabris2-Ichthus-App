const {Composite, TextView} = require('tabris');
const colors = require('../appSettings/colors');

module.exports = class BigToolbar extends Composite {

    constructor(properties, title, subTitle) {
        super(Object.assign({}, properties));
        this.title = title;
        this.subTitle = subTitle;
        this._createToolbar();
        this._createTitles();
    }

    _createToolbar() {
        this.set('background', colors.UI_bg);
        this.set('elevation', 4);
    }

    _createTitles() {
        if (this.subTitle !== undefined) {
            this._subTitleView = new TextView({
                left: 36, right: 24, bottom: 12,
                text: this.subTitle,
                font: '14px',
                textColor: colors.white_grey_bg
            }).appendTo(this);
        }
        this._titleView = new TextView({
            left: 36, right: 0, bottom: "prev() 10",
            text: this.title,
            font: '25px',
            textColor: colors.white_bg
        }).appendTo(this);
    }

    _createSubmitButton() {
        this._submitButton = new Composite
    }

};