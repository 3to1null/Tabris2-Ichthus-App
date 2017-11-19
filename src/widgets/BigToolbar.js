const {Composite, TextView} = require('tabris');
const colors = require('../appSettings/colors');

module.exports = class BigToolbar extends Composite {

    constructor(properties, title, subTitle, background) {
        super(Object.assign({}, properties));
        this.title = properties.title || title;
        this.animateToBigToolbar = properties.animateToBigToolbar || false;
        this.height = properties.height;
        this.subTitle = properties.subTitle || subTitle;
        this.background = background || colors.UI_bg;
        this._createToolbar();
        this._createTitles();
    }

    _createToolbar() {
        this.set('background', this.background);
        this.set('elevation', 4);
        if(this.animateToBigToolbar){
          this.set('transform', {translationY: - (this.height - 56)})
        }
        this.animate({transform: {translationY: "0"}}, {delay: 0, duration: 300, easing: "ease-out"});
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

    

    // _createSubmitButton() {
    //     this._submitButton = new Composite
    // }

};
