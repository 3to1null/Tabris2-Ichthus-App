const Request = require('../globalFunctions/Request');
const showToast = require('../globalFunctions/showToast');

module.exports = function getSchedule(userCode="~me") {
  return new Promise((resolve, reject) => {
    let requestTimeout, showScheduleOldToast1Day, showScheduleOldToast2Day;
    let downloadedScheduleList = JSON.parse(localStorage.getItem('downloadedScheduleList')) || [];
    if(localStorage.getItem(`lastScheduleGetTime${userCode}`) === undefined){
      requestTimeout = 0;
    }else{
      let timePassedSinceLastSchedule = Math.floor(Date.now() / 1000) - parseInt(localStorage.getItem(`lastScheduleGetTime${userCode}`));
      if(timePassedSinceLastSchedule > 60 * 60 * 48){
        requestTimeout = 0;
        showScheduleOldToast2Day = true;
      } else if(timePassedSinceLastSchedule > 60 * 60 * 24){
        requestTimeout = 3000;
        showScheduleOldToast1Day = true;
      } else if(timePassedSinceLastSchedule > 60 * 60){
        requestTimeout = 2000;
      } else{
        requestTimeout = 1000;
      }
    }
    new Request('getSchedule', {userCode: userCode}, false, false, requestTimeout).get().then((response) => {response.json().then(((json) => {
        localStorage.setItem(`lastScheduleGetTime${userCode}`, Math.floor(Date.now() / 1000));
        localStorage.setItem(`weekSchedule${userCode}`, JSON.stringify(json));
        downloadedScheduleList.push(userCode);
        localStorage.setItem('downloadedScheduleList', JSON.stringify(downloadedScheduleList));
        resolve(json);
      }))}, (error) => {
        if(showScheduleOldToast1Day){
          showToast('Het rooster is ouder dan een dag, lessen zouden in tussentijd veranderd kunnen zijn.')
        }else if(showScheduleOldToast2Day){
          showToast('Het rooster is meer dan 2 dagen oud, lessen zouden in tussentijd veranderd kunnen zijn.')
        }
        resolve(JSON.parse(localStorage.getItem(`weekSchedule${userCode}`)));
    });
  });
};
