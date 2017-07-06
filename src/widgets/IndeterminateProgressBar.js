/**
 * Created by Nathan on 23-6-2017.
 */
const {Composite} = require('tabris');
const colors = require('../appSettings/colors');
const delay = 20;

module.exports = class IndeterminateProgressBar extends Composite {

    constructor(properties) {
        super(Object.assign({}, properties));
        this._properties = properties;
        this._screenWidth = parseInt(screen.width);
        this._createSlidingBar();
    }

    _createSlidingBar() {
        let barWidth = parseInt(this._screenWidth / 2.5);
        this._slidingBar = new Composite({
            left: 0, width: barWidth, top: 0, bottom: 0,
            background: colors.accent,
            transform: {translationX: -(barWidth + delay)}
        }).appendTo(this);

        this._Animation();
    }

    _Animation() {
        this._slidingBar.animate(
            {transform: {translationX: this._screenWidth + delay + delay}},
            {duration: 1000, easing: 'ease-in-out', repeat: 9999}
        )
    }

};