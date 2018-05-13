'use strict';
import { PaperModel, BigSubjectModel, MidSubjectModel, MinSubjectModel } from "./paperModel";
import PaperManager from "./paperManager";
import { levelType, StatusType, PlayType, WaitType } from "./paperStatus";
import FindSteps from "./currObjAllSteps";
import { DeviceEventEmitter } from "react-native";
import copy from 'lodash';


export default class ProgressManager {

    constructor(paper, stepChangeNotice) {
        this.stepNotice = stepChangeNotice;
        this.paperManager = new PaperManager(paper);//初始化试卷管理对象
        this.findStepsObj = new FindSteps();//初始化寻找所有步骤对象
    }

    //初始化进度
    initProgress() {
        this.level = levelType.paperTitle;//读试卷标题
        this.setCurrLevelAllSteps();
        this.nextStep();
    }

    //读取记录进度(如果是继续考试的话查找记录)
    readHisProgress(progressRecord) {
        this.level = levelType.paperTitle;//读试卷标题
        if (progressRecord.progress.levelType === levelType.minSubject || progressRecord.progress.levelType === levelType.bigSubTitle) {
            this.level = progressRecord.progress.levelType;
            this.paperManager.initHisData(progressRecord);
            this.setCurrLevelAllSteps();
            this.nextStep();
        }else this.initProgress();
    }

    //根据级别设置当前级别全步骤
    setCurrLevelAllSteps() {
        switch (this.level) {
            case levelType.paperTitle:
                this.findStepsObj.paperTitleSteps(this.paperManager.paperObj);
                break;
            case levelType.bigSubTitle:
                this.findStepsObj.bigSubTitleSteps(this.paperManager.groupObj);
                break;
            case levelType.minSubject:
                this.findStepsObj.minSubjectSteps(this.paperManager.topObj);
                break;
            case levelType.endPaper:
                this.findStepsObj.endExamSteps({});
            default:
                break;
        }

        //存储进度信息
        this.noticeCurrProgress();
    }

    //通知最新进度
    noticeCurrProgress(){
        let progress = {};
        progress.levelType = this.level;
        if (progress.levelType !== levelType.paperTitle && progress.levelType !== levelType.endPaper) {
            progress.groupIndex = this.paperManager.groupObj.index;
            if (progress.levelType === levelType.minSubject)
                progress.topIndex = this.paperManager.topObj.index;
        }
        DeviceEventEmitter.emit("reloadProgress", progress);
    }

    //通知需要提交答案
    noticeSubmitAnswer(){
        if(this.level===levelType.minSubject){//如果是小题的话
            let groupObj = copy.cloneDeep(this.paperManager.groupObj);
            let topObj=copy.cloneDeep(this.paperManager.topObj);
            DeviceEventEmitter.emit("submitAnswer", topObj,groupObj);
        }
    }

    //查找下一个级别
    setNewLevel() {
        switch (this.level) {
            case levelType.paperTitle:
                {   //试卷标题读完 查找第一大题 级别大题标题
                    this.paperManager.nextBigSubject();
                    this.level = levelType.bigSubTitle;
                    break;
                }
            case levelType.bigSubTitle:
                {   //大题标题读完 查找第一小题 级别小题
                    this.paperManager.nextMidSubject();
                    this.level = levelType.minSubject;
                    break;
                }
            case levelType.minSubject:
                {   //小题完成 找下一小题 如果没有下一小题找下一大题
                    if (this.paperManager.topObj.haveNext) { //还有下一小题
                        this.paperManager.nextMidSubject();
                        this.level = levelType.minSubject;
                    } else { // 没有下一小题 找下一大题
                        if (this.paperManager.groupObj.haveNext) {//如果有下一大题
                            this.paperManager.nextBigSubject();
                            this.level = levelType.bigSubTitle;
                        } else {
                            // alert("没有下一大题了、、、");
                            this.level = levelType.endPaper;
                        }
                    }
                    break;
                }
            case levelType.endPaper:
                {
                    this.stepNotice(false);//没有下一个步骤了 通知试卷控制器
                }
            default:
                break;
        }
    }

    //查找下一步
    nextStep() {
        let nextIndex = 0;//步骤索引
        if (this.currStep) {//如果有当前步骤的话
            nextIndex = this.currStep.index + 1;
        }
        if (this.findStepsObj.allSteps.length > nextIndex) {//如果有下一步的话
            this.currStep = this.findStepsObj.allSteps[nextIndex];
            this.currStep.index = nextIndex;
            
            this.stepNotice(true);//找到下一个步骤 通知试卷控制器
        } else if (this.level === levelType.endPaper) {
            this.stepNotice(false);//没有下一个步骤了  通知试卷控制器
        } else { //如果没有下一步 找下一个节点
            this.noticeSubmitAnswer();
            this.currStep = null;
            this.setNewLevel();
            this.setCurrLevelAllSteps();
            this.nextStep();
        }
    }

    //查找下一题
    nextSubject() {
        if (this.level === levelType.paperTitle) { //如果正在读试题标题 点击下一题相当于下一步
            this.currStep.index = this.findStepsObj.allSteps.length;
            this.nextStep();
        } else if (this.level === levelType.bigSubTitle) {//如果正在读大题标题 点击下一题去找下一大题
            if (this.paperManager.groupObj.haveNext) {//如果有下一大题
                this.currStep = null;
                this.paperManager.nextBigSubject();
                this.level = levelType.bigSubTitle;
                this.setCurrLevelAllSteps();
                this.nextStep();
            } else {
                // alert("没有下一题了哦！");
                this.level = levelType.endPaper;
                this.setCurrLevelAllSteps();
                this.nextStep();
            }
        } else if (this.level === levelType.minSubject) {//如果正在读小题 点击下一题去找下一小题 
            this.currStep.index = this.findStepsObj.allSteps.length;
            this.nextStep();
        } else if (this.level === levelType.endPaper) {
            this.stepNotice(false);
        }
    }


}

