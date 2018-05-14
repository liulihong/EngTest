import React, { Component } from "react";
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image, ActivityIndicator, DeviceEventEmitter } from "react-native";
import utils from "../utils";
import NavBar from '../components/navBar';

import { connect } from "react-redux";
import { saveAnswerRecord, saveCurrExamAnswers } from "../store/actions";

import HearSelect from '../components/HearSelectCom';
import HearRecord from '../components/HearRecordCom';
import HearSelPic from '../components/HearSelPicCom';
// import AudioSoundConCom from '../components/AudioSoundConCom'
import AudioSoundConCom from '../components/ExamConCom'
import AnswerCom from '../components/answerCom';
import RNFS from "react-native-fs";
import { detail } from "../store/reducer";
import SubmitAnswer from "../utils/submitAnswer";
import { fetchPost } from '../request/fetch';
import { endExam } from '../request/requestUrl';

import RNIdle from 'react-native-idle'//屏保常亮
import PaperController from "../module/proCon/paperController";
import { levelType, StatusType, PlayType, WaitType } from "../module/proCon/paperStatus";

const pageStatus = {
    examIng: "考试中",
    sureSubmit: "确认交卷",
    submitIng: "交卷中",
}

const styles = StyleSheet.create({
    contain: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        height: utils.SCREENHEIGHT,
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: utils.COLORS.background1,
    },
    title: {
        color: utils.COLORS.theme1,
        fontSize: 17 * utils.SCREENRATE,
        // textAlign:"auto",
        lineHeight: 25 * utils.SCREENRATE,
        marginBottom: 10 * utils.SCREENRATE,
    },
    content: {
        marginTop: 15 * utils.SCREENRATE,
        backgroundColor: "#ffffff",
        width: utils.SCREENWIDTH - 30 * utils.SCREENRATE,
        height: utils.SCREENHEIGHT - 100 * utils.SCREENRATE - 100,
        padding: 10 * utils.SCREENRATE,
        paddingTop: 0,
        paddingBottom: 0,
        borderRadius: 8 * utils.SCREENRATE,
    },
    contentScr: {
        // display:'flex',
    },
});

class VideoTest extends Component {

    constructor(props) {
        super(props)
        this.getContent = this.getContent.bind(this);
        this.getComponent = this.getComponent.bind(this);
        this.setScroInfo = this.setScroInfo.bind(this);
        this.submitExamFinish = this.submitExamFinish.bind(this);
        this.setRecordPath = this.setRecordPath.bind(this);
        this.saveRecordAnswer = this.saveRecordAnswer.bind(this);
        this.newStepCallBack = this.newStepCallBack.bind(this);
        this.paperEndCallBack = this.paperEndCallBack.bind(this);

        this.state = {
            currPage: pageStatus.examIng,
        };

        //初始化试卷控制器
        this.paperCon = new PaperController(
            this.props.examPath,
            this.props.examContent,
            (stepInfo, progressInfo) => this.newStepCallBack(stepInfo,progressInfo),
            this.paperEndCallBack
        );
    }

    //新步骤回调
    newStepCallBack(stepInfo, progressInfo) {
        let name = stepInfo.data.ID;
        if (stepInfo.levType === levelType.minSubject && stepInfo.data.isRecord === true)//如果是录音小题 给步骤控制器设置录音地址
            this.paperCon.stepCon.recordPath = this.setRecordPath(name);
        if (stepInfo.isRecording)//如果是录音 保存录音信息
            this.saveRecordAnswer(name, stepInfo.data);
        //播放信息
        this.setState({
            stepInfo: stepInfo,
            isRecording: stepInfo.isRecording,
            stepType: stepInfo.stepType,
            levelType: stepInfo.levType,
            progressInfo: progressInfo,
        });
    }

    //试卷结束回调
    paperEndCallBack() {
        //试卷结束回调
        this.setProgressToSave("finish", true);//设置试卷为已完成
        this.setState({ currPage: pageStatus.sureSubmit });
        this.paperCon.stepCon.end(true);
    }

    //设置录音地址
    setRecordPath(name) {
        let lastname = (utils.PLATNAME === "IOS") ? '.wav' : '';
        let currAnPath = this.props.examPath + "/answer" + this.props.answerRecord.version;
        let path = currAnPath + '/' + name + lastname; //录音地址
        return path;
    }

    //保存录音答案信息
    saveRecordAnswer(name, topObj) {
        let currAnPath = this.props.examPath + "/answer" + this.props.answerRecord.version;
        let type = topObj.Type;
        let id = topObj.TopicInfoList[0].UniqueID;
        let num = topObj.TopicInfoList[0].ID;
        let lastPath = currAnPath + '/' + name + '.wav';
        this.props.saveAnswer(type, id, num, lastPath);
    }

    //属性数据改变
    componentWillReceiveProps(nextProps) {
        if (nextProps.answers !== this.props.answers) {
            let path = this.props.examPath + "/answer" + this.props.answerRecord.version + '/answer.json';
            RNFS.writeFile(path, JSON.stringify(nextProps.answers), 'utf8').then(() => { });
        }
    }

    //组件加载完成
    componentDidMount() {

        RNIdle.disableIdleTimer()    //保持屏幕常亮

        //初始化步骤
        if (this.props.navigation.state.params.isNew) {
            this.paperCon.initNewStep(true);
        } else {
            this.paperCon.initNewStep(false, this.props.answerRecord);
        }

        //提交答案实例初始化
        let LogID = this.props.answerRecord.LogID;
        this.submitModel = new SubmitAnswer(this.submitExamFinish, LogID);
        this.submitModel.haveSubmit = false;

        //保存考试进度
        DeviceEventEmitter.addListener("reloadProgress", (progress) => {
            this.setProgressToSave("progress", progress);
        });
        //提交小题答案
        DeviceEventEmitter.addListener("submitAnswer", (topObj, groupObj) => {
            if (this.props.answers && this.props.answers[groupObj.Type] && topObj.TopicInfoList) {
                let answer = this.props.answers[groupObj.Type];
                this.submitModel.addSubmitTask(groupObj, answer, topObj);
            }
        });
    }

    //组件将要销毁
    componentWillUnmount() {
        DeviceEventEmitter.emit('ChangeUI');//通知开始考试页面刷新UI
        RNIdle.enableIdleTimer()     //退出屏幕常亮
        DeviceEventEmitter.removeAllListeners('reloadProgress');
        DeviceEventEmitter.removeAllListeners('submitAnswer');
    }

    //设置考试进度 name属性名 value属性值
    setProgressToSave(name, value) {
        let newProgress = this.props.answerRecord;
        newProgress[name] = value;
        // newProgress.examPath = this.props.examPath;
        this.props.saveAnswerInfo(newProgress);
    }

    //获取组件内容
    getComponent() {
        if (this.state.stepInfo && this.state.stepInfo.data) {
            let topObj = this.state.stepInfo.data;
            switch (topObj.Type) {
                case 1:
                    return <HearSelect contentData={topObj.TopicInfoList} />;
                case 2:
                    return <View>
                        {
                            topObj.TopicInfoList.map((topicObj, i) => {
                                return <Text key={i} style={styles.title}>{topicObj.Title}</Text>
                            })
                        }
                    </View>
                case 3:
                    return <HearRecord contentData={topObj.TopicInfoList} examPath={this.props.examPath} type={topObj.Type} />;
                case 4:
                    return <HearRecord contentData={topObj.TopicInfoList} examPath={this.props.examPath} type={topObj.Type} />;
                case 5:
                    return <View>
                        {
                            topObj.TopicInfoList.map((topicObj, i) => {
                                return <Text key={i} style={styles.title}>{topicObj.Title}</Text>
                            })
                        }
                    </View>;
                case 10:
                    return <HearSelPic contentData={topObj.TopicInfoList} examPath={this.props.examPath} imgList={topObj.ImgList} />;
                default:
                    return null;
            }
        }
    }

    //如果不是读标题  内容展示区
    getContent() {
        if (this.state.levelType === levelType.minSubject) {
            return (
                <View style={{ padding: 5 * utils.SCREENRATE }}>
                    <Text style={styles.title}>{this.state.stepInfo.data.Title}</Text>
                    <Text style={styles.title}>{this.state.stepInfo.data.Desc}</Text>
                    {
                        //提示语
                        (this.state.stepInfo.anaInfo.tip) ? <Text style={[styles.title, { color: "red" }]}>{"Tip: " + this.state.stepInfo.anaInfo.tip}</Text> : <View />
                    }
                    {
                        this.getComponent()
                    }
                </View>
            );
        } else {
            return <Text style={styles.title}>{this.state.stepInfo ? this.state.stepInfo.anaInfo.title : ""}</Text>
        }
    }

    setScroInfo(e) {
        this.offsetY = e.nativeEvent.contentOffset.y; //滑动距离
        this.contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
        this.oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度

        let isTop1 = (this.offsetY <= 0);
        let isBottom1 = (this.offsetY >= (this.contentSizeHeight - this.oriageScrollHeight));
        // debugger
        if (this.state.isTop === null || isTop1 !== this.state.isTop) this.setState({ isTop: isTop1 });
        if (this.state.isBottom === null || isBottom1 !== this.state.isBottom) this.setState({ isBottom: isBottom1 });
    }

    //服务器交卷
    submitExamFinish() {

        if (this.submitModel.taskNum <= 0 && this.submitModel.haveSubmit === true) {

            this.submitModel.haveSubmit === false;
            let LogID = this.props.answerRecord.LogID;
            let TaskLogID = this.props.answerRecord.TaskLogID;
            fetchPost(endExam, { LogID, TaskLogID }).then((res) => {

                if (res.success === true) {
                    this.setProgressToSave("isSubmit", true);
                    this.props.navigation.goBack();
                    // alert("考试完成，静待考试结果吧");
                } else {
                    alert("交卷错误:  " + JSON.stringify(res));
                }

            }, (error) => {

                alert("交卷错误:  " + JSON.stringify(error));
            })
        }
    }

    render() {
        return (
            <View style={styles.contain}>

                <NavBar navtitle={this.props.examContent.SecTitle} isBack={true} navgation={this.props.navigation} />

                {
                    (this.state.currPage === pageStatus.examIng) ?
                        <View><View style={styles.content}>
                            {
                                (this.offsetY && this.offsetY > 0 && this.state.isTop === false) ? <TouchableOpacity
                                    style={{ flexDirection: "row", backgroundColor: "rgba(0,0,0,0)", width: "100%", height: 30 * utils.SCREENRATE, alignItems: "center", justifyContent: "center" }}
                                    onPress={() => {
                                        // if (this.contentSizeHeight !== undefined) {
                                        //     let showY = (this.offsetY - 20) > 0 ? this.offsetY - 20 : 0;
                                        //     this._scroll.scrollTo({ y: showY });
                                        // } else {
                                        this._scroll.scrollTo({ y: 0 });
                                        this.setState({ isTop: true });
                                        // }
                                    }}
                                >
                                    <Text style={{ color: "gray", fontSize: 12 * utils.SCREENRATE }}>{"回到顶部 ⇈"}</Text>
                                </TouchableOpacity> : <TouchableOpacity style={{ flexDirection: "row", backgroundColor: "rgba(0,0,0,0)", width: "100%", height: 10 * utils.SCREENRATE, alignItems: "center", justifyContent: "center" }} />
                            }
                            <ScrollView
                                ref={(scroll) => this._scroll = scroll}
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps={"handled"}
                                onMomentumScrollEnd={(e) => {
                                    this.setScroInfo(e);
                                }}
                                onScrollEndDrag={(e) => {
                                    this.setScroInfo(e);
                                }}
                                onContentSizeChange={(contentWidth, contentHeight) => {
                                    this.contentSizeHeight = contentHeight;
                                    this.offsetY = 0; //滑动距离
                                    this.oriageScrollHeight = utils.SCREENHEIGHT - 100 * utils.SCREENRATE - 100 - 20 * utils.SCREENRATE; //scrollView高度
                                    let isTop1 = (this.offsetY <= 0);
                                    let isBottom1 = (this.offsetY >= (this.contentSizeHeight - this.oriageScrollHeight));
                                    if (this.state.isTop === null || isTop1 !== this.state.isTop) this.setState({ isTop: isTop1 });
                                    if (this.state.isBottom === null || isBottom1 !== this.state.isBottom) this.setState({ isBottom: isBottom1 });
                                }}
                            >
                                {
                                    this.getContent()
                                }
                            </ScrollView>
                            {
                                (this.state.isBottom !== true) ? <TouchableOpacity
                                    style={{ flexDirection: "row", width: "100%", height: 30 * utils.SCREENRATE, alignItems: "center", justifyContent: "center" }}
                                    onPress={() => {
                                        let maxOffSet = this.contentSizeHeight - this.oriageScrollHeight;
                                        if (this.contentSizeHeight !== undefined) {
                                            let showY = (this.offsetY + 45 * utils.SCREENRATE) <= maxOffSet ? (this.offsetY + 45 * utils.SCREENRATE) : maxOffSet;
                                            this._scroll.scrollTo({ y: showY });
                                        } else {
                                            this._scroll.scrollToEnd();
                                        }
                                        if (maxOffSet <= this.offsetY) {
                                            this.setState({ isBottom: true });
                                        }
                                    }}
                                >
                                    <Text style={{ fontSize: 12 * utils.SCREENRATE, color: "gray" }}>{"滑动查看更多 ⇊"}</Text>
                                </TouchableOpacity> : <TouchableOpacity
                                        style={{ flexDirection: "row", backgroundColor: "rgba(0,0,0,0)", width: "100%", height: 10 * utils.SCREENRATE, alignItems: "center", justifyContent: "center" }}
                                    />
                            }
                        </View>

                            <AudioSoundConCom navigation={this.props.navigation} paperCon={this.paperCon} isRecording={this.state.isRecording} progressInfo={this.state.progressInfo} /></View>
                        : (this.state.currPage === pageStatus.sureSubmit) ?
                            <View style={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap" }}>
                                <Image style={{ marginTop: 60 * utils.SCREENRATE }} source={require("../imgs/testIcon/zy-k-iocn.png")} />
                                <Text style={{ lineHeight: 24 * utils.SCREENRATE, fontSize: 15 * utils.SCREENRATE, marginTop: 20 * utils.SCREENRATE, color: utils.COLORS.theme1 }} >
                                    {"温馨提示:\n考试已完成，确认交卷吗？\n1.如您误操作可重新答题哦！\n2.对此次考试不满意可选择不交卷哦！"}
                                </Text>
                                <View style={{ width: utils.SCREENWIDTH, flexDirection: "row", justifyContent: "center" }}>
                                    <TouchableOpacity onPress={() => { this.props.navigation.goBack(); }}
                                        style={{ width: utils.SCREENWIDTH * 0.3, margin: 10 * utils.SCREENRATE, backgroundColor: "#999999", borderRadius: 5 * utils.SCREENRATE }}>
                                        <Text style={{ textAlign: "center", color: "white", fontWeight: "600", lineHeight: 40 * utils.SCREENRATE, fontSize: 15 * utils.SCREENRATE }}>{"再做一次"}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        //交卷接口
                                        this.submitModel.haveSubmit = true;//可以交卷
                                        this.submitExamFinish();
                                        //显示交卷中页面
                                        this.setState({ currPage: pageStatus.submitIng });
                                    }}
                                        style={{ width: utils.SCREENWIDTH * 0.3, margin: 10 * utils.SCREENRATE, backgroundColor: utils.COLORS.theme, borderRadius: 5 * utils.SCREENRATE }}>
                                        <Text style={{ textAlign: "center", color: "white", fontWeight: "600", lineHeight: 40 * utils.SCREENRATE, fontSize: 15 * utils.SCREENRATE }}>{"确认交卷"}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View> :
                            <View style={{ width: "80%", backgroundColor: "rgba(0,0,0,0)" }}>
                                <ActivityIndicator
                                    animating={true}
                                    style={[{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: 8 * utils.SCREENRATE,
                                    }, { height: utils.SCREENHEIGHT / 3 }]}
                                    size="large"
                                />
                                {/* <Text style={{ textAlign: "center" }}>{"正在交卷中..."}</Text> */}
                                <Text>{"正在交卷中，请稍等，退出或返回可能会导致答案提交失败\n"}</Text>
                                <Text>{"交卷成功，将自动返回到开始考试页，点击查看考试记录进入考试记录详情"}</Text>
                            </View>
                }

            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const examContent = state.detail.examContent;
    const examPath = state.detail.currentExamPath;
    const answerRecord = state.detail.answerRecord;
    const answers = state.detail.answers;

    return {
        examContent,
        examPath,
        answers,
        answerRecord,
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        saveAnswerInfo: (answerDic) => {
            dispatch(saveAnswerRecord(answerDic));
        },
        saveAnswer: (Type, id, num, answer) => {
            dispatch(saveCurrExamAnswers(Type, id, num, answer));
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoTest);

