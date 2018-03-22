// const hostUrl = 'http://139.196.111.38:8084';
// const hostUrl = 'http://192.168.12.150:28071';//小英电脑
// const hostUrl = 'http://tsk.eqd.17work.cn';//192.168.12.8
const hostUrl = 'http://tsk.demo.17work.cn';//外网测试账号

module.exports = {
    hostUrl: hostUrl,
    getCookie: hostUrl + '/api/Session/Create',
    login: hostUrl + '/api/Session/Login',
    logOut: hostUrl + '/api/Session/Logout',
    regist: hostUrl + '/api/Account/Register',
    getCode: hostUrl + '/api/Event/GetCode',
    getArea: hostUrl + '/api/System/AllDic',
    getPaperList: hostUrl + '/api/Exam/GetPaperList',
    getCommon: hostUrl + '/api/System/GetCommon',
}