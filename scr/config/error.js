//获取错误信息
const findErrorInfo = (err)=> {

    //通用错误
    if(err.ErrorCode===1000)
        return err.ErrorMessage;

    if(err.ErrorCode===1001)
        return "没有权限";
    if(err.ErrorCode===1002)
        return "数据不存在";
    if(err.ErrorCode===1003){//会话不存在
        // DeviceEventEmitter.emit('replaceRoute',{isLogin:false});
        return "登录异常，请重新登录";
    }
        
    if(err.ErrorCode===1004){//用户尚未点登录
        // DeviceEventEmitter.emit('replaceRoute',{isLogin:false});
        return "登录异常，请重新登录";
    }
        
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
    if(err.ErrorCode===1106){//会话被踢出
        // DeviceEventEmitter.emit('replaceRoute',{isLogin:false});
        return "您的账户在其他地方登录，请重新登录";
    }
        
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
    findErrorInfo,
}