import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import utils from '../utils';
import MySound from "../utils/soundPlay";

let Sound1 = new MySound;
let timeInteval;

export default class AnsweredType2 extends Component {
    constructor() {
        super();
        this.startPlay = this.startPlay.bind(this);
        this.stopPlay = this.stopPlay.bind(this);
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

    stopPlay(){
        Sound1.soundStop();
        this.setState({
            palyPath: "",
        })
    }


    render() {
        let groupObj = this.props.groupObj;
        let localAnswer = this.props.localAnswer;
        let serverAnswer = this.props.serverAnswer;
        let examPath = this.props.examPath;
        let totalScore = ((serverAnswer.totalScore) === undefined ? "0.00" : serverAnswer.totalScore.toFixed(2)) + "分 / " + this.props.totalScore.toFixed(2) + "分";
        let topObj0 = groupObj.ExamTopics[0];
        let DescArr = [];
        return (
            <View style={styles.contain}>
                {/* 大题总分展示 */}
                <Text style={styles.totalScore}>{totalScore}</Text>
                {/* 大题标题 */}
                <Text style={styles.maxTitle}>{topObj0.Title}</Text>

                {
                    groupObj.ExamTopics.map((topObj, i) => {
                        {/* 判断是否加载过题目和音频 */ }
                        let isContain = DescArr.includes(topObj.Desc);
                        if (isContain === false)
                            DescArr.push(topObj.Desc);


                        {/* topObj */ }
                        let path = utils.findPlayPath(topObj.AudioPath, examPath);
                        let isPlay = (path === this.state.palyPath);
                        let source = isPlay ? require("../imgs/aswerIcon/dt_bf_icon.png") : require("../imgs/aswerIcon/dt_zt_icon.png");
                        return (
                            <View key={i} style={[styles.topObj,(isContain===true?{marginBottom: 0}:{marginBottom: 0})]}>
                                {
                                    (isContain === false) ? <View style={i>0?{marginTop:30*utils.SCREENRATE,}:{marginTop:10*utils.SCREENRATE,}}>
                                        {/* 小标题 */}
                                        <TouchableOpacity style={styles.audioInfo} onPress={() => {
                                            if (isPlay) {
                                                this.stopPlay();
                                            } else {
                                                this.startPlay(path);
                                            }
                                        }} >
                                            <Text style={styles.minTitle}>
                                                <Image style={styles.audioBtn}
                                                    source={source}
                                                />
                                                {" " + topObj.Desc}
                                            </Text>
                                        </TouchableOpacity>
                                        {/* 音频内容 */}
                                        <Text style={styles.articleTxt}>
                                            {topObj.AudioText}
                                            {/* <Image style={styles.audioBtn}
                                            source={require("../imgs/aswerIcon/dt_zt_icon.png")}
                                        /> */}
                                        </Text>
                                    </View> : <View />
                                }
                                {
                                    topObj.TopicInfoList.map((minObj, j) => {


                                        {/* 每小题 */ }
                                        let oriAns = minObj.Correct;
                                        let newAns = "";
                                        if (localAnswer && localAnswer[minObj.UniqueID] !== undefined){
                                            // newAns = localAnswer[minObj.UniqueID].answer; //绝对路径改为相对路径
                                            newAns=this.props.examPath + "/answer" + this.props.answerVersion + "/" + topObj.ID + ".wav";
                                        }
                                            
                                        // if (localAnswer && localAnswer[minObj.UniqueID] !== undefined)//修改为动态地址
                                        //     newAns = this.props.examPath + "/answer" + this.props.answerVersion + "/" + localAnswer[minObj.UniqueID].num + ".wav";

                                        let isCorrect = false;
                                        let scoreStr = "(未作答)";
                                        // alert(JSON.stringify(serverAnswer.LogList));
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
                                        let source = isPlay2 ? require("../imgs/aswerIcon/dt_rw_zt.png") : require("../imgs/aswerIcon/dt_rw_zt2.png");
                                        return (
                                            <View key={j} style={[styles.contentSty,]}>
                                                
                                                {
                                                    /* 小题 标题 */
                                                    (isContain === false) ? <Text style={styles.minTitle}>{minObj.Title}</Text> : <Text/>
                                                }
                                                {/* 得分情况 */}
                                                <Text style={[styles.specialTxt,isCorrect?styles.correctScore:styles.errorScore,{marginBottom:5}]}>{minObj.ID + ".  " + scoreStr}</Text>
                                                {
                                                    (scoreStr === "(未作答)") ? <View /> : <TouchableOpacity onPress={() => {
                                                        if (isPlay2) {
                                                            this.stopPlay();
                                                        } else {
                                                            this.startPlay(newAns);
                                                        }
                                                    }}>
                                                        <Text style={[styles.specialTxt, styles.errorScore]} >
                                                            {"我的回答："}
                                                            <Image style={styles.audioBtn}
                                                                source={source}
                                                            />
                                                        </Text>
                                                    </TouchableOpacity>
                                                }
                                                <Text style={[styles.specialTxt, styles.correctScore]} >{"参考答案："}</Text>
                                                {
                                                    minObj.ExampleAnswer.map((selObj, k) => {
                                                        {/* 每个参考答案 */ }
                                                        return (
                                                            <Text key={k} style={[styles.specialTxt, styles.correctScore]} >
                                                                {"" + selObj}
                                                            </Text>
                                                        )
                                                    })
                                                }
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
        marginBottom:20*utils.SCREENRATE,
        //    backgroundColor:"#eeeeee",  
    },
    totalScore: {
        padding: 10*utils.SCREENRATE,
        color: "#ff6169",
        textAlign: "center",
        fontSize: 18*utils.SCREENRATE,
    },
    maxTitle: {
        padding: 10*utils.SCREENRATE,
        color: "#333333",
        fontSize: 18*utils.SCREENRATE,
        fontWeight: "600",
    },
    topObj: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginBottom: 30*utils.SCREENRATE,
        // backgroundColor:"#eeeeee",  
    },
    audioInfo: {//音频对应文本描述
        // margin:10,
        padding: 10*utils.SCREENRATE,
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
        fontSize: 16*utils.SCREENRATE,
        fontWeight: "600",
        lineHeight: 26*utils.SCREENRATE,
        textAlign: "justify",
        marginBottom:10*utils.SCREENRATE,
    },
    audioBtn: {//原音频播放按钮
        width: utils.PLATNAME === "IOS" ? 16*utils.SCREENRATE : 32*utils.SCREENRATE,
        height: utils.PLATNAME === "IOS" ? 16*utils.SCREENRATE : 32*utils.SCREENRATE,
        resizeMode: "contain",
        alignItems: "center",
        position: "absolute",
        top: 8*utils.SCREENRATE,
        bottom: 8*utils.SCREENRATE,
    },
    articleTxt: {
        padding: 10*utils.SCREENRATE,
        paddingTop: 0,
        paddingBottom: 0,
        color: "#333333",
        fontSize: 15*utils.SCREENRATE,
        fontWeight: "400",
        lineHeight: 26*utils.SCREENRATE,
    },
    specialTxt: {//文字图片混排
        color: "#333333",
        fontSize: 16*utils.SCREENRATE,
        fontWeight: "400",
        lineHeight: 26*utils.SCREENRATE,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: "flex-start",
    },
    contentSty: {//每个小题
        margin: 10*utils.SCREENRATE,
        marginBottom: 0,
        marginTop: 0,
    },
    correctScore: {//小题正确打分记录
        color: "#44bb55",
    },
    errorScore: {//小题错误打分记录
        color: "#ee6666",
    },
    resultBtn: {//正确、错误 图标
        width: utils.PLATNAME === "IOS" ? 18*utils.SCREENRATE : 32*utils.SCREENRATE,
        height: utils.PLATNAME === "IOS" ? 12*utils.SCREENRATE : 24*utils.SCREENRATE,
        resizeMode: "contain",
        // position:"absolute",
    }
});
