/**
 * Created by Nathan on 23-6-2017.
 */
const baseURL = "http://192.168.2.4:8000/ichthus/"
module.exports = class Request {
    constructor(urlPath, data, headers, baseURLSpecial) {
        if (baseURLSpecial) {
            this._url = baseURLSpecial + urlPath;
        } else {
            this._url = baseURL + urlPath;
        }
        this._headers = headers || {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            };
        this._body = this._createRequestBody(data);

    }

    post(){
        console.log(this._url)
        return fetch(this._url, {
            method: 'post',
            headers: this._headers,
            body: this._body
        })
    }

    _createRequestBody(params) {
        //TODO: add standard params like __key and __sessionID
        let data = Object.entries(params);
        data = data.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
        let query = data.join('&');
        return query
    }
};