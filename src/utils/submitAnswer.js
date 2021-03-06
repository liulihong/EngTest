import { fetchPost } from '../request/fetch';
import { Alert,DeviceEventEmitter } from "react-native";
import { submitExamTopic, endExam } from '../request/requestUrl';
import utils from '../utils';

class TaskProgress {
    constructor(callBack) {
        this.times = 1;
        this.resultCallBack = callBack;
    }

    //接收一个任务
    initTask(gropObj, answer, topObj, LogID) {
        this.gropObj = gropObj;
        this.answer = answer;
        this.topObj = topObj;
        this.LogID = LogID;
        this.startSubmitTask();
    }

    //开始提交一个任务
    startSubmitTask() {
        let gropObj = this.gropObj;
        let answer = this.answer;
        let topObj = this.topObj;
        let LogID = this.LogID;

        let paraArr = [];
        if (gropObj.Type === 1 || gropObj.Type === 10 || gropObj.Type === 3) {

            let arr = topObj.TopicInfoList;
            for (let i = 0; i < arr.length; i++) {
                let topicObj = topObj.TopicInfoList[i];//小题数据信息
                let topicObjAnswer = answer[topicObj.UniqueID];//小题答案
                if (topicObjAnswer !== undefined) {
                    let paraObj = {
                        TopicID: topicObj.UniqueID,
                        TopicNO: topicObj.ID,
                        UserAnswer: JSON.stringify(topicObjAnswer.answer),
                        Total: topicObj.Score,
                    }
                    paraArr.push(paraObj);
                }
            }

            if (paraArr.length) {
                let paramts = {
                    LogID,
                    Type: gropObj.Type,
                    Items: paraArr,
                }

                if(gropObj.Type===3){
                    utils.showDevInfo("正在提交第三题答案哦！ ");
                }

                fetchPost(submitExamTopic, paramts).then((result) => {
                    if (result.ErrorCode !== undefined) {
                        // alert("非音频提交失败" + utils.findErrorInfo(error));
                        this.submitFaild(result);
                    } else {
                        // alert("非音频提交成功" + JSON.stringify(result));
                        this.submitSuccess();
                    }

                }, (error) => {
                    // alert("非音频提交失败" + utils.findErrorInfo(error));
                    this.submitFaild(error);
                });
            } else {

                this.submitSuccess();//如果没有需要提交的  按照成功处理
            }
        } else {//提交音频
            let topicObj = topObj.TopicInfoList[0];//小题数据信息
            let topicObjAnswer = answer[topicObj.UniqueID];//小题答案
            if (topicObjAnswer !== undefined) {

                // debugger
                RNFS.readFile(topicObjAnswer.answer, "base64")
                    .then((result) => {
                        // alert("转字符串成功" + result);
                        let paraObj = {
                            TopicID: topicObj.UniqueID,
                            TopicNO: topicObj.ID,
                            UserAnswer: result,
                            Total: topicObj.Score,
                        }
                        paraArr.push(paraObj);

                        if (paraArr.length) {

                            let paramts = {
                                LogID,
                                Type: gropObj.Type,
                                Items: paraArr,
                            }
                            fetchPost(submitExamTopic, paramts).then((result) => {
                                if (result.ErrorCode !== undefined) {
                                    // alert("音频提交失败" + utils.findErrorInfo(error));

                                    this.submitFaild(result);
                                } else {
                                    // alert("音频提交成功" + JSON.stringify(result));

                                    this.submitSuccess();
                                }
                            }, (error) => {
                                // alert("音频提交失败" + utils.findErrorInfo(error));

                                this.submitFaild(error);
                            });
                        } else {

                            this.submitSuccess();//如果没有需要提交的  按照成功处理
                        }
                    })
                    .catch((err) => {

                        // alert("转字符串失败：" + err);
                        this.submitFaild({ errorMsg: "base64" });//转base64字符串失败
                    });
            } else {

                this.submitSuccess();//如果没有需要提交的  按照成功处理
            }
        }
    }

    //提交失败
    submitFaild(error) {
        // utils.showDevInfo("错误信息 " + JSON.stringify(error));
        //检查网络 分析错误信息 ==
        if (error.ErrorCode !== undefined) {
            Alert.alert("", utils.findErrorInfo(error));
            this.resultCallBack({ status: false });
            if (error.ErrorCode === 1003 || error.ErrorCode === 1004 || error.ErrorCode === 1106) {
                DeviceEventEmitter.emit('replaceRoute', { isLogin: false });
            }
            return ;
        }
        if (this.times < 3) {
            this.times++;
            this.startSubmitTask();
        } else {
            this.resultCallBack({ status: false });
        }
    }

    //提交成功
    submitSuccess() {
        this.resultCallBack({ status: true });
    }

}

export default class SubmitAnswerTask {
    constructor(callBack, LogID) {
        this.taskNum = 0;
        this.callBack = callBack;
        this.LogID = LogID;
    }

    //添加一个提交任务
    addSubmitTask(gropObj, answer, topObj) {
        this.taskNum++;
        // utils.showDevInfo("收到任务"+this.taskNum);
        let task = new TaskProgress((result) => this.endSubmitTask(result));
        task.initTask(gropObj, answer, topObj, this.LogID);
    }


    //一个任务结束
    endSubmitTask(result) {
        this.taskNum--;
        // utils.showDevInfo("任务结束" + this.taskNum);
        if (this.taskNum <= 0 && this.haveSubmit === true) {
            utils.showDevInfo("可以交卷了");
            this.callBack();
        }


        if (result.status === false) {//提交失败 处理

        }
    }
}
