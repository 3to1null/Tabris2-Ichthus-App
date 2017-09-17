/**
 * Created by Nathan on 22-6-2017.
 */
const {Composite, TextView} = require('tabris');
colors = require('../appSettings/colors');
module.exports = class FlatButton extends Composite {

    //highlightColor is used on android versions < 6.0
    //TODO: get all props from properties
    constructor(properties, buttonText, highlightColor, alignment) {
        super(Object.assign({}, properties));
        this._properties = properties;
        this._text = buttonText;
        this._highlightColor = highlightColor || colors.divider_2;
        this._textAlignment = alignment || "center";
        this._highlightOnTouch = (device.version >= 23);
        this.set('highlightOnTouch', this._highlightOnTouch);
        this._createButton();
    }

    _createButton() {
        if (device.version < 23) {
            new Composite({
                top: 0, left: 0, bottom: 0, right: 0,
                background: this._highlightColor
            }).appendTo(this)
        }
        this._textComposite = new Composite({
            top: 0, right: 0, left: 0, bottom: 0,
            background: this._properties.background || colors.accent,
        }).appendTo(this);
        this._textView = new TextView({
            top: 0, right: 36, left: 36, bottom: 0,
            maxLines: 1,
            font: this._properties.font || '16px',
            alignment: this._textAlignment,
            textColor: this._properties.textColor || colors.white_bg,
            text: this._text
        }).appendTo(this._textComposite);
        if (device.version < 23) {
            this.on("touchStart", () => {
                this._textComposite.animate({opacity: 0.5}, {duration: 150, easing: "ease-out"});
            });
            this.on("touchCancel", () => {
                this._textComposite.animate({opacity: 1}, {duration: 200, easing: "ease-in"});
            });
            this.on("touchEnd", () => {
                this._textComposite.animate({opacity: 1}, {duration: 200, easing: "ease-in"});
            });
        }

    }

    get text() {
        return this._text;
    }

    set text(value) {
        this._text = value;
    }
};
