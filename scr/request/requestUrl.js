const hostUrl = 'http://139.196.111.38:8084';
// const hostUrl = 'http://192.168.12.144:28071';

module.exports = {
    getCookie: hostUrl + '/api/Session/Create',
    login: hostUrl + '/api/Session/Login',
}