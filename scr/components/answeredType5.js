import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import utils from '../utils';
import MySound from "../utils/soundPlay";

let Sound1 = new MySound;
let timeInteval;

export default class AnsweredType5 extends Component {
    constructor() {
        super();
        this.startPlay = this.startPlay.bind(this);
        this.state = {
            currentScore: 0.00,
            palyPath: "",
        }
    }

    //组件卸载 播放停止
    componentWillUnmount() {
        clearInterval(timeInteval);
        Sound1.soundStop();
    }

    //开始播放
    startPlay(path) {
        clearInterval(timeInteval);
        Sound1.soundStop();
        this.setState({
            palyPath: path,
        })
        Sound1.startPlay(path);

        timeInteval = setInterval(() => {
            let isLoaded = Sound1.soundIsLoaded();
            if (isLoaded) {
                Sound1.soundGetCurrentTime((time, isPlaying) => {
                    if (isPlaying === false) {
                        clearInterval(timeInteval);
                        this.setState({
                            palyPath: "",
                        })
                    }
                });
            }
        }, 1000);
    }


    render() {
        let groupObj = this.props.groupObj;
        let localAnswer = this.props.localAnswer;
        let serverAnswer = this.props.serverAnswer;
        let examPath = this.props.examPath;
        let totalScore = ((serverAnswer.totalScore) === undefined ? 0 : serverAnswer.totalScore) + "分 / " + this.props.totalScore + "分";
        let topObj0 = groupObj.ExamTopics[0];
        return (
            <View style={styles.contain}>
                {/* 大题总分展示 */}
                <Text style={styles.totalScore}>{totalScore}</Text>
                {/* 大题标题 */}
                <Text style={styles.maxTitle}>{topObj0.Title}</Text>

                {
                    groupObj.ExamTopics.map((topObj, i) => {
                        {/* topObj */ }
                        let path = (topObj.AudioPath !== null) ? utils.findPlayPath(topObj.AudioPath, examPath) : null;
                        let isPlay = (path === this.state.palyPath);
                        let source = isPlay ? require("../imgs/aswerIcon/dt_bf_icon.png") : require("../imgs/aswerIcon/dt_zt_icon.png");

                        return (
                            <View key={i} style={styles.topObj}>
                                {/* 小标题 */}
                                {/* <TouchableOpacity style={styles.audioInfo} onPress={() => {
                                    if (isPlay) {
                                        Sound1.soundStop();
                                    } else {
                                        this.startPlay(path);
                                    }
                                }} >
                                    <Text style={styles.minTitle}>
                                        <Image style={styles.audioBtn}
                                            source={source}
                                        />
                                        {"  听力原文如下："}
                                    </Text>
                                </TouchableOpacity> */}
                                {/* 音频内容 */}
                                {/* <Text style={styles.articleTxt}>
                                    {topObj.AudioText}
                                    <Image style={styles.audioBtn}
                                            source={require("../imgs/aswerIcon/dt_zt_icon.png")}
                                        />
                                </Text> */}

                                {
                                    topObj.TopicInfoList.map((minObj, j) => {
                                        {/* 每小题 */ }
                                        let oriAns = minObj.Correct;
                                        let newAns = "";
                                        if (localAnswer && localAnswer[minObj.UniqueID] !== undefined)
                                            newAns = localAnswer[minObj.UniqueID].answer;

                                        let isCorrect = false;
                                        let scoreStr = "(未作答)";
                                        if (serverAnswer !== undefined && serverAnswer.LogList !== undefined && serverAnswer.LogList.length > 0) {
                                            for (let i = 0; i < serverAnswer.LogList.length; i++) {
                                                let answerInfo = serverAnswer.LogList[i];
                                                if (answerInfo.ID === minObj.UniqueID) {
                                                    if (answerInfo.Status === 1) {
                                                        isCorrect = answerInfo.Total === answerInfo.Score;
                                                        scoreStr = "(得分：" + answerInfo.Score + "分 / " + answerInfo.Total + "分)"
                                                    } else if (answerInfo.Status === 2) {
                                                        scoreStr = "(抱歉，计分失败了)";
                                                    } else if (answerInfo.Status === 0) {
                                                        scoreStr = "(正在阅卷中...)";
                                                    } else {
                                                        scoreStr = "(未知异常...)";
                                                    }
                                                    break;
                                                }
                                            }
                                        }

                                        let isPlay2 = (newAns === this.state.palyPath);
                                        let source2 = isPlay2 ? require("../imgs/aswerIcon/dt_rw_zt.png") : require("../imgs/aswerIcon/dt_rw_zt2.png");

                                        return (
                                            <View key={j} style={styles.contentSty}>
                                                {/* 小题 标题 */}
                                                <Text style={styles.minTitle}>{minObj.Title}</Text>
                                                <Text style={[styles.minTitle , (isCorrect ? styles.correctScore : styles.errorScore)]}>{scoreStr}</Text>
                                                {
                                                    (scoreStr === "(未作答)") ? <View /> : <TouchableOpacity onPress={() => {
                                                        if (isPlay2) {
                                                            Sound1.soundStop();
                                                        } else {
                                                            this.startPlay(newAns);
                                                        }
                                                    }}>
                                                        <Text style={[styles.specialTxt, styles.errorScore]} >
                                                            {"我的回答："}
                                                            <Image style={styles.audioBtn}
                                                                source={source2}
                                                            />
                                                        </Text>
                                                    </TouchableOpacity>
                                                }
                                                <TouchableOpacity onPress={() => {
                                                    if (isPlay) {
                                                        Sound1.soundStop();
                                                    } else {
                                                        this.startPlay(path);
                                                    }
                                                }} >
                                                    <Text style={[styles.specialTxt, styles.correctScore]}>
                                                        {"参考答案："}
                                                        <Image style={styles.audioBtn}
                                                            source={source}
                                                        />
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        );
                    })
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    contain: {
        //    backgroundColor:"#eeeeee",  
    },
    totalScore: {
        padding: 10,
        color: "#ff6169",
        textAlign: "center",
        fontSize: 18,
    },
    maxTitle: {
        padding: 10,
        color: "#333333",
        fontSize: 18,
        fontWeight: "600",
    },
    topObj: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginBottom: 30,
        // backgroundColor:"#eeeeee",  
    },
    audioInfo: {//音频对应文本描述
        // margin:10,
        padding: 10,
        // paddingBottom:0,
        // paddingTop:0,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: "flex-end",
        // backgroundColor:"#eeeeee",  
    },
    minTitle: {//小标题
        // margin:10,
        color: "#333333",
        fontSize: 16,
        fontWeight: "600",
        lineHeight: 26,
        textAlign: "justify",
    },
    audioBtn: {//原音频播放按钮
        width: utils.PLATNAME === "IOS" ? 16 : 32,
        height: utils.PLATNAME === "IOS" ? 16 : 32,
        resizeMode: "contain",
        alignItems: "center",
        position: "absolute",
        top: 8,
        bottom: 8,
    },
    articleTxt: {
        padding: 10,
        paddingTop: 0,
        paddingBottom: 0,
        color: "#333333",
        fontSize: 15,
        fontWeight: "400",
        lineHeight: 26,
    },
    specialTxt: {//文字图片混排
        color: "#333333",
        fontSize: 16,
        fontWeight: "400",
        lineHeight: 26,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: "flex-start",
        textAlign: "justify"
    },
    contentSty: {//每个小题
        margin: 10,
        marginBottom: 10,
        marginTop: 0,
    },
    correctScore: {//小题正确打分记录
        color: "#44bb55",
    },
    errorScore: {//小题错误打分记录
        color: "#ee6666",
    },
    resultBtn: {//正确、错误 图标
        width: utils.PLATNAME === "IOS" ? 18 : 32,
        height: utils.PLATNAME === "IOS" ? 12 : 24,
        resizeMode: "contain",
        // position:"absolute",
    }
});
