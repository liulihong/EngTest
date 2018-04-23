import React, { Compnents, Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    ImageBackground,
    Image,
    ScrollView,
    DeviceEventEmitter,//引入监听事件
    Alert,
} from 'react-native';
import utils from '../utils'
import ProgressButton from "../components/progressButton"
import NavBar from '../components/navBar';
import { hostUrl, startExam } from "../request/requestUrl";
import { connect } from "react-redux";
import { getExamContent, setTestProgress, getTopicDetail, saveAnswerRecord, getAnswerBlow } from "../store/actions";
import FileManager from '../utils/FileManager';
import RNFS from 'react-native-fs';
import AnswerScreen from "./answerPage";
import { fetchPost } from "../request/fetch";

let totalScore = 0;
const typeEnum = { 1: '听后选择', 2: '听后回答', 3: '听后记录', 4: '转述信息', 5: '短文朗读', 10: '听后选图' };

const styles = StyleSheet.create({
    contain: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        height: utils.SCREENHEIGHT,
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    progress: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 30,
        height: utils.PLATNAME === "IOS" ? utils.SCREENHEIGHT - 240 : utils.SCREENHEIGHT - 220,
        // backgroundColor:"red",
    },
    whiteView: {
        backgroundColor: "white",
        width: "100%",
        height: 140,
        position: "absolute",
        bottom: 0,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        // alignItems: 'center',
    },
    scoreText: {
        color: utils.COLORS.theme1,
        fontSize: 16,
        margin: 7,
        padding: 10,
    },
    button: {
        height: 45,
        width: utils.SCREENWIDTH * 670 / 750,
        borderRadius: 6,
        backgroundColor: utils.COLORS.theme,
        justifyContent: 'center',
        // marginTop: 10,
        // marginBottom:50,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 18
    },
    button2: {
        height: 45,
        width: '35%',
        borderRadius: 6,
        backgroundColor: utils.COLORS.theme,
        justifyContent: 'center',
        margin: 15,
        marginTop: 45,
    }
});

class TestStart extends Component {

    constructor(props) {

        super(props)

        this.getLastRecord = this.getLastRecord.bind(this);
        this.getWhiteView = this.getWhiteView.bind(this);
        this.startTest = this.startTest.bind(this);
        this.againTest = this.againTest.bind(this);
        this.continueTest = this.continueTest.bind(this);
        this.showBlowInfo = this.showBlowInfo.bind(this);
        this.newStartExamLog = this.newStartExamLog.bind(this);
        this.prepareContinue = this.prepareContinue.bind(this);

    }

    //组件加载完成
    componentDidMount() {
        this.getLastRecord();
        let jsonPath = this.props.path + '/exam.json';
        FileManager.readFile(jsonPath, (result) => {
            this.props.getExamDetail(JSON.parse(result));
        });

        DeviceEventEmitter.addListener('ChangeUI', () => {
            //接收到详情页发送的通知，刷新首页的数据，改变按钮颜色和文字，刷新UI
            this.getLastRecord();
            // this.props.saveAnswerRecord();
        });
    }
    componentWillUnmount(){
        DeviceEventEmitter.removeAllListeners("ChangeUI");
    }

    //获取答题总记录
    getLastRecord() {
        let jsonPath = this.props.path + "/answer.json";
        RNFS.exists(jsonPath).then((isExit) => {
            if (isExit === true) {
                RNFS.readFile(jsonPath).then((result) => {
                    let anserDic = JSON.parse(result);
                    if (anserDic.UserID===undefined || anserDic.UserID === this.props.UserID) {
                        anserDic.examPath=this.props.path;
                        this.props.saveAnswerInfo(anserDic);
                    } else {
                        // 如果切换账号 删除弹丸文件夹
                        // RNFS.unlink(this.props.path+"/answer"+anserDic.version);
                    }

                })
            }
        });
    }

    //开始考试
    startTest() {
        this.newStartExamLog((LogInfo) => {
            let currPath=this.props.path + "/answer1";
            RNFS.mkdir(currPath).then(() => {
                let anserDic = { "version": 1, "lastPath": null, "examPath": this.props.path, currPath, "finish": false, ...LogInfo };
                this.props.getTopicInfo(this.props.examContent);
                this.props.saveAnswerInfo(anserDic);
                this.props.navigation.navigate('VideoTest');
            })
        });
    }

    //重新考试
    againTest() {
        this.newStartExamLog((LogInfo) => {
            let anserDic = this.props.answerRecord;
            let version = anserDic.version + 1;
            let lastPath = anserDic.currPath;
            let examPath = this.props.path;
            let currPath =  this.props.path + '/answer' + version;
            let finish = false;
            RNFS.mkdir(currPath).then(() => {
                this.props.getTopicInfo(this.props.examContent);
                this.props.saveAnswerInfo({ version, lastPath, examPath, currPath, finish, ...LogInfo });
                this.props.navigation.navigate('VideoTest');
                RNFS.unlink(this.props.path+anserDic.lastPath);
            })
        });
    }

    //开始考试记录
    newStartExamLog(callBack) {

        //检查网络
        if (this.props.netInfo !== undefined && this.props.netInfo.isConnected === false) {
            Alert.alert("", "请检查网络！");
            return;
        }

        if (this.props.navigation.state.params.isFinish === true)
            Alert.alert("", "作业已完成，现在为模拟练习");

        let UserID = this.props.UserID;
        let taskId = (this.props.navigation.state.params.isFinish === true) ? "" : this.props.taskId;
        
        if(this.props.answerRecord && this.props.answerRecord.isSubmit===true && this.props.navigation.state.params.isFinish === false){//如果已经提交过
            Alert.alert("","你已做完作业，现在为模拟练习");
            taskId="";
        } 
        let params = {
            "PaperID": this.props.navigation.state.params.ID,
            "UserID": UserID,
            "Total": totalScore,
            "TaskID": taskId,
        }
        fetchPost(startExam, params).then((result) => {
            // alert("开始考试记录:"+JSON.stringify(result));
            //result  LogID,TaskLogID
            let ishome = this.props.navigation.state.params.ishome == true && this.props.navigation.state.params.isFinish === false;
            let taskId = this.props.taskId;
            let isSubmit = false;//是否提交到服务器

            let examInfo = { ...result, taskId, ishome, isSubmit, UserID }
            callBack(examInfo);
        }, (error) => {
            Alert.alert("", error);
        })
    }


    prepareContinue() {

        //检查网络
        if (this.props.netInfo !== undefined && this.props.netInfo.isConnected === false) {
            Alert.alert("", "请检查网络！");
            return;
        }

        let anserDic = this.props.answerRecord;

        let ishome = this.props.navigation.state.params.ishome;

        if (this.props.answerRecord.ishome !== ishome && (this.props.navigation.state.params.isFinish !== true)) {//存储的类型和当前进入的类型比较 并且不是已完成
            if (ishome) {//当前是作业 上次记录是模拟
                Alert.alert('提示', '当前是作业,继续上次模拟？',
                    [
                        { text: "开始作业", onPress: () => { this.againTest() } },
                        { text: "继续模拟", onPress: () => { this.continueTest() } },
                    ]
                );
            } else {
                Alert.alert('提示', '当前是模拟,继续上次作业？',
                    [
                        { text: "开始模拟", onPress: () => { this.againTest() } },
                        { text: "继续作业", onPress: () => { this.continueTest() } },
                    ]
                );
            }
        } else {
            if (this.props.navigation.state.params.isFinish === true)
                Alert.alert("", "作业已完成，现在为模拟练习");

            this.continueTest();
        }
    }

    //继续考试
    continueTest() {
        let anserDic = this.props.answerRecord;
        let jsonPath = this.props.path + "/answer" + anserDic.version + "/answer.json";
        RNFS.exists(jsonPath).then((isExit) => {
            if (isExit === true) {
                RNFS.readFile(jsonPath).then((result) => {
                    let answerRecord = JSON.parse(result);
                    this.props.saveAnswerRecord(answerRecord);//获取之前答题记录
                    this.props.getTestProgress(anserDic);
                    this.props.navigation.navigate('VideoTest');
                })
            } else {
                this.props.getTestProgress(anserDic);
                this.props.navigation.navigate('VideoTest');
            }
        })

    }

    //显示上次答题
    showBlowInfo() {
        let anserDic = this.props.answerRecord;
        let version = anserDic.version;
        let jsonPath = this.props.path + '/answer' + version + "/answer.json";
        // alert(jsonPath);

        RNFS.exists(jsonPath).then((isExit) => {
            if (isExit === true) {
                RNFS.readFile(jsonPath).then((result) => {
                    let answerRecord = JSON.parse(result);
                    this.props.saveAnswerRecord(answerRecord);//获取之前答题记录

                    this.props.navigation.navigate('AnswerScreen');
                })
            } else {
                Alert.alert("", "亲，您上次交了白卷哦！")
            }
        })
    }

    getWhiteView() {
        let anserDic = this.props.answerRecord;

        if (anserDic === undefined) {//为开始考试 考试标题
            return <View style={styles.whiteView}>
                <View><Text style={styles.scoreText}>{this.props.examContent && this.props.examContent.PriTitle}</Text></View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={()=>utils.callOnceInInterval(this.startTest,2000)}
                >
                    <Text style={styles.buttonText}>{"开始考试"}</Text>
                </TouchableOpacity>
            </View>
        } else if (anserDic.finish === true) {//当前考试已完成  显示 重新考试 查看最近成绩
            return <View style={styles.whiteView}>

                {
                    (this.props.answerRecord.isSubmit === undefined || this.props.answerRecord.isSubmit === true ) ? 
                    <TouchableOpacity onPress={() => utils.callOnceInInterval(this.showBlowInfo,2000)}>
                        <Text style={styles.scoreText}>{"查看考试记录 > "}</Text>
                    </TouchableOpacity> : <View><Text style={styles.scoreText}>{this.props.examContent && this.props.examContent.PriTitle}</Text></View>
                }

                <TouchableOpacity
                    style={styles.button}
                    onPress={()=>utils.callOnceInInterval(this.againTest,2000)}
                >
                    <Text style={styles.buttonText}>{"重新考试"}</Text>
                </TouchableOpacity>
            </View>
        } else {//考试考一半  显示  继续考试 重新考试
            return <View style={styles.whiteView}>
                <TouchableOpacity
                    style={styles.button2}
                    onPress={()=>utils.callOnceInInterval(this.againTest,2000)}
                >
                    <Text style={styles.buttonText}>{"重新考试"}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button2}
                    onPress={()=>utils.callOnceInInterval(this.prepareContinue,2000)}
                >
                    <Text style={styles.buttonText}>{"继续考试"}</Text>
                </TouchableOpacity>
            </View>
        }
    }

    componentWillReceiveProps(nextProps) {

    }


    render() {
        let answerRecord = this.props.answerRecord;
        let selectType = this.props.examContent ? this.props.examContent.Groups[0].Type : 0;
        if (answerRecord !== undefined && answerRecord.finish === false && answerRecord.gropObj !== undefined && answerRecord.gropObj !== null) {
            selectType = answerRecord.gropObj.Type;
        }
        return (

            <ImageBackground
                source={require("../imgs/testIcon/cj_bg.png")}
                style={styles.contain}
            >

                <NavBar navtitle={this.props.examContent ? this.props.examContent.SecTitle : ''} isBack={true} navgation={this.props.navigation} />

                <View style={styles.progress}>
                    <ScrollView>
                        {
                            this.props.examContent && this.props.examContent.Groups.map((element, i) => {
                                element.ExamTopics.map((topObj, j) => {
                                    topObj.TopicInfoList.map((sObj, k) => {
                                        totalScore = (i === 0 && j === 0 && k === 0) ? sObj.Score : (sObj.Score + totalScore);
                                    })
                                })

                                const isSelect = element.Type === selectType;
                                const num = i + 1;
                                const title = typeEnum[element.Type];
                                return <ProgressButton key={element.Type} isSelect={isSelect} num={num} title={title} />
                            })
                        }
                    </ScrollView>
                </View>

                {
                    this.getWhiteView()
                }


            </ImageBackground>
        );
    }
}

const mapStateToProps = (state) => {
    const UserID = state.userInfo.logResult.ID;
    const path = state.detail.currentExamPath;
    const taskId = state.detail.taskId;
    const examContent = state.detail.examContent;
    let answerRecord = state.detail.answerRecord;
    const netInfo = state.userInfo.netInfo;
    return {
        path,
        examContent,
        answerRecord,
        UserID,
        taskId,
        netInfo,
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        getExamDetail: (result) => {
            dispatch(getExamContent(result));
        },
        getTopicInfo: (detail) => {
            dispatch(getTopicDetail(detail));
        },
        saveAnswerInfo: (answerDic) => {
            dispatch(saveAnswerRecord(answerDic));
        },
        getTestProgress: (data) => {
            dispatch(setTestProgress(data));
        },
        saveAnswerRecord: (answerRecord) => {
            dispatch(getAnswerBlow(answerRecord));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TestStart);