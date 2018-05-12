import React, { Component } from "react";
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image, ActivityIndicator,DeviceEventEmitter } from "react-native";
import utils from "../utils";
import NavBar from '../components/navBar';

import { connect } from "react-redux";
import { saveAnswerRecord } from "../store/actions";

import HearSelect from '../components/HearSelectCom';
import HearRecord from '../components/HearRecordCom';
import HearSelPic from '../components/HearSelPicCom';
// import AudioSoundConCom from '../components/AudioSoundConCom'
import AudioSoundConCom from '../components/ExamConCom'
import AnswerCom from '../components/answerCom';
import RNFS from "react-native-fs";
import { detail } from "../store/reducer";

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
        this.state = {
            currPage: pageStatus.examIng,
        };

        let that = this;
        this.paperCon = new PaperController(this.props.examPath, this.props.examContent, (stepInfo, progressInfo) => {
            //播放信息
            that.setState({
                stepInfo: stepInfo,
                isRecording: stepInfo.isRecording,
                stepType: stepInfo.stepType,
                levelType: stepInfo.levType,
                progressInfo: progressInfo,
            });
        }, () => {
            that.setState({ currPage: pageStatus.sureSubmit });
            that.paperCon.stepCon.end(true);
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.answers !== this.props.answers) {
            let path = this.props.examPath + "/answer" + this.props.answerRecord.version + '/answer.json';
            RNFS.writeFile(path, JSON.stringify(nextProps.answers), 'utf8').then(() => { });
        }
    }

    componentDidMount() {
        RNIdle.disableIdleTimer()    //保持屏幕常亮

        if(this.props.navigation.state.params.isNew){
            this.paperCon.initNewStep(true);//初始化步骤
        }else{
            setTimeout(()=>{
                this.paperCon.initNewStep(false,this.props.answerRecord);
            },2000);
            
        }
        
        DeviceEventEmitter.addListener("reloadProgress",(progress)=>{
            let newProgress=this.props.answerRecord;
            newProgress.progress=progress;
            newProgress.examPath=this.props.examPath;
            this.props.saveAnswerInfo(newProgress);
        })
    }
    componentWillUnmount() {
        RNIdle.enableIdleTimer()     //退出屏幕常亮
        DeviceEventEmitter.removeAllListeners('reloadProgress');
    }
    saveAnsweRecord(){//保存答题进度

    }
    getComponent() {
        if (this.state.stepInfo) {
            if (this.state.stepInfo.data.Type === 1) {//听后选择
                return <HearSelect contentData={this.state.stepInfo.data.TopicInfoList} />;
            } else if (this.state.stepInfo.data.Type === 2) {//听后回答
                return <Text style={styles.title}>{this.state.stepInfo.data.TopicInfoList[0].Title}</Text>;
            } else if (this.state.stepInfo.data.Type === 3) {//听后记录
                return <HearRecord contentData={this.state.stepInfo.data.TopicInfoList} examPath={this.props.examPath} type={this.state.stepInfo.data.Type} />;
            } else if (this.state.stepInfo.data.Type === 4) {//转述信息
                return <HearRecord contentData={this.state.stepInfo.data.TopicInfoList} examPath={this.props.examPath} type={this.state.stepInfo.data.Type} />;
            } else if (this.state.stepInfo.data.Type === 5) {//短文朗读
                return <Text style={styles.title}>{this.state.stepInfo.data.TopicInfoList.Title}</Text>;
            } else if (this.state.stepInfo.data.Type === 10) {//听后选图
                return <HearSelPic contentData={this.state.stepInfo.data.TopicInfoList} examPath={this.props.examPath} imgList={this.state.stepInfo.data.ImgList} />;
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
                        : (this.state.currPage === pageStatus.sureSubmit) ? <View style={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap" }}>
                            <Image style={{ marginTop: 60 * utils.SCREENRATE }} source={require("../imgs/testIcon/zy-k-iocn.png")} />
                            <Text style={{ lineHeight: 24 * utils.SCREENRATE, fontSize: 15 * utils.SCREENRATE, marginTop: 20 * utils.SCREENRATE, color: utils.COLORS.theme1 }} >
                                {"温馨提示:\n考试已完成，确认交卷吗？\n1.如您误操作可重新答题哦！\n2.对此次考试不满意可选择不交卷哦！"}
                            </Text>
                            <View style={{ width: utils.SCREENWIDTH, flexDirection: "row", justifyContent: "center" }}>
                                <TouchableOpacity onPress={() => { this.props.navigation.goBack(); }}
                                    style={{ width: utils.SCREENWIDTH * 0.3, margin: 10 * utils.SCREENRATE, backgroundColor: "#999999", borderRadius: 5 * utils.SCREENRATE }}>
                                    <Text style={{ textAlign: "center", color: "white", fontWeight: "600", lineHeight: 40 * utils.SCREENRATE, fontSize: 15 * utils.SCREENRATE }}>{"再做一次"}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { this.setState({ currPage: pageStatus.submitIng }); }}
                                    style={{ width: utils.SCREENWIDTH * 0.3, margin: 10 * utils.SCREENRATE, backgroundColor: utils.COLORS.theme, borderRadius: 5 * utils.SCREENRATE }}>
                                    <Text style={{ textAlign: "center", color: "white", fontWeight: "600", lineHeight: 40 * utils.SCREENRATE, fontSize: 15 * utils.SCREENRATE }}>{"确认交卷"}</Text>
                                </TouchableOpacity>
                            </View>
                        </View> : <View style={{ width: "80%", backgroundColor: "rgba(0,0,0,0)" }}>
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
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoTest);

