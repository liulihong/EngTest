import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, DeviceEventEmitter, Alert, Platform, BackHandler } from 'react-native';
import utils from '../utils';
import { connect } from "react-redux";
import {
    savePlayTime, getNextTopicDetail, getNextGroup, setReportingTip, commintCurrExam, saveCurrExamAnswers,
    saveAnswerRecord
} from "../store/actions";
import MySound from "../utils/soundPlay";
import { fetchPost } from '../request/fetch';
import { submitExamTopic, endExam } from '../request/requestUrl';
import copy from 'lodash';
import RNFS from 'react-native-fs';
import SubmitAnswer from "../utils/submitAnswer"

// let isSubmited = false;//已交卷为否
let timeInteval;//播放时间计时器
let timeInteval2;//读题时间计时器
let timeInteval3;//答题时间计时器
let timeInteval4;//准备答题时间计时器
let tempTimeout;//临时延时计时器
let readTime = 0;//剩余读题时间
let answerTime = 0;//剩余答题时间
let readyTime = 0;//准备时间
let Sound1 = new MySound;
const downloadDest = utils.DOWNLOADDOCUMENTPATH;
const audioPath = (utils.PLATNAME === "IOS") ? (downloadDest + '/test.wav') : (downloadDest + '/test');
let Audio1;
Audio1 = require("../utils/audioPlay");

class AudioSoundConCom extends Component {
    constructor(props) {
        super(props)
        this.startPlay = this.startPlay.bind(this);
        this.getButton = this.getButton.bind(this);
        this.getConBtn = this.getConBtn.bind(this);
        this.pause = this.pause.bind(this);
        this.continue = this.continue.bind(this);
        this.reloadData = this.reloadData.bind(this);
        this.nextStep = this.nextStep.bind(this);
        this.nextGroup = this.nextGroup.bind(this);
        this.stopRecord = this.stopRecord.bind(this);
        this.goAnswer = this.goAnswer.bind(this);
        this.startReadContent = this.startReadContent.bind(this);
        this.readyAnswer = this.readyAnswer.bind(this);
        this.clearInteval = this.clearInteval.bind(this);
        this.getDefaultTime = this.getDefaultTime.bind(this);
        this.stopPlayAndRecord = this.stopPlayAndRecord.bind(this);
        this.currPlayIsTip = this.currPlayIsTip.bind(this);
        this.audioAnswerRecord = this.audioAnswerRecord.bind(this);
        this.readContentEnd = this.readContentEnd.bind(this);
        this.saveAnsweRecord = this.saveAnsweRecord.bind(this);
        this.findProgress = this.findProgress.bind(this);
        this.submitToServer = this.submitToServer.bind(this);
        this.submitExamFinish = this.submitExamFinish.bind(this);
        this.onBackAndroid = this.onBackAndroid.bind(this);
        this.state = {
            isPlaying: true,//默认播放  播放为false代表录音
            isPaused: false,
            currPath: '',
            tempData: {},
        }

    }

    //组件加载完成
    componentDidMount() {
        Audio1.getPermission(audioPath);//检查录音权限
        this.startPlay(this.props.soundPath);//开始播放

        let LogID = this.props.answerRecord.LogID;
        this.submitModel = new SubmitAnswer(this.submitExamFinish, LogID);
        this.submitModel.haveSubmit = false;
    }

    componentWillMount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }
    onBackAndroid = () => {
        this.clearInteval();
        this.stopPlayAndRecord();

        let tempData = this.props.dataSource;
        this.saveAnsweRecord(tempData);
    };

    //组件卸载 播放停止
    componentWillUnmount() {
        DeviceEventEmitter.emit('ChangeUI');

        this.onBackAndroid();
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    saveAnsweRecord(tempData) {
        //保存答题记录信息
        let answerDic = this.props.answerRecord;
        if (answerDic && answerDic.topicInfo !== tempData.topicInfo) {
            if (tempData.topicInfo.currLevel !== "finished") {
                answerDic.topObj = tempData.topObj;
                answerDic.gropObj = tempData.gropObj;
            }
            answerDic.topicInfo = tempData.topicInfo;
            this.props.saveAnswerInfo(answerDic);
        }
    }

    //提交答案到服务器
    submitToServer(nextProps, currProps, isFinish) {

        let isChange = nextProps.dataSource.topicInfo !== currProps.dataSource.topicInfo;
        if (isChange === false) return;//当前信息没改变 不提交
        let isTopObj = currProps.dataSource.topicInfo.currLevel === "topObj";
        if (isTopObj === false) return;//当前播放不是小题 不提交
        if (nextProps.dataSource.topObj === currProps.dataSource.topicObj) return;//跟上次同一个小题 不提交
        if (nextProps.answers === undefined) return;//没有答题记录


        let gropObj1 = currProps.dataSource.gropObj;//当前数组
        let gropObj = copy.cloneDeep(gropObj1);
        let answer1 = nextProps.answers[gropObj.Type];//当前类型题答案
        let answer = copy.cloneDeep(answer1);
        let topObj1 = currProps.dataSource.topObj;//页面数据信息
        let topObj = copy.cloneDeep(topObj1);


        if (answer !== undefined && topObj.TopicInfoList !== undefined) {//如果有答案记录
            this.submitModel.addSubmitTask(gropObj, answer, topObj);
        }
    }

    //服务器交卷
    submitExamFinish() {
        if (this.submitModel.taskNum <= 0 && this.submitModel.haveSubmit === true) {
            this.submitModel.haveSubmit === false;
            let LogID = this.props.answerRecord.LogID;
            let TaskLogID = this.props.answerRecord.TaskLogID;
            fetchPost(endExam, { LogID, TaskLogID }).then((res) => {
                let answerDic = this.props.answerRecord;
                answerDic.isSubmit = true;
                this.props.saveAnswerInfo(answerDic);
                this.props.navigation.goBack();
                // alert("考试完成，静待考试结果吧");
            }, (error) => {
                alert("交卷错误:  " + JSON.stringify(error));
            })
        }
    }

    //store数据刷新
    componentWillReceiveProps(nextProps) {
        this.setState({
            tempData: nextProps.dataSource,//新数据源
        });
        if (nextProps.dataSource.topicInfo.currLevel === "finished") {
            this.clearInteval();
            this.stopPlayAndRecord();
            this.saveAnsweRecord(nextProps.dataSource);
            this.submitToServer(nextProps, this.props, false);//提交答案到服务器
            if (this.props.dataSource.topicInfo.currLevel !== "finished") {
                Alert.alert('确定交卷吗?', '如果本次答题不满意可以再答一次哦!',
                    [
                        {
                            text: "再答一次", onPress: () => {
                                this.props.navigation.goBack();
                            }
                        },
                        {
                            text: "确定交卷", onPress: () => {
                                this.submitModel.haveSubmit = true;
                                this.submitExamFinish();//提交答案到服务器 
                            }
                        },
                    ], { cancelable: false }
                );
            }
        } else if (nextProps.dataSource.topicInfo !== this.props.dataSource.topicInfo) {
            this.submitToServer(nextProps, this.props, false);//提交答案到服务器
            this.saveAnsweRecord(nextProps.dataSource);
            if (nextProps.dataSource.topicInfo.currLevel === "topObj" && nextProps.dataSource.topicInfo.audioPath === null) {
                if (nextProps.dataSource.topicInfo.ctype === undefined) {//当前为设置提示语 没有标题 去读内容
                    this.startReadContent(nextProps.dataSource);
                } else if (nextProps.dataSource.topicInfo.ctype === "ReportingTip") {//答题提示语过后 去准备答题
                    this.readyAnswer();
                } else if (nextProps.dataSource.topicInfo.ctype === "RecordTip") {//录音提示语过后 播放开始录音提示语
                    let startPath = utils.findPlayPath("common/start.mp3", this.props.examPath);
                    this.startPlay(startPath);
                } else {
                    alert('store数据 播放信息异常啦');
                }
            } else {
                this.startPlay(nextProps.soundPath);
            }
        }
    }

    //清除计时器 恢复默认 停止播放 停止录音
    clearInteval() {
        clearInterval(timeInteval4);//准备答题计时器
        clearInterval(timeInteval2);//读题计时器
        clearInterval(timeInteval3);//答题计时器
        clearInterval(timeInteval);//播放计时器
    }
    //恢复所有默认时间
    getDefaultTime() {
        readyTime = 0;
        readTime = 0;
        answerTime = 0;
    }
    //停止播放和录音
    stopPlayAndRecord() {
        Audio1 && Audio1.stopRecord();
        Sound1 && Sound1.soundStop();
        Sound1 && Sound1.soundRelease();
    }

    //开始播放
    startPlay(path) {

        if(this.state.currPath === path) return;//防止复读

        this.getDefaultTime();
        this.clearInteval();
        this.stopPlayAndRecord();
        this.setState({
            isPlaying: true,
            isPaused: false,
            currPath: path,
        })
        Sound1.startPlay(path);
        clearInterval(timeInteval);
        setTimeout(() => {
            this.reloadData();
        })

    }

    //暂停
    pause() {
        this.clearInteval();
        // this.stopPlayAndRecord();
        this.setState({
            isPlaying: true,
            isPaused: true,
        }, () => {
            Sound1.soundPause();
        })
    }

    //继续
    continue() {
        this.setState({
            isPlaying: true,
            isPaused: false,
        }, () => {
            Sound1.soundContinue(this.state.currPath);
            this.reloadData();
        })
    }

    //刷新页面播放进度 播放完毕寻找下一步
    reloadData() {
        this.clickNext=false;
        timeInteval = setInterval(() => {
            if (Sound1 !== null) {
                let isLoaded = Sound1.soundIsLoaded();
                if (isLoaded&&this.clickNext===false) {
                    Sound1.soundGetCurrentTime((time, isPlaying) => {
                        
                            let time1 = time.toFixed(0)
                            let time2 = Sound1.soundDuring().toFixed(0);
                            //处理数据显示
                            time1=(time1>0)?time1:0;
                            time2=(time2>0)?time2:0;
                            let currTime = time1 + ' / ' + time2;
                            this.props.reloadCurrTime("播放中 " + currTime);
    
                            if (isPlaying === false) {
                                this.findProgress(timeInteval);
                            }
                        
                    });
                }
            }
        }, 1000);
    }

    //如果播放被阻止了 寻找当前进度及下一步
    findProgress(timeInteval) {
        //清除计时器
        clearInterval(timeInteval);
        //刷新当前播放进度
        // this.props.reloadCurrTime("");

        if (this.state.isPaused)//判断是否是暂停
            return;

        let tempData = this.props.dataSource;
        if (tempData.topicInfo.currLevel !== "topObj") {//如果当前读的不是小题 直接找下一步
            //找下一步
            this.props.getNextStep(tempData.topicInfo, tempData.examContent, tempData.gropObj, tempData.topObj);
        } else {//判断是提示语还是内容
            let isTip = this.currPlayIsTip();
            if (isTip === false) {
                let isMinTitle;//判断是否读小标题
                if (tempData.topicInfo.audioPath === tempData.topObj.TopicAudioPath && tempData.topicInfo.audioPath === null) {
                    // 当前小标题音频路径是空的
                    let isPlayContent = utils.isLastIndex(tempData.topicInfo.contentPath, this.state.currPath);
                    if (isPlayContent) {//如果当前路径指向内容路径 已经读完内容
                        isMinTitle = false;
                    } else {
                        isMinTitle = true;
                    }
                } else {
                    isMinTitle = utils.isLastIndex(tempData.topicInfo.audioPath, this.state.currPath);//播放路径是标题路径
                }

                if (isMinTitle) {//当前读的是小标题

                    this.startReadContent();//标题读完开始读内容

                } else {//当前已读完内容

                    this.readContentEnd();
                }
            }
        }
    }

    //当前播放是提示语
    currPlayIsTip() {
        let tempData = this.props.dataSource;

        let stopPath = utils.findPlayPath("common/stop.mp3", this.props.examPath);
        if (this.state.currPath === stopPath) {//如果是停止录音提示语

            //找下一步
            this.props.getNextStep(tempData.topicInfo, tempData.examContent, tempData.gropObj, tempData.topObj);

            return true;
        }
        let startPath = utils.findPlayPath("common/start.mp3", this.props.examPath);
        if (this.state.currPath === startPath) {//如果是开始录 直接去录音
            this.goAnswer();//去答题
            return true;
        }

        if (tempData.topObj.RecordAudio !== null) {
            let RecordTip = utils.findPlayPath(tempData.topObj.RecordAudio, this.props.examPath);
            if (this.state.currPath === RecordTip) {//如果是录音提示语  播放开始录音
                this.startPlay(startPath);
                return true;
            }
        }

        if (tempData.topObj.ReportingAudio) {
            let ReportingTip = utils.findPlayPath(tempData.topObj.ReportingAudio, this.props.examPath);
            if (this.state.currPath === ReportingTip) {//如果是答题前提示语  准备答题
                this.readyAnswer();
                return true;
            }
        }

        return false;
    }

    //开始读内容
    startReadContent(dataSource) {

        let tempData = this.state.tempData;
        if (dataSource)
            tempData = dataSource;
        //检查是否有读题时间
        if (readTime <= 0) {
            readTime = tempData.topObj.ReadTime;
        }
        if (readTime >= 0) {//如果有读题时间
            timeInteval2 = setInterval(() => {//读题时间计时器
                if (readTime > 0)
                    this.props.reloadCurrTime("读题时间: " + readTime);
                readTime--;
                if (readTime <= 0) {
                    clearInterval(timeInteval2);
                    if (tempData.gropObj.Type === 5 && tempData.topObj.IsHideAudioPath === false) {
                        //如果是短文朗读并且隐藏AudioPath内容音频 不需要读内容
                        this.readContentEnd();
                    } else {
                        let contentPath = utils.findPlayPath(tempData.topicInfo.contentPath, this.props.examPath);
                        this.startPlay(contentPath);
                    }
                }
            }, 1000);
        }
    }

    //内容读完检查是否有答题提示语
    readContentEnd() {
        let tempData = this.state.tempData;
        clearInterval(timeInteval2);//清除读题计时器
        //是否有答题前提示语
        let hasReportingTip = tempData.topObj.ReportingTip !== null || tempData.topObj.ReportingAudio !== null;
        if (hasReportingTip) {//如果有答题前提示语并且没有读的话 去设置提示语
            this.props.setReporteTip(tempData.topicInfo, tempData.examContent, tempData.gropObj, tempData.topObj, "ReportingTip");
        } else {
            this.readyAnswer();
        }
    }

    //去准备答题
    readyAnswer() {
        let tempData = this.state.tempData;
        //检查是否有准备答题时间
        if (readyTime <= 0) {
            readyTime = tempData.topObj.ReadyTime;
        }
        if (readyTime >= 0) {//如果有读题时间
            timeInteval4 = setInterval(() => {//读题时间计时器
                if (readyTime > 0)
                    this.props.reloadCurrTime("准备时间: " + readyTime);
                readyTime--;
                if (readyTime <= 0) {
                    clearInterval(timeInteval4);
                    //是否有录音前提示语(录音题有可能有录音前提示语)
                    if (tempData.topObj.RecordTip !== null || tempData.topObj.RecordAudio !== null) {
                        this.props.setReporteTip(tempData.topicInfo, tempData.examContent, tempData.gropObj, tempData.topObj, "RecordTip");
                    } else {
                        this.goAnswer();//去答题
                    }
                }
            }, 1000);
        }
    }

    //去答题
    goAnswer() {

        let tempData = this.state.tempData;
        //是否是录音类型
        let isRecord = tempData.gropObj.Type === 2 || tempData.gropObj.Type === 4 || tempData.gropObj.Type === 5;

        if (isRecord) {//如果是录音的话检查当前是不是 开始录音
            let startPath = utils.findPlayPath("common/start.mp3", this.props.examPath);
            if (this.state.currPath !== startPath) {//如果不是开始录音提示语 去播放开始录音提示语
                this.startPlay(startPath);
                return;
            }
        }

        //检查是否有答题时间
        if (answerTime <= 0) {
            answerTime = tempData.topObj.AnswerTime;
            if (tempData.gropObj.Type === 3) {
                answerTime = tempData.topObj.AnswerTime + 10;
            }
        }

        if (answerTime > 0) {//如果有答题时间
            let timeProgress = "答题倒计时: ";
            if (isRecord) {//如果是录音 答题时间开始答题
                this.audioAnswerRecord();
                timeProgress = "录音倒计时: ";
            }


            timeInteval3 = setInterval(() => {//读题时间计时器
                answerTime--;
                if (tempData.gropObj.Type === 3) {//倒计时进度
                    if (answerTime > 10) {
                        this.props.reloadCurrTime(timeProgress + (answerTime - 10));
                    } else {
                        this.props.reloadCurrTime("延时倒计时：" + answerTime);
                    }
                } else {
                    this.props.reloadCurrTime(timeProgress + answerTime);
                }
                // this.props.reloadCurrTime(timeProgress + answerTime);
                if (answerTime <= 0) {
                    clearInterval(timeInteval3);
                    if (isRecord) {
                        this.stopRecord();
                    } else {
                        //找下一步
                        this.props.getNextStep(tempData.topicInfo, tempData.examContent, tempData.gropObj, tempData.topObj);
                    }
                }
            }, 1000);
        }
    }

    //录音答案记录
    audioAnswerRecord() {
        let tempData = this.state.tempData;

        let name = tempData.topObj.ID;
        let lastname = (utils.PLATNAME === "IOS") ? '.wav' : '';
        let currAnPath = this.props.examPath + "/answer" + this.props.answerRecord.version;
        let path = currAnPath + '/' + name + lastname;
        // let path = currAnPath + '/' + name + lastname;
        this.setState({
            isPlaying: false,//开始录音 播放设置为否
        }, () => {
            Audio1.startRecord(path);
        });
        //录音之后  保存答案
        let type = tempData.gropObj.Type;
        let id = tempData.topObj.TopicInfoList[0].UniqueID;
        let num = tempData.topObj.TopicInfoList[0].ID;
        let lastPath = currAnPath + '/' + name + '.wav';
        this.props.saveAnswer(type, id, num, lastPath);
    }

    //停止录音
    stopRecord() {
        answerTime = 0;
        this.clearInteval(timeInteval3);

        Audio1.stopRecord();

        this.setState({
            isPlaying: true,
        })
        let stopPath = utils.findPlayPath("common/stop.mp3", this.props.examPath);
        this.startPlay(stopPath);
    }

    //下一步点击事件
    nextStep() {
        // alert('click next step');
        let tempData = this.state.tempData;
        if (readTime > 0) {//如果是读题时间    跳过读题时间      去读内容
            readTime = 0;
            this.props.reloadCurrTime("跳过读题时间");
            clearInterval(timeInteval2);

            if (tempData.gropObj.Type === 5 && tempData.topObj.IsHideAudioPath === false) {
                //如果是短文朗读并且隐藏AudioPath内容音频 不需要读内容
                this.readContentEnd();
            } else {
                //读内容音频路径
                let contentPath = utils.findPlayPath(tempData.topicInfo.contentPath, this.props.examPath);
                //开始读内容
                this.startPlay(contentPath);
            }
        } else if (answerTime > 0) {// 如果是答题时间的话     跳过答题时间     去走下一步
            clearInterval(timeInteval3);
            answerTime = 0;
            this.props.reloadCurrTime("跳过答题时间");

            if (this.state.isPlaying === false) {//如果是正在录音
                // alert('录音下一步');
                this.stopRecord();
            } else {
                let tempData1 = this.props.dataSource;
                //找下一步
                this.props.getNextStep(tempData1.topicInfo, tempData1.examContent, tempData1.gropObj, tempData1.topObj);
            }
        } else if (readyTime > 0) {
            readyTime = 0;
            this.props.reloadCurrTime("跳过准备时间");
            clearInterval(timeInteval4);
            //是否有录音前提示语(录音题有可能有录音前提示语)
            if (tempData.topObj.RecordTip !== null || tempData.topObj.RecordAudio !== null) {
                this.props.setReporteTip(tempData.topicInfo, tempData.examContent, tempData.gropObj, tempData.topObj, "RecordTip");
            } else {
                this.goAnswer();//去答题
            }
        } else {
            
            // if(this.state.isPlaying && this.state.isPaused){//如果是暂停
            //     this.continue();
            // }
            // Sound1.soundStop();
            this.props.reloadCurrTime("查找下一步...");
            this.clickNext=true;
            this.setState({
                isPaused: false,
            });
            Sound1.soundStop();
            this.findProgress(timeInteval);

            // if (this.state.isPlaying && this.state.isPaused) {//如果是暂停
            //     this.setState({
            //         isPaused: false,
            //     }, () => {
            //         this.findProgress(timeInteval);
            //     })
            // } else {
            //     Sound1.soundStop();
            //     this.findProgress(timeInteval);
            // }
            // this.props.reloadCurrTime("查找下一步...");
        }
    }

    //下一题点击事件
    nextGroup() {

        this.clearInteval();//取消所有计时器

        this.getDefaultTime();//恢复默认时间
        
        
        // setTimeout(()=>{
            this.clickNext=true;
            this.stopPlayAndRecord();//停止播放停止录音
            this.setState({//播放暂停状态恢复默认
                isPlaying: true,
                isPaused: false,
            },()=>{
                this.props.reloadCurrTime("查找下一题...");
            })

            let tempData = this.props.dataSource;
            //找下一步
            this.props.getNextStep(tempData.topicInfo, tempData.examContent, tempData.gropObj, tempData.topObj);
            // this.props.getNextGroup(tempData.topicInfo, tempData.examContent, tempData.gropObj);
        // },500)
    }

    //加载录音播放按钮
    getButton() {
        if (this.props.dataSource.topicInfo.currLevel === "finished") {
            return <View>
                <Text>{"正在交卷中，请稍等，退出或返回可能会导致答案提交失败\n"}</Text>
                <Text>{"交卷成功，将自动返回到开始考试页，点击查看考试记录进入考试记录详情"}</Text>
            </View>
        } else if (this.state.isPlaying && this.state.isPaused === false) {//点击按钮暂停播放
            return <TouchableOpacity style={styles.button} onPress={() =>utils.callOnceInInterval(this.pause)}>
                <Image
                    style={{ width: '100%', height: '100%' }}
                    source={require('../imgs/testIcon/ks_bf_icon.png')}
                />
            </TouchableOpacity>
        } else if (this.state.isPlaying && this.state.isPaused) {//点击按钮继续播放
            return <TouchableOpacity style={styles.button} onPress={() =>utils.callOnceInInterval(this.continue)}>
                <Image
                    style={{ width: '100%', height: '100%' }}
                    source={require('../imgs/testIcon/ks_zt_icon.png')}
                />
            </TouchableOpacity>
        } else {//点击按钮停止录音
            return <TouchableOpacity style={styles.button} onPress={() =>utils.callOnceInInterval(this.stopRecord)}>
                <Image
                    style={{ width: '100%', height: '100%' }}
                    source={require('../imgs/testIcon/ks_tz_icon.png')}
                />
            </TouchableOpacity>
        }
    }

    //加载播放控制按钮 下一步、下一题、交卷
    getConBtn() {
        if (this.props.dataSource.topicInfo.currLevel !== "finished") {
            return <View style={styles.conBtnView}>
                <TouchableOpacity style={styles.conBtn1}
                    onPress={() => utils.callOnceInInterval(() => this.nextStep())}>
                    <Text style={styles.conBtnText}>下一步</Text>
                </TouchableOpacity>
                {
                    this.props.dataSource.isLast === true ? null :
                        <TouchableOpacity style={styles.conBtn1}
                            onPress={() => utils.callOnceInInterval(this.nextGroup)}>
                            <Text style={styles.conBtnText}>下一题</Text>
                        </TouchableOpacity>
                }
                <TouchableOpacity style={styles.conBtn2} onPress={() => utils.callOnceInInterval(this.props.commitExam)}>
                    <Text style={styles.conBtnText}>交卷</Text>
                </TouchableOpacity>
            </View>
        }
    }

    render() {
        return (
            <View style={styles.audio}>
                {/*<TouchableOpacity style={styles.button} onPress={() => Audio1.startRecord(audioPath)}>*/}
                {/*<Text>录音</Text>*/}
                {/*</TouchableOpacity>*/}
                {/*<TouchableOpacity style={styles.button} onPress={Audio1.stopRecord}>*/}
                {/*<Text>停止录音</Text>*/}
                {/*</TouchableOpacity>*/}
                {/*<TouchableOpacity style={styles.button} onPress={Audio1.pauseRecord}>*/}
                {/*<Text>暂停录音</Text>*/}
                {/*</TouchableOpacity>*/}

                {/*<TouchableOpacity style={styles.button} onPress={() => this.startPlay(this.props.soundPath)}>*/}
                {/*<Text>播放录音</Text>*/}
                {/*</TouchableOpacity>*/}

                {
                    this.getButton()
                }

                {/*<TouchableOpacity style={styles.button} onPress={Sound1.soundStop}>*/}
                {/*<Text>停止播放</Text>*/}
                {/*</TouchableOpacity>*/}
                {/*<TouchableOpacity style={styles.button} onPress={Sound1.soundContinue}>*/}
                {/*<Text>继续播放</Text>*/}
                {/*</TouchableOpacity>*/}
                {/*<TouchableOpacity style={styles.button} onPress={Sound1.soundPause}>*/}
                {/*<Text>暂停播放</Text>*/}
                {/*</TouchableOpacity>*/}

                <Text style={{ marginLeft: 10*utils.SCREENRATE,fontSize:15*utils.SCREENRATE }}>{this.props.dataSource.topicInfo.currLevel === "finished" ? "" : this.props.currPlayTime}</Text>


                {
                    this.getConBtn()
                }

            </View>
        );
    }
}

const mapStateToProps = (state) => {
    // 那个里面有所有数据   就是 长度
    let dataSource = state.detail;
    const taskId = dataSource.taskId;
    let examPath = dataSource.currentExamPath;
    let answerRecord = dataSource.answerRecord;
    let answers = dataSource.answers;
    let soundPath = '';
    if (dataSource.topicInfo) {
        if (dataSource.topicInfo.audioPath !== null) {
            let path = dataSource.topicInfo.audioPath;
            if (path == null) {
                path = "common/t3_1_tip.mp3";
            }
            soundPath = utils.findPlayPath(path, examPath);
        } else {
            soundPath = utils.findPlayPath(dataSource.topicInfo.contentPath, examPath);
        }
    }
    let currPlayTime = state.detail.currPlayTime;
    return {
        soundPath,
        currPlayTime,
        dataSource,
        examPath,
        answerRecord,
        answers,
        taskId,
        Alert,
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        reloadCurrTime: (timeStr) => {
            dispatch(savePlayTime(timeStr));
        },
        getNextStep: (currTopic, examDetail, currGropObj, currTopObj) => {
            dispatch(getNextTopicDetail(currTopic, examDetail, currGropObj, currTopObj));
        },
        getNextGroup: (currTopic, examDetail, currGropObj) => {
            dispatch(getNextGroup(currTopic, examDetail, currGropObj));
        },
        setReporteTip: (currTopic, examDetail, currGropObj, currTopObj, type) => {
            dispatch(setReportingTip(currTopic, examDetail, currGropObj, currTopObj, type));
        },
        commitExam: () => {
            // dispatch(commintCurrExam());
            Alert.alert('提示', '确定交卷？',
                [
                    { text: "取消", onPress: () => { } },
                    {
                        text: "确定", onPress: () => {
                            dispatch(commintCurrExam());
                        }
                    },
                ]
            );
        },
        saveAnswer: (Type, id, num, answer) => {
            dispatch(saveCurrExamAnswers(Type, id, num, answer));
        },
        saveAnswerInfo: (answerDic) => {
            dispatch(saveAnswerRecord(answerDic));
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AudioSoundConCom);


const styles = StyleSheet.create({
    audio: {
        // marginTop:10,
        width: utils.SCREENWIDTH - 30*utils.SCREENRATE,
        height: 100*utils.SCREENRATE,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        alignItems: 'center',
        // backgroundColor:'#dddddd',
        position: "absolute",
        bottom: utils.PLATNAME === "IOS" ? 10*utils.SCREENRATE : 30*utils.SCREENRATE,
    },
    button: {
        width: 60*utils.SCREENRATE,
        height: 60*utils.SCREENRATE,
        // backgroundColor: "#cccccc",
        // borderRadius: 75*utils.SCREENRATE / 2,
        // borderWidth: 1,
        // borderColor: '#999999',
    },
    conBtnView: {
        position: "absolute",
        // bottom:utils.PLATNAME==="IOS"?10:30,
        right: 0,
        width: 100*utils.SCREENRATE,
        height: '100%',
    },
    conBtn1: {
        width: '100%',
        height: 30*utils.SCREENRATE,
        backgroundColor: utils.COLORS.theme,
        marginBottom: 5*utils.SCREENRATE,
        borderRadius: 3*utils.SCREENRATE,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    conBtn2: {
        width: '100%',
        height: 30*utils.SCREENRATE,
        backgroundColor: '#ff6169',
        // marginTop:5,
        borderRadius: 3*utils.SCREENRATE,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    conBtnText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 15*utils.SCREENRATE,
        fontWeight: '600',
    }
});