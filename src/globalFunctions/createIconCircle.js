const {device} = require('tabris');
const colors = require('../appSettings/colors');


module.exports = (canvas, text, size, backgroundColor) => {
  let canvasSizeX, canvasSizeY, radius, fontSize;
  switch (size){
    case 'small':
      canvasSizeX = 42;
      canvasSizeY = 50;
      radius = 18;
      fontSize = '18px';
      break;
    case 'cijferDetailView':
      canvasSizeX = 60;
      canvasSizeY = 60;
      radius = 24;
      fontSize = '24px';
      break;
    default:
      canvasSizeX = size;
      canvasSizeY = size;
      radius = size / 2 - 2;
      fontSize = radius < 24 ? `${radius}px` : '24px'

  }
  const scaleFactor = device.scaleFactor;
  const context = canvas.getContext('2d', canvasSizeX * scaleFactor, canvasSizeY * scaleFactor);
  context.scale(scaleFactor, scaleFactor);
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  context.beginPath();
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  context.fillStyle = backgroundColor || colors.accent;
  context.fill();

  context.fillStyle = colors.white_bg;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = fontSize;
  context.fillText(text, centerX, centerY);
};
