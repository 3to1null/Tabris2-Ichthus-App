const Request = require('../globalFunctions/Request');

module.exports  = function (path) {
  //TODO: Add error handlers.
  return new Promise((resolve, reject) => {
    new Request('files/list', {path: path}).get().then((response) => {response.json().then((json) => {
      //remove first 2 and last 1 chars.
      localStorage.setItem('files_authToken', String(json.auth).substring(2).slice(0,-1));
      let cookieString = "";
      //transform cookie dict in cookiestring.
      for(let cookie in json.ocCookies){
        let tempString = `${cookie}=${json.ocCookies[cookie]}; `;
        cookieString = `${cookieString}${tempString}`
      }
      localStorage.setItem('files_cookies', cookieString);
      resolve(json.files)
    })})
  });
};

