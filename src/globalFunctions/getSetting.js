const globalSettings = require('../appSettings/globalSettings.json');
const toBoolean = require('../globalFunctions/toBoolean');

module.exports = (settingName) => {
  let settingItem = globalSettings.filter(setting => setting.name === settingName)[0];
  if(localStorage.getItem(String(settingItem.storageKey)) !== null){
    return toBoolean(localStorage.getItem(String(settingItem.storageKey)));
  }else{
    return toBoolean(settingItem.default);
  }
};
