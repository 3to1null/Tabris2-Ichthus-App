const Request = require('../globalFunctions/Request');

module.exports  = function (path) {
  return new Promise((resolve, reject) => {
    new Request('files/list', {path: path}).get().then((response) => {response.json().then((json) => {
      resolve(json.files)
    })})
  });
};

