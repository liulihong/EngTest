// const hostUrl = 'http://139.196.111.38:8084';
// const hostUrl = 'http://192.168.12.150:28071';//小英电脑
const hostUrl = 'http://tsk.eqd.17work.cn';//192.168.12.8
// const hostUrl = 'http://tsk.demo.17work.cn';//外网测试账号

module.exports = {
    hostUrl: hostUrl,
    getCookie: hostUrl + '/api/Session/Create',//创建会话
    login: hostUrl + '/api/Session/Login',//登录
    logOut: hostUrl + '/api/Session/Logout',//退出登录
    regist: hostUrl + '/api/Account/Register',//注册
    getCode: hostUrl + '/api/Event/GetCode',//获取验证码
    getArea: hostUrl + '/api/System/AllDic',//获取城市信息
    getPaperList: hostUrl + '/api/Exam/GetPaperList',//获取试题列表
    getCommon: hostUrl + '/api/System/GetCommon',//获取共用音频地址

    startExam: hostUrl + '/api/Exam/StartExam',//开始考试
    getExamLog: hostUrl + '/api/Exam/GetExamLog',//获取考试记录详情
    submitExamTopic: hostUrl + '/api/Exam/SubmitExamTopic',//上传当前题目考试结果
    endExam: hostUrl + '/api/Exam/EndExam',//app 结束考试

    
    ValidateTeacher: hostUrl + '/api/Account/ValidateTeacher',//验证教师
    JoinClass: hostUrl + '/api/Account/JoinClass',//加入班级

    protocal: 'http://tsk.17work.com.cn/agreement.html',//用户协议
}