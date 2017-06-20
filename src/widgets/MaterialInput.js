/**
 * Created by Nathan on 20-6-2017.
 */
const {Composite, TextInput, TextView} = require('tabris');
const color__blackGrey = "rgba(0, 0, 0, 0.5)"

module.exports = class MaterialInput extends Composite{

    constructor (properties, label, type, font) {
        super(Object.assign({}, properties));
        this.textLabel = label;
        this.inputType = type || 'default';
        this.fontSize = font || '17px';
        this._createWidget()
    }

    _createWidget(){
        this.inputWidget = this._createInput();
        this.textLabel = this._createLabelTextView();
        this.append(textInput, textLabel);
        this.inputWidget.on('focus', () => {
            this.textLabel.animate({
                transform: {
                    scaleX: 0.8,
                    scaleY: 0.8,
                    translationY: -20,
                    translationX: -35
                }
            })
        })
    }

    _createInput(){
        return new TextInput({
            top: 5, left: 0, right: 0,
            message: "",
            type: this.inputType
        })
    }

    _createLabelTextView(){
        return new TextView({
            top: 15, left: 1, right: 0,
            text: this.textLabel,
            font: this.fontSize,
            textColor: color__blackGrey
        })
    }
}