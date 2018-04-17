import {env} from "../config";

const hostUrl = env.hostUrl;

module.exports = {
    hostUrl: hostUrl,
    getCookie: hostUrl + '/api/Session/Create',//创建会话
    login: hostUrl + '/api/Session/Login',//登录
    logOut: hostUrl + '/api/Session/Logout',//退出登录
    regist: hostUrl + '/api/Account/Register',//注册
    ResetPwd: hostUrl + '/api/Account/ResetPwd',//找回/重置密码
    getCode: hostUrl + '/api/Event/GetCode',//获取验证码
    getArea: hostUrl + '/api/System/AllDic',//获取城市信息

    getPaperList: hostUrl + '/api/Exam/GetPaperList',//获取试题列表
    getCommon: hostUrl + '/api/System/GetCommon',//获取共用音频地址

    examPackage: hostUrl + '/api/system/downfile',//试卷安装包地址

    startExam: hostUrl + '/api/Exam/StartExam',//开始考试
    getExamLog: hostUrl + '/api/Exam/GetExamLog',//获取考试记录详情
    submitExamTopic: hostUrl + '/api/Exam/SubmitExamTopic',//上传当前题目考试结果
    endExam: hostUrl + '/api/Exam/EndExam',//app 结束考试

    GetHomework: hostUrl + '/api/HomeWork/GetHomework',//获取作业
    ValidateTeacher: hostUrl + '/api/Account/ValidateTeacher',//验证教师
    JoinClass: hostUrl + '/api/Account/JoinClass',//加入班级
    GetClass: hostUrl + '/api/Account/GetClass',//得到当前班级信息
    QuitClass: hostUrl + '/api/Account/QuitClass',//退出班级

    protocal: hostUrl + '/agreement.html',//用户协议
    Report: hostUrl + '/api/Account/Report',//意见反馈
    Modify: hostUrl + '/api/Account/Modify',//个人信息

    CheckVersion: hostUrl + "/api/Version/CheckVersion",//检查版本
}