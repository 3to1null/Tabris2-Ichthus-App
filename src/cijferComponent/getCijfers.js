const Request = require('../globalFunctions/Request');

module.exports  = function (periode, fromOfflineStorage, forceOfflineStorage) {
  return new Promise((resolve, reject) => {
    const offlineCijferlijst = localStorage.getItem(`cijferlijst${String(periode)}`);
    if(fromOfflineStorage && offlineCijferlijst !== null && offlineCijferlijst !== undefined && offlineCijferlijst !== '[]') {
      resolve(JSON.parse(offlineCijferlijst))
    }else if((offlineCijferlijst === null || offlineCijferlijst === undefined) && fromOfflineStorage && forceOfflineStorage){
      reject('NoOfflineCijferlijst');
    }else{
      if((parseInt(Date.now()) - parseInt(localStorage.getItem(`cijferlijst${String(periode)}LastUpdated`)) > 10 * 1000)
        || localStorage.getItem(`cijferlijst${String(periode)}LastUpdated`) === null){
        new Request('getCijfers', {periode: periode}).post().then((response) => {response.json().then((json) =>{
          localStorage.setItem(`cijferlijst${String(periode)}`, JSON.stringify(json));
          localStorage.setItem(`cijferlijst${String(periode)}LastUpdated`, Date.now());
          resolve(json)
        })}, ((error) => {
          reject(error)
        }))
      } else {
        resolve(JSON.parse(offlineCijferlijst));
      }

    }
  });
};

