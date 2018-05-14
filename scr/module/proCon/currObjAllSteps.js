'use strict';
import { levelType, StatusType, PlayType, WaitType } from "./paperStatus";
import { getAnalysis } from "./analysis";

export default class FindSteps {
    constructor() {
        

    }

    // findAllSteps(level, dataSource) {
    //     this.dataSource = dataSource;
    //     switch (level) {
    //         case levelType.paperTitle:
    //             this.paperTitleSteps();
    //             break;
    //         case levelType.bigSubTitle:
    //             this.bigSubTitleSteps();
    //             break;
    //         case levelType.minSubject:
    //             this.minSubjectSteps();
    //             break;
    //         default:
    //             break;
    //     }
    // }

    paperTitleSteps(dataSource) {
        this.allSteps = [];
        this.addStep(dataSource, PlayType.paperTitle);
    }

    bigSubTitleSteps(dataSource) {
        this.allSteps = [];
        this.addStep(dataSource, PlayType.bigSubTitle);
        
    }

    minSubjectSteps(dataSource) {
        this.allSteps = [];
        
        this.addStep(dataSource, PlayType.midSubTitle);//小标题
        
        this.addStep(dataSource, WaitType.readTime);//读题时间
        
        if(dataSource.Type === 5 && dataSource.IsHideAudioPath === false){
            //如果是短文朗读并且隐藏AudioPath内容音频 不需要读内容
        }else{
            this.addStep(dataSource, PlayType.midSubContent);//读小题内容
        }
        
        this.addStep(dataSource, PlayType.reporting);//答题前提示语
        
        this.addStep(dataSource, WaitType.readyTime);//准备答题时间
        
        this.addStep(dataSource, PlayType.recordReporting);//录音前提示语
        
        this.addStep(dataSource, PlayType.startReport);//开始录音
        
        this.addStep(dataSource, WaitType.answerTime);//答题时间
        
        this.addStep(dataSource, PlayType.endReport);//结束录音
        
    }


    endExamSteps(dataSource){
        this.allSteps = [];
        this.addStep(dataSource, PlayType.endExam);
    }

    //数据源 步骤状态
    addStep( dataSource , stepType) {
        let analysisData = getAnalysis(stepType , dataSource);
        if( analysisData ){
            let levType=analysisData.levelType ? analysisData.levelType : levelType.minSubject;

            //步骤实例  staType播放/等待  stepType步骤类型   levType级别类型   anaInfo解析数据   data数据源
            let stepObj = { staType:analysisData.staType , stepType:stepType ,levType , anaInfo:analysisData , data:dataSource };
            this.allSteps.push(stepObj);
        }
    }

}