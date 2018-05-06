import React, { Component } from 'react';
import { DeviceEventEmitter, ScrollView, StyleSheet, View, Button, TouchableOpacity, Text, ImageBackground, Alert } from 'react-native';
import { downFaild, GetCommon, getMovieList, saveDownUrl, startDown } from "../store/actions";
import { connect } from "react-redux";
import AnswerCom from '../components/answerCom';
import NavBar from '../components/navBar';
import { getExamLog } from "../request/requestUrl";
import { fetchPost } from "../request/fetch";
import ProgressButton from "../components/progressButton";
import utils from '../utils';
const typeEnum = { 1: '听后选择', 2: '听后回答', 3: '听后记录', 4: '转述信息', 5: '短文朗读', 10: '听后选图' };

// let getScoreTnterval;

class AnswerScreen extends Component {

    constructor(props) {
        super(props);
        this.getExamAnserInfo = this.getExamAnserInfo.bind(this);

        this.state = {
            serverAnswer: {},
            resetAnswer: {},
            scoreFinish: true,//计分状态为计分完成

            isTop: false,
            isBottom: false,
        }

        this.getExamAnserInfo();

        this.scrHeight = utils.SCREENHEIGHT - (496 / 2 * utils.SCREENRATE) - (utils.PLATNAME === "IOS" ? 35 : 55);
    }

    componentDidMount() {
        DeviceEventEmitter.addListener("reloadAnswerDetail", () => {
            if (this.state.scoreFinish === false) {
                this.getExamAnserInfo();
            }
        });
        this.timeInteval = setInterval(() => {
            if (this.state.scoreFinish === false) {
                this.getExamAnserInfo();
            } else
                clearInterval(this.timeInteval);
        }, 5 * 1000);
    }
    componentWillUnmount() {
        DeviceEventEmitter.removeAllListeners("reloadAnswerDetail");
        clearInterval(this.timeInteval);
    }

    getExamAnserInfo() {
        let LogID = this.props.answerRecord.LogID;
        fetchPost(getExamLog, { LogID }).then((result) => {
            // alert("result: "+JSON.stringify(result));
            if (result.LogList !== undefined) {
                this.setState({
                    scoreFinish: true,
                });
                let tempObj = {};
                for (let i = 0; i < result.LogList.length; i++) {
                    ansObj = result.LogList[i];
                    if (ansObj.Status === 0) {//如果状态为计分中 试卷计分状态为计分中
                        this.setState({
                            scoreFinish: false,
                        });
                    }
                    if (tempObj[ansObj.Type] === undefined)
                        tempObj[ansObj.Type] = {
                            totalScore: 0,
                            LogList: [],
                        }
                    tempObj[ansObj.Type].totalScore = ansObj.Score + tempObj[ansObj.Type].totalScore;
                    tempObj[ansObj.Type].LogList.push(ansObj);
                }
                this.setState({
                    serverAnswer: result,
                    resetAnswer: tempObj,
                });
                console.log(tempObj);
            } else
                Alert.alert("", utils.findErrorInfo(result));
        }, (error) => {
            Alert.alert("", utils.findErrorInfo(error));
        })
    }


    render() {
        if (this.props.answers === undefined) {
            return <Text>{"亲！ 您交了白卷。。。"}</Text>
        }
        let scoreTxt = "正在计分\n请稍后";
        if (this.state.scoreFinish === true) {
            if (this.state.serverAnswer !== undefined && this.state.serverAnswer.Status === 2) {
                scoreTxt = "得分\n" + ((this.state.serverAnswer !== {}) ? this.state.serverAnswer.Score.toFixed(2) : 0.00) + "分";
            }
        }

        return <View style={styles.contain}>
            <ImageBackground
                source={require("../imgs/testIcon/cj_bg.png")}
                style={styles.headImg}
            >
                <NavBar
                    navtitle={this.props.examContent ? this.props.examContent.SecTitle : ''}
                    isBack={true}
                    navgation={this.props.navigation}
                    backClear={true}
                />
                <ImageBackground
                    style={styles.totalScore}
                    source={require("../imgs/aswerIcon/cjzh_icon.png")}>
                    <Text style={[styles.scoreTxt, { color: (scoreTxt === "正在计分\n请稍后") ? "#fc9141" : "#ff0000" }]}>{scoreTxt}</Text>
                </ImageBackground>
                <View style={styles.userInfo}>
                    <Text style={styles.userTxt}>{"姓名："+(this.props.logResult.Name?this.props.logResult.Name:this.props.logResult.LoginName)}</Text>
                    <Text style={styles.userTxt}>{"类型："+(this.props.answerRecord.ishome?"作业":"模拟练习")}</Text>
                    <Text style={styles.userTxt}>{"时间："+((this.state.serverAnswer&&this.state.serverAnswer.StartTime)?(utils.getTimeStr(this.state.serverAnswer.StartTime,"MM-dd hh:mm")):"")}</Text>
                    <Text style={styles.userTxt}>{"用时："+((this.state.serverAnswer&&this.state.serverAnswer.StartTime)?(utils.getTimeCha(this.state.serverAnswer.StartTime,this.state.serverAnswer.EndTime)):"")}</Text>
                </View>
                {
                    this.state.isTop === false ? <TouchableOpacity style={[styles.maxBtn, { position: "absolute", bottom: 0,height:40*utils.SCREENRATE }]}
                        onPress={() => {
                            this._scroll.scrollTo({ y: 0 });
                        }}
                    >
                        <Text style={{ color: "#cccccc", fontSize: 18 * utils.SCREENRATE }}>{"︽"}</Text>
                    </TouchableOpacity> : <View style={[styles.maxBtn, { position: "absolute", bottom: 0 }]} />
                }
            </ImageBackground>
            <ScrollView
                style={styles.scrInfo}
                ref={(scroll) => this._scroll = scroll}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={(contentWidth, contentHeight) => {
                    this.contentHeight = contentHeight;
                    let isMax = (contentHeight - 20 * utils.SCREENRATE) > this.scrHeight;
                    this.setState({ isTop: !isMax, isBottom: !isMax });
                }}
            >
                {/* <AnswerCom answers={this.props.answers} /> */}
                {
                    this.props.examContent && this.props.examContent.Groups.map((element, i) => {
                        const isSelect = false;
                        const num = i + 1;
                        const title = typeEnum[element.Type];
                        const totalScore = (this.state.resetAnswer[element.Type] !== undefined) ? this.state.resetAnswer[element.Type].totalScore : 0.00;
                        const sResetAnswer = (this.state.resetAnswer[element.Type] !== undefined) ? this.state.resetAnswer[element.Type] : {};

                        let tempScore = 0;//计算大题题目总分.
                        element.ExamTopics.map((topObj) => {
                            topObj.TopicInfoList.map((sObj) => {
                                tempScore += sObj.Score;
                            })
                        })
                        // alert(JSON.stringify(sResetAnswer));

                        let newTitle = title + ' ( ' + totalScore.toFixed(2) + ' / ' + tempScore.toFixed(2) + ' )';
                        let examPath = this.props.currentExamPath;
                        return (
                            <TouchableOpacity key={element.Type} onPress={() => {
                                let tempScore = 0;//计算大题题目总分
                                element.ExamTopics.map((topObj) => {
                                    topObj.TopicInfoList.map((sObj) => {
                                        tempScore += sObj.Score;
                                    })
                                })
                                this.props.navigation.navigate("AnsweredDetail",
                                    {
                                        localAnswer: this.props.answers,
                                        answerVersion: this.props.answerRecord.version,
                                        serverAnswer: sResetAnswer,
                                        title: title,
                                        content: element,
                                        examPath: examPath,
                                        totalScore: tempScore
                                    });
                            }} >
                                <ProgressButton backStyle={{ backgroundColor: utils.COLORS.theme }} isSelect={isSelect} num={num} title={newTitle} />
                            </TouchableOpacity>

                        )
                    })
                }
            </ScrollView>
            {this.state.isBottom===false?<TouchableOpacity style={[styles.maxBtn, { height: (utils.PLATNAME === "IOS" ? 35 : 55), paddingTop: (utils.PLATNAME === "IOS" ? 8 : 3), justifyContent: "flex-start" }]}
                onPress={() => {
                    this._scroll.scrollToEnd();
                }}
            >
                <Text style={{ color: "#cccccc", fontSize: 18 * utils.SCREENRATE }}>{"︾"}</Text>
            </TouchableOpacity>:<View style={[styles.maxBtn, { height: (utils.PLATNAME === "IOS" ? 35 : 55), paddingTop: (utils.PLATNAME === "IOS" ? 8 : 3), justifyContent: "flex-start" }]} />}
        </View>
    }

}

const mapStateToProps = (state) => {
    let logResult = state.userInfo.logResult
    let answerRecord = state.detail.answerRecord;
    let answers = state.detail.answers;
    let examContent = state.detail.examContent;
    let currentExamPath = state.detail.currentExamPath;
    return {
        answers,
        answerRecord,
        examContent,
        currentExamPath,
        logResult,
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        GetPaperList: () => {
            dispatch(getMovieList())
        },
        getCommon: () => {
            dispatch(GetCommon())
        },
        saveUrl: (obj) => {
            dispatch(saveDownUrl(obj))
        },
        startDown: () => {
            dispatch(startDown({}))
        },
        downFaild: () => {
            dispatch(downFaild({}))
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AnswerScreen);


const styles = StyleSheet.create({
    contain: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        height: utils.SCREENHEIGHT,
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: "white",
    },
    headImg: {
        width: '100%',
        height: 496 / 2 * utils.SCREENRATE,
    },
    maxBtn: {
        backgroundColor: "rgba(1,0,0,0)",
        width: "100%",
        height: 30 * utils.SCREENRATE,
        alignItems: "center",
        justifyContent: "center",
    },
    scrInfo: {
        // width:"100%",
        height: utils.SCREENHEIGHT - (496 / 2 * utils.SCREENRATE) - (utils.PLATNAME === "IOS" ? 35 : 55),
        // height:200,
        // backgroundColor: "red",
        // alignItems:"center",
    },
    totalScore: {
        width: 332/2 * utils.SCREENRATE,
        height: 245/2 * utils.SCREENRATE,
        paddingTop: 40 * utils.SCREENRATE,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        // alignSelf: "center",
        // marginTop: 10 * utils.SCREENRATE,
        // marginBottom: 30 * utils.SCREENRATE,
        position: "absolute",
        right: 6*utils.SCREENRATE,
        bottom: 55*utils.SCREENRATE+(utils.PLATNAME==="IOS"?0:10),
    },
    scoreTxt: {
        color: "#ffffff",
        fontSize: 18 * utils.SCREENRATE,
        fontWeight: "500",
        textAlign: "center",
    },
    userInfo: {
        marginTop:14*utils.SCREENRATE,
        marginLeft:25*utils.SCREENRATE,
        width:"100%",
        // height:"40%",
        // backgroundColor:"rgba(0,0,0,0.1)",
        flexDirection:"column",
    },
    userTxt:{
        color: "#ffffff",
        fontSize: 16 * utils.SCREENRATE,
        lineHeight:26 * utils.SCREENRATE,
        fontWeight: "400",
        textAlign: "left",
        width:"100%",
    },
});
