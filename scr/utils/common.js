import { define } from "../config"

//以某字符串结尾
const isLastIndex = (minStr, maxStr) => {
    if (minStr === undefined || maxStr===null || maxStr === undefined || minStr === null ) {
        return false;
    }

    let aa = maxStr.length - minStr.length;
    let bb = maxStr.lastIndexOf(minStr);
    return (aa >= 0 && bb === aa);
}

//查找播放路径
const findPlayPath = (path, examPath) => {
    let oriPath = path.replace(/\\/g, "/");//替换反斜杠为斜杠
    let contentPath;
    let isCommon = oriPath.indexOf("common/");
    if (isCommon === 0) {//如果是共用音频
        contentPath = define.downloadDest + '/' + oriPath;
    } else {
        contentPath = examPath + '/' + oriPath;
    }
    return contentPath;
}
//查找图片路劲
const findPicturePath = (path, examPath) => {
    let path1 = findPlayPath(path, examPath);
    if (path1 == null) return "";
    return (define.PLATNAME === 'IOS' ? '' : 'file://') + path1;
}

let isCalled = false, timer;
/** 
 * @param functionTobeCalled 被包装的方法 
 * @param interval 时间间隔，可省略，默认600毫秒 
 */
const callOnceInInterval = (functionTobeCalled, interval = 600) => {
    if (!isCalled) {
        isCalled = true;
        clearTimeout(timer);
        timer = setTimeout(() => {
            isCalled = false;
        }, interval);
        return functionTobeCalled();
    }
};




Date.prototype.format = function (format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}
const getTimeStr = (timestamp, formatStyle) => {
    let newDate = new Date();
    newDate.setTime(timestamp * 1000);
    return newDate.format(formatStyle);
}
const getTimeCha = (timestamp1, timestamp2) => {
    let minute = 60;//1分钟
    let hour = minute * 60;//一小时
    let day = hour * 24;//一天

    timeCha = timestamp2 - timestamp1;
    // timeCha = 828399;

    let dayNum = (timeCha / day).toFixed(0);
    let hourNum = ((timeCha % day) / hour).toFixed(0);
    let minuteNum = ((timeCha % hour) / minute).toFixed(0);
    let miaoNum = timeCha % minute;
    if (timeCha > day) {
        return dayNum + "天 " + hourNum + "小时 " + minuteNum + "分钟 " + miaoNum + "秒";
    }
    if(timeCha>hour){
        return hourNum + "小时 " + minuteNum + "分钟 " + miaoNum + "秒";
    }
    if(timeCha>minute){
        return minuteNum + "分钟 " + miaoNum + "秒";
    }
    return miaoNum + "秒";
}



module.exports = {
    isLastIndex,
    findPlayPath,
    findPicturePath,
    callOnceInInterval,
    getTimeStr,
    getTimeCha,
}