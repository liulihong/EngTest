import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import utils from '../utils';

export default class AnsweredType1 extends Component {
    constructor() {
        super();
        this.state={
            currentScore:0.00
        }
    }

    render() {
        let groupObj = this.props.groupObj;
        let answerObj = this.props.answerObj;
        let totalScore = 0 + "分 / " + groupObj.TotalScore.toFixed(1) + "分";
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
                        return (
                            <View key={i} style={styles.topObj}>
                                {/* 小标题 */}
                                <TouchableOpacity  style={styles.audioInfo} onPress={() => { alert(topObj.AudioPath) }} >
                                    
                                    <Text style={styles.minTitle}>
                                        <Image style={styles.audioBtn}
                                            source={require("../imgs/aswerIcon/dt_zt_icon.png")}
                                        />
                                        { " " + topObj.Desc }
                                    </Text>
                                </TouchableOpacity>
                                {/* 音频内容 */}
                                <Text style={styles.articleTxt}>
                                        {topObj.AudioText}
                                        {/* <Image style={styles.audioBtn}
                                            source={require("../imgs/aswerIcon/dt_zt_icon.png")}
                                        /> */}
                                </Text>
                                {
                                    topObj.TopicInfoList.map((minObj, j) => {
                                        {/* 每小题 */ }
                                        let oriAns=minObj.Correct;
                                        let newAns=0;
                                        if(answerObj && answerObj[minObj.UniqueID]!==undefined)
                                            newAns=answerObj[minObj.UniqueID].answer;
                                        let isCorrect=oriAns===newAns;
                                        // if(isCorrect){
                                        //     let currScore=this.state.currentScore + minObj.Score ;
                                        //     this.setState({
                                        //         currentScore: currScore,
                                        //     });
                                        // }
                                        let scoreStr="  (未作答)" ;
                                        if(newAns!==0){
                                            let tempScore=isCorrect ? minObj.Score.toFixed(1) : "0" ;
                                            scoreStr="  (得分：" + tempScore + "分 / " + minObj.Score.toFixed(1) + "分)"
                                        }
                                        return (
                                            <View key={j} style={styles.contentSty}>
                                                {/* 小题 标题 */}
                                                <Text style={styles.minTitle}>
                                                    {minObj.Title}
                                                    <Text style={isCorrect?styles.correctScore:styles.errorScore}>{scoreStr}</Text>
                                                </Text>
                                                {
                                                    minObj.Answers.map((selObj,k) => {
                                                        {/* 每个选项 */ }
                                                        let source=require("../imgs/aswerIcon/dt_k.png");
                                                        let color = {};
                                                        if(newAns==k+1){
                                                            source=require("../imgs/aswerIcon/dt_cw.png");
                                                            color = styles.errorScore;
                                                        }
                                                        if(oriAns==k+1){
                                                            source=require("../imgs/aswerIcon/dt_zq.png");
                                                            color = styles.correctScore;
                                                        }
                                                            
                                                        return (
                                                            <Text key={k} style={[styles.specialTxt,color]} >
                                                                <Image style={styles.resultBtn}
                                                                    source={source}
                                                                />
                                                                { "  " + selObj }
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
        marginBottom:30,
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
        width:utils.PLATNAME==="IOS" ? 16 : 32,
        height:utils.PLATNAME==="IOS" ? 16 : 32,
        resizeMode: "contain",
        alignItems: "center",
        position:"absolute",
        top:8,
        bottom:8,
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
    },
    contentSty: {//每个小题
        margin: 10,
        marginBottom: 10,
        marginTop:0,
    },
    correctScore: {//小题正确打分记录
        color: "#44bb55",
    },
    errorScore: {//小题错误打分记录
        color: "#ee6666",
    },
    resultBtn: {//正确、错误 图标
        width: utils.PLATNAME==="IOS" ? 18 : 32,
        height: utils.PLATNAME==="IOS" ? 12 : 24,
        resizeMode: "contain",
        // position:"absolute",
    }
});
