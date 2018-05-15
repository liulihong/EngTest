import CurrProgress from "./progressManger";
import { levelType, StatusType, PlayType, WaitType } from "./paperStatus";
import StepCon from "./stepController";

export default class PaperController { //试卷控制器
    //path试卷路径  试卷实体  步骤信息回调  考试结束回调
    constructor(path, paper, stepInfo, examEnd) {
        this.examEnd=examEnd;

        //试卷进度
        this.proObj = new CurrProgress(paper,(haveNewStep)=>{
            if(haveNewStep) //有下一步 开始下一步
                this.startStep();
            else //找不到下一步了 回调考试结束
                examEnd();
        });

        //步骤控制器
        this.stepCon = new StepCon((progressInfo)=>{
            stepInfo(this.proObj.currStep,progressInfo);
        },()=>{
            this.proObj.nextStep();
        });
        this.stepCon.examPath=path;

        this.clickNextStep = this.clickNextStep.bind(this);
        this.clickNextSubject = this.clickNextSubject.bind(this);
        this.clickSubmit = this.clickSubmit.bind(this);
    }

    //初始化新步骤
    initNewStep( isNew , progressRecord ){ 
        if(isNew===false && progressRecord && progressRecord.progress )
            this.proObj.readHisProgress(progressRecord);//找历史记录
        else
            this.proObj.initProgress();//新开始试卷
    }

    //开始一个步骤
    startStep(){
        this.stepCon.dataSouce = this.proObj.currStep;
        this.stepCon.start();
    }

    //点击了下一步
    clickNextStep(){ 
        this.stepCon.end(true);
        this.proObj.nextStep();
    }
    //点击了下一题
    clickNextSubject(){ 
        this.stepCon.end(true);
        this.proObj.nextSubject();
    }

    //点击了交卷
    clickSubmit(){
        this.stepCon.end(true);
        this.examEnd();
    }

}