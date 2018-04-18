import { define } from "../config"

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
        contentPath= define.downloadDest + '/'+ oriPath;
    }else {
        contentPath=examPath + '/' + oriPath;
    }
    return contentPath;
}
//查找图片路劲
const findPicturePath = (path, examPath) => {
    let path1=findPlayPath(path, examPath);
    if(path1==null) return "";
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

module.exports={
    isLastIndex,
    findPlayPath,
    findPicturePath,
    callOnceInInterval,
}