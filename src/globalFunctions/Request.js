/**
 * Created by Nathan on 23-6-2017.
 */
const baseURL = "http://192.168.2.4:8000/ichthus/";
module.exports = class Request {
    constructor(urlPath, data, headers, baseURLSpecial, requestTimeout) {
        if (baseURLSpecial) {
            this._url = baseURLSpecial + urlPath;
        } else {
            this._url = baseURL + urlPath;
        }
        this._headers = headers || {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            };
        this._body = this._createRequestBody(data);
        this._timeout = requestTimeout || 0;

    }

    post(){
        return fetch(this._url, {
            method: 'post',
            headers: this._headers,
            body: this._body,
            timeout: this._timeout
        })
    }

    get(){
        let getUrl = this._url + '?' + this._body;
        return fetch(getUrl, {
            method: 'get',
            headers: this._headers,
            timeout: this._timeout
        })
    }

    _createRequestBody(params) {
        if(!params){
            params = {}
        }
        params['__key'] = localStorage.getItem('__key');
        params['__sessionID'] = localStorage.getItem('__sessionID');
        params['__userCode'] = localStorage.getItem('__userCode');
        let data = Object.entries(params);
        data = data.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
        let query = data.join('&');
        return query
    }
};
