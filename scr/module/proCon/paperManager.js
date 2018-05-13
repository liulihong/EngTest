'use strict';
import { PaperModel, BigSubjectModel, MidSubjectModel, MinSubjectModel } from "./paperModel";
import { levelType, StatusType, PlayType, WaitType } from "./paperStatus";

export default class PaperManager {
    constructor(paper) {
        if (paper) {
            this.paperObj = paper;
        }
    }


    //下一大题  groupObj
    nextBigSubject() {
        this.groupObj = this.nextData(this.groupObj, this.paperObj.Groups);
        // let nextIndex = 0;
        // if (this.groupObj) {//如果存在当前大题
        //     nextIndex = this.groupObj.index + 1;
        // }
        // this.groupObj = new BigSubjectModel(this.paperObj.Groups[nextIndex]);
        // this.groupObj.index = nextIndex;
        // this.groupObj.haveNext = ((nextIndex + 1) < this.paperObj.groupTotalNum);
        // this.groupObj.TotalNum = this.groupObj.ExamTopics.length;

        //大题切换之后设置 小题为空
        this.topObj = null;
        this.topicObj = null;
    }
    //下一中型题(一段音频对应的多个小题)  topObj
    nextMidSubject() {
        this.topObj = this.nextData(this.topObj, this.groupObj.ExamTopics);
        this.topObj.Type = this.groupObj.Type;
        this.topObj.ImgList = this.groupObj.ImgList;
        this.topObj.isRecord = (this.groupObj.Type === 2 || this.groupObj.Type === 4 || this.groupObj.Type === 5)
        // let nextIndex = 0;
        // if (this.topObj) {//如果存在当前大题
        //     nextIndex = this.topObj.index + 1;
        // }
        // this.topObj = new MidSubjectModel(this.groupObj.ExamTopics[nextIndex]);
        // this.topObj.index = nextIndex;
        // this.topObj.haveNext = ((nextIndex + 1) < this.groupObj.TotalNum);
        // this.topObj.TotalNum = this.topObj.TopicInfoList.length;

        this.topicObj = null;
    }
    //下一小题  topicObj
    nextMinSubject() {
        this.topicObj = this.nextData(this.topicObj, this.topObj.TopicInfoList);
        // let nextIndex = 0;
        // if (this.topicObj) {//如果存在当前大题
        //     nextIndex = this.topicObj.index + 1;
        // }
        // this.topicObj = new MinSubjectModel(this.topObj.TopicInfoList[nextIndex]);
        // this.topicObj.index = nextIndex;
        // this.topicObj.haveNext = ((nextIndex + 1) < this.topObj.TotalNum);
    }

    //下条数据
    nextData(oriCurrObj, topGroup) {
        let currObj = oriCurrObj;
        let nextIndex = 0;
        if (currObj) {
            nextIndex = currObj.index + 1;
        }
        currObj = topGroup[nextIndex];
        currObj.index = nextIndex;
        currObj.haveNext = ((nextIndex + 1) < topGroup.length);

        return currObj;
    }

    //读取历史进度
    initHisData(progressRecord) {
        let progress = progressRecord.progress;
        this.groupObj = this.paperObj.Groups[progress.groupIndex];
        this.groupObj.index = progress.groupIndex;
        this.groupObj.haveNext = ((progress.groupIndex + 1) < this.paperObj.Groups.length);
        if (progress.levelType === levelType.minSubject) {
            this.topObj = this.groupObj.ExamTopics[progress.topIndex];
            this.topObj.index = progress.topIndex;
            this.topObj.haveNext = ((progress.topIndex + 1) < this.groupObj.ExamTopics.length);
            this.topObj.Type = this.groupObj.Type;
            this.topObj.ImgList = this.groupObj.ImgList;
            this.topObj.isRecord = (this.groupObj.Type === 2 || this.groupObj.Type === 4 || this.groupObj.Type === 5)
        }
    }

}