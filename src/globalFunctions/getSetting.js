const globalSettings = require('../appSettings/globalSettings.json');

module.exports = (settingName) => {
  //TODO get storagekey from globalSettings.json
  return localStorage.getItem(`-s-${settingName}`)
};
