const Request = require('../globalFunctions/Request');

module.exports = function getSchedule(user) {
  return new Promise((resolve, reject) => {
    let requestTimeout;
    if(localStorage.getItem('lastScheduleGetTime') === undefined){
      requestTimeout = 0;
    }else{
      let timePassedSinceLastSchedule = Math.floor(Date.now() / 1000) - parseInt(localStorage.getItem('lastScheduleGetTime'));
      if(timePassedSinceLastSchedule > 60 * 60 * 32){
       requestTimeout = 3000;
      }else if(timePassedSinceLastSchedule > 60 * 60){
        requestTimeout = 2000;
      }else{
        requestTimeout = 1000;
      }
    }
    new Request('getSchedule', false, false, false, requestTimeout).get().then((response) => {response.json().then(((json) => {
        localStorage.setItem('lastScheduleGetTime', Math.floor(Date.now() / 1000));
        localStorage.setItem('weekSchedule', json);
        resolve(json);
      }))}, (error) => {
        resolve(JSON.parse(localStorage.getItem('weekSchedule')))
    })
  });
};
