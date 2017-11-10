const Request = require('../globalFunctions/Request');

module.exports = function (fromOfflineStorage=false) {
  return new Promise((resolve, reject) => {
    let offlineAgenda = localStorage.getItem('calendar');
    if(fromOfflineStorage === true && offlineAgenda !== null && offlineAgenda !== undefined){
      resolve(JSON.parse(offlineAgenda))
    }else{
      new Request('getCalendar').get().then((response => {response.json().then((json) => {
        localStorage.setItem('calendar', JSON.stringify(json));
        resolve(json)
      })}))
    }
  })
};



