import {Dimensions} from 'react-native'
import { Platform } from 'react-native'


//屏幕宽高
const deviceH = Dimensions.get('window').height
const deviceW = Dimensions.get('window').width

//平台名
const instructions = Platform.select({
  ios: 'IOS',
  android: 'Android',
});

//颜色
const colors  = {
    theme: '#12b7f5',//主题色
    theme1: '#333333',//主题字体颜色
    border: '#d1d1d1',//导航分割线
    border1: '#e8e8e8',//普通分割线
    background: '#f8f8ff',//tabBar navBar 背景色
    background1: '#f0f5f8',//主题背景色
};

//var 下载路径
RNFS = require('react-native-fs');
const downloadDest=(instructions==="IOS"?RNFS.DocumentDirectoryPath:RNFS.ExternalDirectoryPath);

//以某字符串结尾
const isLastIndex=(minStr,maxStr)=>{
    if(minStr===undefined||maxStr===undefined){
        return false;
    }

    let aa=maxStr.length-minStr.length;
    let bb=maxStr.lastIndexOf(minStr);
    return (aa>=0 && bb===aa);
}
//查找播放路径
const findPlayPath=(path,examPath)=>{
    let oriPath=path.replace(/\\/g,"/");//替换反斜杠为斜杠
    let contentPath;
    let isCommon=oriPath.indexOf("common/");
    if(isCommon===0){//如果是共用音频
        contentPath=downloadDest + '/'+ oriPath;
    }else {
        contentPath=examPath + '/' + oriPath;
    }
    return contentPath;
}
const findPicturePath = (path, examPath) => {
    let path1=findPlayPath(path, examPath);
    if(path1==null) return "";
    return (instructions === 'IOS' ? '' : 'file://') + path1;
}
//获取错误信息
const findErrorInfo = (err)=> {

    //通用错误
    if(err.ErrorCode===1000)
        return err.ErrorMessage;

    if(err.ErrorCode===1001)
        return "没有权限";
    if(err.ErrorCode===1002)
        return "数据不存在";
    if(err.ErrorCode===1003)
        return "会话不存在";
    if(err.ErrorCode===1004)//用户尚未点登录
        return "您已被踢，请退出重新登录";
    if(err.ErrorCode===1005)
        return "频繁发送手机短信";
    if(err.ErrorCode===1006)
        return "参数为空";

    //会话模块
    if(err.ErrorCode===1101)
        return "非法的客户端";
    if(err.ErrorCode===1102)
        return "客户端协议版本不支持";
    if(err.ErrorCode===1103)
        return "客户端版本号不支持";
    if(err.ErrorCode===1104)
        return "服务端禁止新的登录会话";
    if(err.ErrorCode===1105)
        return "用户名或者密码错误";
    if(err.ErrorCode===1106)
        return "会话被踢出";
    if(err.ErrorCode===1107)
        return "用户被禁用";

    //用户模块
    if(err.ErrorCode===1201)
        return "手机号不合法或者不受支持";
    if(err.ErrorCode===1202)
        return "手机号已被其他用户注册";
    if(err.ErrorCode===1203)
        return "尚未获取验证码";
    if(err.ErrorCode===1204)
        return "用户名重复";
    if(err.ErrorCode===1205)
        return "手机验证码错误或者无效";
    if(err.ErrorCode===1206)
        return "密码不能为空";

    return "未定义的错误，ErrorCode="+err.ErrorCode;
}

module.exports = {
    SCREENWIDTH: deviceW,
    SCREENHEIGHT: deviceH,
    PLATNAME:instructions,
    COLORS:colors,
    DOWNLOADDOCUMENTPATH:downloadDest,
    version_ios:1,//苹果当前版本
    version_android:1,//安卓当前版本
    isLastIndex,
    findPlayPath,
    findPicturePath,
    findErrorInfo,
}