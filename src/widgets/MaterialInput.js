/**
 * Created by Nathan on 20-6-2017.
 */
const {Composite, TextInput, TextView} = require('tabris');
const colors = require("../appSettings/colors");
module.exports = class MaterialInput extends Composite {

    constructor(properties, label, type, font) {
        super(Object.assign({}, properties));
        this._properties = properties;
        this.textLabel = properties.text || label;
        this.inputType = properties.type || type || 'default';
        this.fontSize = properties.font || font || '17px';
        this._createWidget()
    }

    _createWidget() {
        this.inputWidget = this._createInput();
        this.textLabel = this._createLabelTextView();
        this.append(this.inputWidget, this.textLabel);
        this.inputWidget.on('focus', () => {
            this.textLabel.set('textColor', colors.accent);
            this.textLabel.animate({
                transform: {
                    scaleX: 0.75,
                    scaleY: 0.75,
                    translationY: -20,
                    translationX: -37
                }
            })
        })
    }

    _createInput() {
        return new TextInput({
            top: 5, left: 0, right: 0,
            message: "",
            type: this.inputType,
            borderColor: colors.accent
        })

    }

    _createLabelTextView() {
        return new TextView({
            top: 15, left: 1, right: 0,
            text: this.textLabel,
            font: this.fontSize,
            textColor: colors.black_grey
        })
    }

    get textInput(){
        return this.inputWidget.get('text');
    }
};
