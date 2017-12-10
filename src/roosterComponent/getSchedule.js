const Request = require('../globalFunctions/Request');
const showToast = require('../globalFunctions/showToast');

module.exports = function getSchedule(userCode="~me") {
  return new Promise((resolve, reject) => {
    let requestTimeout, showOldScheduleToast, showScheduleOldToast2Day, promiseResolved, oldScheduleToastMessage;
    let downloadedScheduleList = JSON.parse(localStorage.getItem('downloadedScheduleList')) || [];
    if(localStorage.getItem(`lastScheduleGetTime${userCode}`) === undefined || localStorage.getItem(`lastScheduleGetTime${userCode}`) === null){
      requestTimeout = 0;
    }else{
      let timePassedSinceLastSchedule = Math.floor(Date.now() / 1000) - parseInt(localStorage.getItem(`lastScheduleGetTime${userCode}`));
      if(timePassedSinceLastSchedule > 60 * 60 * 48){
        requestTimeout = 5000;
        showOldScheduleToast = true;
        oldScheduleToastMessage = 'Dit rooster is ouder dan twee dagen, lessen zouden in tussentijd veranderd kunnen zijn.'
      } else if(timePassedSinceLastSchedule > 60 * 60 * 24){
        requestTimeout = 2500;
        showOldScheduleToast = true;
        oldScheduleToastMessage = 'Dit rooster is ouder dan een dag, lessen zouden in tussentijd veranderd kunnen zijn.'
      } else if(timePassedSinceLastSchedule > 60 * 60){
        requestTimeout = 1500;
      } else{
        requestTimeout = 1000;
      }
      setTimeout(() => {
        if(localStorage.getItem(`lastScheduleGetTime${userCode}`) === undefined || localStorage.getItem(`lastScheduleGetTime${userCode}`) === null){
          reject(new Error('Request timed out, no offline schedule.'))
          //shouldn't be called!!
        }else if(!promiseResolved){
          console.log('offline req timeout custom');
          if(showOldScheduleToast){
            showToast(oldScheduleToastMessage)
          }
          resolve(JSON.parse(localStorage.getItem(`weekSchedule${userCode}`)));
        }
      }, requestTimeout + 1000);
    }



    new Request('getSchedule', {userCode: userCode}, false, false, requestTimeout).get().then((response) => {response.json().then(((json) => {
        localStorage.setItem(`lastScheduleGetTime${userCode}`, Math.floor(Date.now() / 1000));
        localStorage.setItem(`weekSchedule${userCode}`, JSON.stringify(json));
        downloadedScheduleList.push(userCode);
        localStorage.setItem('downloadedScheduleList', JSON.stringify(downloadedScheduleList));
        promiseResolved = true;
        resolve(json);
      }))}, (error) => {
        if(localStorage.getItem(`lastScheduleGetTime${userCode}`) === undefined || localStorage.getItem(`lastScheduleGetTime${userCode}`) === null){
          reject(error)
        }else{
          if(showOldScheduleToast){
            showToast('Het rooster is ouder dan een dag, lessen zouden in tussentijd veranderd kunnen zijn.')
          }else if(showScheduleOldToast2Day){
            showToast('Het rooster is meer dan 2 dagen oud, lessen zouden in tussentijd veranderd kunnen zijn.')
          }
          promiseResolved = true;
          resolve(JSON.parse(localStorage.getItem(`weekSchedule${userCode}`)));
        }
    });
  });
};
