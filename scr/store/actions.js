import {
    LOGIN,
    PAPERLIST,
    ERROR,
    LOADING,
    GETCOMMON,
    SAVEDOWNURL,
    STARTDOWN,
    DOWNFAILD,
    CURRENTEXAMPATH,
    GETEXAMDETAIL,
    SAVEPLAYTIME,
    GETTOPICINFO,
    GETNEXTSTEPTOPIC,
    SAVEANSWERS,
    SAVEANSDIC,
    GETANSWERBLOW,
    DOWNLOADINFO,
} from './actionTypes';
import { Alert } from "react-native";
import { fetchGet, fetchPost } from "../request/fetch";
import { getCode, regist, login, getPaperList, getCommon, logOut, Modify } from "../request/requestUrl";
import RNFS from "react-native-fs";
import utils from '../utils';

// export const increase = (name) => ({ type: INCREASE, name });
// export const decrease = (name) => ({ type: DECREASE, name });
// export const reset = (name, initVal) => ({ type: RESET, initVal, name });

export const Login = (obj, callBack) => {
    return {
        // promise : fetchPost(login,obj).then(res =>res),
        promise: fetchPost(login, obj).then(res => {
            // debugger
            if (res.ErrorCode !== undefined) {
                Alert.alert("", utils.findErrorInfo(res));
            } else {
                callBack();
                return res;
            }
            return null;
        }),
        types: [LOADING, LOGIN, ERROR]
    }
}
export const motifyMyInfo = (paramts, callBack) => {
    return {
        promise: fetchPost(Modify, paramts).then((result) => {

            if (result.ErrorCode !== undefined) {
                Alert.alert("", utils.findErrorInfo(result));
            } else {
                // alert(JSON.stringify(result));
                callBack();
            }
            return result;
        }),
        types: ["", LOGIN, ERROR]
    }
}
export const LogOut = (callBack) => {
    return {
        promise: fetchPost(logOut, {}).then(() => {
            callBack();
            return null;
        }),
        types: ['', LOGIN, '']
    }
}



export const getMovieList = () => {
    return {
        promise: fetchPost(getPaperList, {}).then(res => {
            // debugger
            if (res.ErrorCode !== undefined) {
                Alert.alert("", utils.findErrorInfo(res));
            } else {
                return res;
            }
            return {};
        }),
        types: [LOADING, PAPERLIST, ERROR]
    }
}

export const GetCommon = () => {
    return {
        promise: fetchPost(getCommon, {}).then(res => {
            if (res.ErrorCode !== undefined) {
                if (this.props.logResult && this.props.logResult !== undefined)
                    Alert.alert("", utils.findErrorInfo(res));
            } else {
                return res;
            }
            return {};
        }),
        types: ['', GETCOMMON, '']
    }
}


export const saveDownInfo = (result) => {
    return { result, type: DOWNLOADINFO };
}
export const saveDownUrl = (result) => {
    return { result, type: SAVEDOWNURL };
}
// export const startDown = (result) => {
//     return { result, type: STARTDOWN };
// }
// export const downFaild = (result) => {
//     return { result, type: DOWNFAILD };
// }

export const saveExamPath = (url, taskId) => {

    return { result: { url, taskId }, type: CURRENTEXAMPATH };
}
export const getExamContent = (result) => {
    return { result, type: GETEXAMDETAIL }
}
export const getTopicDetail = (examDetail) => {
    let result;
    let currLevel = "Title";
    let audioPath = examDetail.Audio;
    let showTitle = examDetail.Desc;
    result = { currLevel, audioPath, showTitle };

    return { result, type: GETTOPICINFO }
}
export const commintCurrExam = () => {//交卷
    let currLevel = "finished";
    let topicInfo = { currLevel };
    let result = { topObj: {}, gropObj: {}, topicInfo };
    return { result, type: GETNEXTSTEPTOPIC }
}
export const getNextTopicDetail = (currTopic, examDetail, currGropObj, currTopObj) => {

    let result = {};

    let topicInfo;
    let currLevel;
    let audioPath;
    let showTitle;
    if (currTopic.currLevel === 'Title') {//当前读的是试卷导读标题 下一步读大题标题
        let gropObj = examDetail.Groups[0];
        if (gropObj.QuesTip != null) {//如果有大题标题 读大标题
            currLevel = "gropObj";
            audioPath = gropObj.QuesAudio;
            showTitle = gropObj.QuesTip;
            topicInfo = { currLevel, audioPath, showTitle };
            result = { gropObj, topicInfo };//
        } else {//如果没有大标题  读小题
            let topObj = gropObj.ExamTopics[0];
            currLevel = "topObj";
            audioPath = topObj.TopicAudioPath;
            showTitle = topObj.Desc;
            let contentPath = topObj.AudioPath;
            let contentData = topObj.TopicInfoList;
            topicInfo = { currLevel, audioPath, showTitle, contentPath, contentData };
            result = { topObj, gropObj, topicInfo };
        }
    } else if (currTopic.currLevel === 'gropObj') {//当前读的是大题标题 下一步读小题
        let gropObj = currGropObj;
        let topObj = gropObj.ExamTopics[0];
        currLevel = "topObj";
        audioPath = topObj.TopicAudioPath;
        showTitle = topObj.Desc;
        let contentPath = topObj.AudioPath;
        let contentData = topObj.TopicInfoList;
        topicInfo = { currLevel, audioPath, showTitle, contentPath, contentData };
        result = { topObj, gropObj, topicInfo };
    } else if (currTopic.currLevel === 'topObj') {//当前读的是小题
        let gropObj = currGropObj;

        let i = 0;//找到当前小题的索引
        gropObj.ExamTopics.some((tempObj, j) => {
            if (tempObj.ID === currTopObj.ID) {
                i = j + 1;
            }
        })
        if (i < gropObj.ExamTopics.length) {//如果有下一小题
            let topObj = gropObj.ExamTopics[i];
            currLevel = "topObj";
            audioPath = topObj.TopicAudioPath;
            showTitle = topObj.Desc;
            let contentPath = topObj.AudioPath;
            let contentData = topObj.TopicInfoList;
            topicInfo = { currLevel, audioPath, showTitle, contentPath, contentData };

            result = { topObj, gropObj, topicInfo };
        } else {//如果没有下一小题  找下一大题
            let i = 0;
            examDetail.Groups.some((tempObj, j) => {
                if (tempObj.Type === currGropObj.Type) {
                    i = j + 1;
                }
            })
            if (i < examDetail.Groups.length) {//如果有下一个大题
                let gropObj = examDetail.Groups[i];
                if (gropObj.QuesTip != null) {//如果有大题标题 读大标题
                    currLevel = "gropObj";
                    audioPath = gropObj.QuesAudio;
                    showTitle = gropObj.QuesTip;
                    topicInfo = { currLevel, audioPath, showTitle };
                    result = { gropObj, topicInfo };
                } else {//如果没有大标题  读小题
                    let topObj = gropObj.ExamTopics[0];
                    currLevel = "topObj";
                    audioPath = topObj.TopicAudioPath;
                    showTitle = topObj.Desc;
                    let contentPath = topObj.AudioPath;
                    let contentData = topObj.TopicInfoList;
                    topicInfo = { currLevel, audioPath, showTitle, contentPath, contentData };
                    result = { topObj, gropObj, topicInfo };
                }
            } else {//如果没有下一大题 试卷已完成
                let currLevel = "finished";
                let topicInfo = { currLevel };
                let result = { topObj: {}, gropObj: {}, topicInfo };
                return { result, type: GETNEXTSTEPTOPIC }
            }
        }
    }
    return { result, type: GETNEXTSTEPTOPIC }
}
export const getNextGroup = (currTopic, examDetail, currGropObj) => {
    let result = {};

    let topicInfo;
    let currLevel;
    let audioPath;
    let showTitle;
    let i = 0;
    if (currGropObj !== undefined && currGropObj !== null) {
        examDetail.Groups.some((tempObj, j) => {
            if (tempObj.Type === currGropObj.Type) {
                i = j + 1;
            }
        })
    }
    if (i < examDetail.Groups.length) {//如果有下一个大题
        let gropObj = examDetail.Groups[i];
        if (gropObj.QuesTip != null) {//如果有大题标题 读大标题
            currLevel = "gropObj";
            audioPath = gropObj.QuesAudio;
            showTitle = gropObj.QuesTip;
            topicInfo = { currLevel, audioPath, showTitle };
            result = { gropObj, topicInfo };
        } else {//如果没有大标题  读小题
            let topObj = gropObj.ExamTopics[0];
            currLevel = "topObj";
            audioPath = topObj.TopicAudioPath;
            showTitle = topObj.Desc;
            let contentPath = topObj.AudioPath;
            let contentData = topObj.TopicInfoList;
            topicInfo = { currLevel, audioPath, showTitle, contentPath, contentData };
            result = { topObj, gropObj, topicInfo };
        }
    } else {//如果没有下一大题 试卷已完成
        let currLevel = "finished";
        let topicInfo = { currLevel };
        let result = { topObj: {}, gropObj: {}, topicInfo };
        return { result, type: GETNEXTSTEPTOPIC }
    }
    return { result, type: GETNEXTSTEPTOPIC }
}
export const setReportingTip = (currTopic, examDetail, currGropObj, currTopObj, Type1) => {
    let result = { topObj: currTopObj, gropObj: currGropObj, topicInfo: currTopic };
    if (Type1 === "ReportingTip") {
        // if(currTopObj.ReportingTip){
        let currLevel = "topObj";
        let topObj = currTopObj;
        let audioPath = topObj.ReportingAudio;
        let showTitle = topObj.ReportingTip;
        let contentPath = topObj.AudioPath;
        let contentData = topObj.TopicInfoList;
        let topicInfo = { currLevel, audioPath, showTitle, contentPath, contentData, ctype: Type1 };
        result = { topObj, gropObj: currGropObj, topicInfo };
        // }
    } else if (Type1 === "RecordTip") {
        // if(currTopObj.RecordTip){
        let currLevel = "topObj";
        let topObj = currTopObj;
        let audioPath = topObj.RecordAudio;
        let showTitle = topObj.RecordTip;
        let contentPath = topObj.AudioPath;
        let contentData = topObj.TopicInfoList;
        let topicInfo = { currLevel, audioPath, showTitle, contentPath, contentData, ctype: Type1 };
        result = { topObj, gropObj: currGropObj, topicInfo };
        // }
    }
    return { result, type: GETNEXTSTEPTOPIC };
}
export const setTestProgress = (data) => {
    let result = { 'topObj': data.topObj, 'topicInfo': data.topicInfo, 'gropObj': data.gropObj }
    return { result, type: GETNEXTSTEPTOPIC }
}

export const savePlayTime = (result) => {
    return { result, type: SAVEPLAYTIME }
}

//答案记录
// 类型 Type, ID id , 序号 num , 答案 answer
export const saveCurrExamAnswers = (Type, id, num, answer) => {
    return {
        result: {
            Type,
            id,
            num,
            answer
        },
        type: SAVEANSWERS
    }
}
export const getAnswerBlow = (result) => {
    return { result, type: GETANSWERBLOW }
}
//答题进度记录
export const saveAnswerRecord = (result) => {
    let newAnswer = result;
    let finish = result.topicInfo && result.topicInfo.currLevel === "finished";
    newAnswer.finish = finish;
    let jsonPath = result.examPath + "/answer.json";
    RNFS.writeFile(jsonPath, JSON.stringify(newAnswer), 'utf8').then(() => { });
    return { result: newAnswer, type: SAVEANSDIC }
}



// export const getMovieList = () => {
//     return {
//         promise: fetchGet(cookie).then(res => {
//             return res
//         }),
//         types: [LOADING,PAPERLIST, ERROR]
//     }
// }

