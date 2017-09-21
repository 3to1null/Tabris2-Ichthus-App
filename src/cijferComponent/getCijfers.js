const Request = require('../globalFunctions/Request');

module.exports  = function () {
  new Request('getCijfers', {periode: 1}).post().then()
};
