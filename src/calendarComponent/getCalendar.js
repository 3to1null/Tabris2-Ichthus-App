const Request = require('../globalFunctions/Request');

module.exports = function (fromOfflineStorage=false) {
  return new Promise((resolve, reject) => {
    let offlineAgenda = localStorage.getItem('calendar');
    if(fromOfflineStorage === true && offlineAgenda !== null && offlineAgenda !== undefined && offlineAgenda.length > 5){
      resolve(JSON.parse(offlineAgenda))
    }else{
      new Request('calendar/get').get().then((response => {response.json().then((json) => {
        localStorage.setItem('calendar', JSON.stringify(json));
        resolve(json)
      })}))
    }
  })
};



