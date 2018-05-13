import { levelType, StatusType, PlayType, WaitType } from "./paperStatus";
import utils from "../../utils";
import MySound from "../../utils/soundPlay";
let Audio1;
Audio1 = require("../../utils/audioPlay");
let Sound1 = new MySound();


export default class StepCon { //试卷控制器

    //stepInfo 步骤进度信息     stepEnd 步骤自动结束回调
    constructor(stepInfo,stepEnd) {
        this.start = this.start.bind(this);
        this.startTimer=this.startTimer.bind(this);
        this.progressInfo_play=this.progressInfo_play.bind(this);
        this.progressInfo_wait=this.progressInfo_wait.bind(this);
        this.endTimer=this.endTimer.bind(this);
        this.end=this.end.bind(this);

        this.stepInfo = stepInfo;
        this.stepEnd = stepEnd;
    }


    //步骤开始
    start() {
        // console.log("步骤信息"+this.dataSouce.stepType);
        this.staType = this.dataSouce.staType;
        //步骤实例  staType播放/等待  stepType步骤类型   levType级别类型   anaInfo解析数据   data数据源
        if (this.staType === StatusType.play) { //开始播放
            this.path = utils.findPlayPath(this.dataSouce.anaInfo.audio,this.examPath);
            Sound1.startPlay(this.path);
            // alert("播放路径" + this.path);
        } else {
            this.time = this.dataSouce.anaInfo.time;
            // alert("等待时间" + time);
            this.dataSouce.isRecording=(this.dataSouce.stepType === WaitType.answerTime && this.dataSouce.data.isRecord === true);
            
            if (this.dataSouce.isRecording) {//如果是录音
                let recordPath = this.recordPath;
                Audio1.startRecord(recordPath);
            }
        }
        this.startTimer();
    }

    //计时器开始
    startTimer() {
        this.timer = setInterval(() => {
            if(this.timer){ //保证计时器存在
                if (this.staType === StatusType.play) { //播放
                    this.progressInfo_play();
                }else{
                    this.progressInfo_wait();
                }
            }
        }, 1000)
    }

    //播放进度的信息
    progressInfo_play(){
        let isLoaded = Sound1.soundIsLoaded();
        if (isLoaded) {
            Sound1.soundGetCurrentTime((time, isPlaying) => {
                if (isPlaying === false) {//如果播放停止之后
                    this.end(false);//步骤自动结束
                }else{
                    let time1 = time.toFixed(0)
                    let time2 = Sound1.soundDuring().toFixed(0);
                    //处理数据显示
                    time1 = (time1 > 0) ? time1 : 0;
                    time2 = (time2 > 0) ? time2 : 0;
                    // time1 = (time1 > time2) ? time2 : time1;//进度超过周期处理
                    let currTime = time1 + ' / ' + time2;
    
                    //播放信息
                    let playInfo = "播放中 " + currTime;

                    this.stepInfo(playInfo);
                }
            });
        }
    }

    //等待倒计时的进度信息
    progressInfo_wait(){
        //倒计时信息
        this.time = this.time - 1 ;
        let waitInfo = this.dataSouce.stepType + "倒计时: " + this.time;
        if(this.time<0){ //如果倒计时小于0
            this.end(false);//步骤自动结束
        }else{
            this.stepInfo(waitInfo);
        }
    }

    //计时器结束
    endTimer() {
        clearInterval(this.timer);
        this.timer = null;
    }

    //暂停
    pause() {
        this.endTimer();
        if (this.staType === StatusType.play) Sound1.soundPause();
    }

    //继续
    continue() {
        this.startTimer();
        if (this.staType === StatusType.play) Sound1.soundContinue(this.path);
    }

    //步骤结束  isActive是否是主动结束
    end(isActive) {
        this.endTimer();
        if (this.staType === StatusType.play) { //如果是播放步骤的话播放
            Sound1.soundStop();
        } else if (this.dataSouce.isRecording) { //如果是录音的话
            Audio1.stopRecord();
        }
        if(isActive===false){//如果是自动结束完当前步骤 去回调 通知去找下一个步骤
            this.stepEnd();
        }
    }

}