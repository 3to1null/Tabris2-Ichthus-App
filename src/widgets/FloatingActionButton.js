/**
 * Created by Nathan on 22-6-2017.
 */
const {Composite, TextView, Canvas, ImageView} = require('tabris');
const colors = require('../appSettings/colors');
const createIconCircle = require('../globalFunctions/createIconCircle');

if(device.version < 23){
  module.exports = function (properties) {
    this._size = properties.height || properties.width || 56;
    this._color = properties.background || properties.color || colors.accent;
    this._buttonContainer = new Composite({
      class: 'floatingActionButton',
      width: this._size, height: this._size,
      right: properties.right, left: properties.left,
      top: properties.top, bottom: properties.bottom,
      centerY: properties.centerY, centerX: properties.centerX,
    });
    this._canvas = new Canvas({
      width: this._size, height: this._size,
    }).appendTo(this._buttonContainer);
    createIconCircle(this._canvas, '', parseInt(this._size), this._color);
    new ImageView({
      top: 0, left: 0, right: 0, bottom: 0,
      image: properties.image
    }).appendTo(this._buttonContainer);
    return this._buttonContainer
  }
}else{
  module.exports = function(properties)  {
    this._size = properties.height || properties.width || 56;
    this._color = properties.background || properties.color || colors.accent;
    return new ImageView({
      class: 'floatingActionButton',
      width: this._size, height: this._size,
      right: properties.right, left: properties.left,
      top: properties.top, bottom: properties.bottom,
      centerY: properties.centerY, centerX: properties.centerX,
      cornerRadius: 28,
      highlightOnTouch: true,
      elevation: 6,
      background: this._color,
      image: properties.image
    })
  };
}



