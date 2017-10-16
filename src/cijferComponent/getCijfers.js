const Request = require('../globalFunctions/Request');

module.exports  = function (periode, fromOfflineStorage, forceOfflineStorage) {
  return new Promise((resolve, reject) => {
    const offlineCijferlijst = localStorage.getItem(`cijferlijst${String(periode)}`);
    if(fromOfflineStorage && offlineCijferlijst !== null && offlineCijferlijst !== undefined && offlineCijferlijst !== '[]') {
      resolve(JSON.parse(offlineCijferlijst))
    }else if((offlineCijferlijst === null || offlineCijferlijst === undefined) && fromOfflineStorage && forceOfflineStorage){
      reject('NoOfflineCijferlijst');
    }else{
        new Request('getCijfers', {periode: periode}).post().then((response) => {response.json().then((json) =>{
          localStorage.setItem(`cijferlijst${String(periode)}`, JSON.stringify(json));
          resolve(json)
        })}, ((error) => {
          reject(error)
        }))
    }
  });
};

